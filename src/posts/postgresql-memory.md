---
title: "PostgreSQLのメモリ管理を考える（主にwork_memについて）"
date: "2020-12-13"
tags: ["PostgreSQL"]
---

## はじめに

本記事は[PostgreSQL Advent Calendar 2020](https://qiita.com/advent-calendar/2020/postgresql)の10日目です。
PostgreSQLのメモリ管理についていろいろと壁にぶつかったのでわかる範囲で知見をまとめていきたいと思います。
PostgreSQLのバージョンは13.1で検証しています。

## なぜメモリ管理を適切にする必要があるのか

そもそもですが、なぜメモリ管理を適切にする必要があるのでしょうか。
簡潔に言うと **パフォーマンスと安定性のため** と言えるかと思います。

まず、データベースのデータはすべてファイルとしてディスクに保存することで永続化されます。
データを取得・更新する際にはディスクへの読み書きが発生するのですが、これはメモリに比べて非常に遅いことが知られています。
では、可能な限りメモリから読み書きするようにすればいいのかというと、通常データベースが扱うサイズは搭載メモリサイズよりも大きいことが多く、搭載メモリ以上にメモリを使用しようとするとOOMエラーが発生しシステム全体がダウンしてしまう可能性もあります。
そのため、安定性を保った上でパフォーマンスが向上するよう適切なメモリ管理を行う必要があります。

## PostgreSQLのプロセス構成

メモリ管理の前に簡単にPostgreSQLのプロセス構成を知る必要があります。
下記はPostgreSQLが動くサーバ上でpostgresに関連するプロセスを表示した結果です。

```sh
$ ps aux | grep postgres
postgres     1  0.0  0.3 213892 26500 ?        Ss   Dec05   0:07 postgres
postgres    66  0.0  0.8 214024 70144 ?        Ss   Dec05   0:00 postgres: checkpointer
postgres    67  0.0  0.0 213892  5688 ?        Ss   Dec05   0:01 postgres: background writer
postgres    68  0.0  0.1 213892  9980 ?        Ss   Dec05   0:02 postgres: walwriter
postgres    69  0.0  0.1 214448  8528 ?        Ss   Dec05   0:07 postgres: autovacuum launcher
postgres    70  0.0  0.0  68540  5640 ?        Ss   Dec05   0:14 postgres: stats collector
postgres    71  0.0  0.0 214324  6756 ?        Ss   Dec05   0:00 postgres: logical replication launcher
postgres  8833  0.0  0.1 214824 14232 ?        Ss   01:35   0:00 postgres: pguser pguser [local] idle
postgres  9082  0.0  0.1 214824 11688 ?        Ss   02:11   0:00 postgres: pguser pguser [local] idle in transaction
```

複数のプロセスからPostgreSQLが成り立っていることがわかりますが、重要なのは下記図のように全体を管理するマスタプロセス、walwriterのようにPostgreSQLの重要な作業を担うプロセス、接続ごとに作られるバックエンドプロセスの**3種に分けられるマルチプロセス構成**であることです。
（ちなみにMySQLはマルチプロセス構成ではなく、マルチスレッド構成なのでこのように複数のプロセスに分かれていません。）

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/65636/7853b979-3dc3-d14d-264a-a18718f03adf.png)

重要な作業を担うプロセスたちについては説明を割愛しますが、これらのプロセスも当然メモリを使用しています。
バックエンドプロセスは`pguser pguser [local] idle`などとなっているもので、これらのプロセスは接続ごとに自分だけのメモリ域を持ちます。詳しくは次で説明します。

## 共有メモリ域とプロセスメモリ域

PostgreSQLのメモリ管理は共有メモリ域とプロセスメモリ域の2つに大別されます。
共有メモリ域はPostgreSQL全体が使用する領域で、**どのプロセスからでも参照できます。**この領域はサーバ起動時のみ確保領域が決定されます。shared_buffers, wal_buffers, Free Space Map, Visibility Mapが存在します。
プロセスメモリ域はバックエンドプロセスごとに確保される作業用のメモリ域で**メモリ領域を確保したプロセスのみが参照可能です。**この領域はプロセスごとにSETコマンドで途中から確保領域を決められます。work_mem, maintenance_work_mem, temp_buffersが存在します。

この中で特に重要なshared_buffersとwork_memについて解説します。

### shared_buffers（共有メモリ域）

テーブルやインデックスのデータなどがキャッシュされます。
初期値は128MBですが、これはかなり小さい値で、公式では**1GB以上のRAMがあれば1/4のサイズを割り当てるのが妥当**と言われています。

> 1GB以上のRAMを載せた専用データベースサーバを使用している場合、shared_buffersに対する妥当な初期値はシステムメモリの25%です。

それ以上割り当てることが有効なケースもありますが、大きすぎるサイズを割り当てるとバッファ探索にかかる時間も増えてしまうため、大きくしすぎないことも重要なようです。

> shared_buffersをこれよりも大きな値に設定することが有効なワークロードもあります。 しかし、PostgreSQLはオペレーティングシステムキャッシュにも依存するため、shared_buffersにRAMの40%以上を割り当てても、それより小さい値の時より動作が良くなる見込みはありません。

### work_mem（プロセスメモリ域）

クエリ中の並び替えやハッシュテーブル操作など一部の操作で使用する最大メモリサイズを決定します。初期値は4MBです。
特にORDER BY, JOIN, GROUP BYなどを使用するクエリのパフォーマンスを考慮するときこの値は重要です。

試しにwork_memを変えることでどの程度実行時間が異なるのか実験してみます。

```sql
-- レコード数を増やすためのテーブルを作成
create table digit(num integer);
insert into digit values (0), (1), (2), (3), (4), (5), (6), (7), (8), (9);

-- 1から1000までのランダムな数値列を持つ10万件のテーブルを作成
create table sales (user_id int, amount int);
insert into sales (select ceil(random() * 10) as user_id, ceil(random() * 1000) as amount from digit d1, digit d2, digit d3, digit d4, digit d5);
```

このsalesテーブルに対してwork_memを変動させてクエリを投げてみます。

#### work_memが異なる値でのクエリの比較

##### work_memが小さいとき

```sql
set work_mem='128kB';
explain analyze select * from sales order by amount;
```

```sql
                                                    QUERY PLAN
------------------------------------------------------------------------------------------------------------------
 Sort  (cost=12484.82..12734.82 rows=100000 width=8) (actual time=53.370..62.647 rows=100000 loops=1)
   Sort Key: amount
   Sort Method: external merge  Disk: 1784kB
   ->  Seq Scan on sales  (cost=0.00..1443.00 rows=100000 width=8) (actual time=0.011..7.197 rows=100000 loops=1)
 Planning Time: 0.049 ms
 Execution Time: 65.617 ms
(6 rows)
```

##### work_memが十分にあるとき

```sql
set work_mem='8MB';
explain analyze select * from sales order by amount;
```

```sql
                                                    QUERY PLAN
------------------------------------------------------------------------------------------------------------------
 Sort  (cost=9747.82..9997.82 rows=100000 width=8) (actual time=22.454..33.987 rows=100000 loops=1)
   Sort Key: amount
   Sort Method: quicksort  Memory: 7419kB
   ->  Seq Scan on sales  (cost=0.00..1443.00 rows=100000 width=8) (actual time=0.014..6.927 rows=100000 loops=1)
 Planning Time: 0.047 ms
 Execution Time: 37.011 ms
(6 rows)
```

単純なランダムな数値列の並び替えでのSELECTクエリで128kBと8MBで比較してみました。
単純な実行時間では65ms, 37msと約2倍の差が出ました。
実行計画を読むとwork_memが小さいときは `Disk: 1784kB` とディスクを使用しているのに対し、work_memが十分にあるときは `quicksort  Memory: 7419kB` とメモリを使用したクイックソートが行われているのがわかります。
なお、並び替えのない単純な `select * from sales` ではこのwork_memの比較でもほとんど実行時間に差がありませんでした。
このことからどのようなクエリでもwork_memを増やすことで効果があるわけではなく、一時的にメモリを使用するような一部のクエリで効果が見込めることがわかります。

※おそらくディスクキャッシュなどもあるため、メモリとディスクの違いがあれば必ずこの程度の性能差が出るとも限らず、データ量やクエリによっては一方がメモリ、一方がディスクから読む場合でもほぼ実行時間が変わらないケースもありました。

今回はORDER BYを使用したクエリで実験してみましたが、下記のように一時的にメモリを使用するようなクエリは多いので、かなりのケースで有効だと言えると思います。

> 並び替え操作はORDER BY、DISTINCT、およびマージ結合に対して使われます。 ハッシュテーブルはハッシュ結合、ハッシュに基づいた集約、およびIN副問い合わせのハッシュに基づいた処理で使用されます。

ただし、work_memのサイズの決定は概ねメモリの1/4を設定するのがベストプラクティスとなっているshared_buffersよりも難しく、ここを誤ると**一部のクエリではパフォーマンスが向上しても安定性に欠けるおそれ**が出てきます。

#### work_memのサイズの決定

work_memが大きければ一部クエリで効果が見込めることはわかりましたが、work_memを大きすぎる値にすることは下記の理由でOOMエラーの危険をともないます。

- バックエンドプロセスごとにそれぞれのwork_memが存在している
- work_memは1クエリの中で使用される最大メモリサイズとは限らない
- プランナは空きメモリ量から実行計画を決定しない、また見積もりは必ずしも正確ではない

##### バックエンドプロセスごとにそれぞれのwork_memが存在している

こちらは上述したとおりで、work_memはプロセスメモリ域に属するのでバックエンドプロセスごとに存在します。
バックエンドプロセスは最大でmax_connectionsまで増加するので同時にそれらが接続され、work_memを使用するクエリが投げられた場合、少なくとも`max_connections * work_mem`分のメモリが消費されます。

##### work_memは1クエリの中で使用される最大メモリサイズとは限らない

複雑なクエリでは、1クエリ内で同時に並び替えやJOIN, GROUP BYのハッシュ操作を行うことがありますが、これらの場合そのような操作ごとにwork_memを消費します。
つまり、バックエンドプロセスが1つだったとしても、**クエリによっては指定したwork_memの数倍のメモリが消費される**ことがあります。
また、PostgreSQLにはパラレルクエリという仕組みがあり、1クエリを投げたつもりでも複数クエリで並行して読み込むことが適した大きいデータであるなどとプランナが判断した場合には、複数のクエリが並行して投げれられます。
1クエリで使用されるパラレルワーカーの数はmax_parallel_workers_per_gatherで決定されます。
複雑なクエリである場合と、**パラレルクエリにより1プロセス内でもwork_memの数倍のメモリサイズが消費される**場合があります。
このことはバックエンドプロセスごとにそれぞれのwork_memが存在していることと合わせて公式でも次のように説明されています。

> 複雑な問い合わせの場合、いくつかの並び替えもしくはハッシュ操作が並行して実行されることに注意してください。 それぞれの操作による一時メモリへの書き込み開始の前に、この値が指定するのと同じメモリ容量の使用をそれらの操作に許容します。 さらに、いくつかの実行中のセッションはこれらの動作を同時に行います。 したがって、使用されるメモリの合計は、work_memの数倍になります。

##### プランナは空きメモリ量から実行計画を決定しない、また見積もりは必ずしも正確ではない

仮に最悪ケースで搭載メモリ量を超えるwork_memを指定したとしても、実際にその最悪ケースのときにはメモリを使わずディスクから読み書きするようにプランナが実行計画を変えてくれるのでは？とも思えます。
しかし、ソースは見つからなかったのですが、挙動を見ている限りでは実行計画は空きメモリ量を判断材料に加えていることはありません。
おそらくは、テーブル行数などの統計情報、work_memなどのメモリ設定、クエリ自体から最適な実行計画を判断していると思われ、仮にその時点で空きメモリ量がほとんどなかったとしても、上記から計算される実行計画がメモリをフルに使用するものであれば構わず使ってしまうのです。

例えば、work_memの計算にmax_parallel_workers_per_gatherを入れずに設定したところ、CPUコア数の多い環境ではパラレルクエリが実行されることで推測していた数倍のwork_memが使用された結果システムがダウンするということがありました。

また、これはwork_memのサイズをどう決定しても起き得る話なのですが、プランナが出す実行計画は統計情報などを元に決定されますが、この統計情報を正しく使用できないケースが存在します。
例えば、ビューやCTEは統計情報を持たないので、これらに対しGROUP BYをかけると正しい行数を見積もれず、本来であれば巨大なハッシュテーブルをメモリ上に作成できないためHash AggregateではなくGroup Aggregateを使うべきところが、Hash Aggregateを使用してしまいダウンするというケースがありました。
もちろん、ビューもCTEも元となるテーブルがあるため遡れば統計情報を活用できるはずですが、集約のkeyとなる列に対して変更が入っているなどすると正しく統計情報を使用できないことがあるようです。

※なお、PostgreSQL13ではこの問題は改善されておりwork_mem以上のハッシュテーブルになる場合はディスクを使用するようになっているため、OOMエラーを起こすことはなくなりました。
ただし、上記のように見積もりを誤ることは依然としてあるため、Group Aggregateの方が高速だがHash Aggregateを使用してしまうケースなどは存在します。

> Allow hash aggregation to use disk storage for large aggregation result sets (Jeff Davis)
Previously, hash aggregation was avoided if it was expected to use more than work_mem memory. Now, a hash aggregation plan can be chosen despite that. The hash table will be spilled to disk if it exceeds work_mem times hash_mem_multiplier.

[PostgreSQL 13.0 Release Notes](https://www.postgresql.org/docs/release/13.0/)

##### では、work_memのサイズはどう決定すればいいのか？

ここまでの話からwork_memには少なくとも下記の因子が関わることがわかりました。

- max_connections：最大接続数
- max_parallel_workers_per_gather: 1プロセスでの最大のパラレルワーカー数
- 1クエリでの並び替えやJOIN, GROUP BYのハッシュ操作の数

また、ここでwork_memが使用できる領域はデータベースが使用できるメモリサイズからshared_buffersなどの共有メモリ領域はあらかじめ引いた方が得策です。
PostgreSQLのチューニングサイトで有名な[PGTune](https://pgtune.leopard.in.ua/#/)ではwork_memの設定に関して以下のようにコメントがあります。

> work_mem is assigned any time a query calls for a sort, or a hash, or any other structure that needs a space allocation, which can happen multiple times per query. So you're better off assuming max_connections \* 2 or max_connections \* 3 is the amount of RAM that will actually use in reality. At the very least, you need to subtract shared_buffers from the amount you're distributing to connections in work_mem.
The other thing to consider is that there's no reason to run on the edge of available memory. If you do that, there's a very high risk the out-of-memory killer will come along and start killing PostgreSQL backends. Always leave a buffer of some kind in case of spikes in memory usage. So your maximum amount of memory available in work_mem should be ((RAM - shared_buffers) / (max_connections \* 3) / max_parallel_workers_per_gather).

そして、計算方法は次のようになっています。
`(RAM - shared_buffers) / (max_connections * 3) / max_parallel_workers_per_gather`

では、**max_connectionsやmax_parallel_workers_per_gatherはどう決定すればよいかが決まればwork_memも決めることができそう**です。
max_connectionsは自分が運用しているシステムの特性にも大きく関わってくるので一概には言うことができません。
PGTuneでもWebアプリであれば200, DWHであれば40とするなどしており、運用しているシステムがどれくらいの接続を見込んでいるかから決めるのがよいです。
max_connectionsに掛けられている3の係数ですが、これは上述した「1クエリでの並び替えやJOIN, GROUP BYのハッシュ操作の数」であり、これも自分が運用するシステムによってある程度決めるべきでしょう。大概は3程度あれば十分なように思います。
max_parallel_workers_per_gatherは、CPUコア数の1/2とするのがベストプラクティスのようです。

## まとめ

- パフォーマンスと安定性向上のためメモリ管理を行う
- PostgreSQLはマスタプロセス、WALライタなどの特殊なプロセス、接続ごとのバックエンドプロセスのマルチプロセス構成
- PostgreSQLには共有メモリ域とバックエンドプロセスごとのプロセスメモリ域が存在する
- 共有メモリ域で重要なshared_buffersは概ね割当メモリの1/4がベストプラクティス
- プロセスメモリ域で重要なwork_memは`(RAM - shared_buffers) / (max_connections * 3) / max_parallel_workers_per_gather`がベストプラクティス
  - max_connectionsや係数である3などは自らが運用するシステム次第で決定すること
  - max_parallel_workers_per_gatherはCPUコア数の1/2がベストプラクティス

## 参考情報

- [PostgreSQL 第19章 サーバの設定](https://www.postgresql.jp/document/12/html/runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
- [内部構造から学ぶPostgreSQL 設計・運用計画の鉄則](https://www.amazon.co.jp/dp/4297100894/ref=cm_sw_r_tw_dp_x_AliZFbDFX6MSN)
- [PGTune](https://www.postgresql.org/docs/release/13.0/)
