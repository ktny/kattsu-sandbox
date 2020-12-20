---
title: "PostgreSQLでbaseディレクトリ内の孤立したテーブルデータを削除する方法"
date: "2020-05-27"
tags: ["PostgreSQL"]
---

## はじめに

以前、それほど巨大なテーブルはないにも関わらずPostgreSQL内のデータファイルでディスク容量が逼迫してしまうという事態に陥ったことがありました。
調査してみるとPostgreSQL内のbaseディレクトリにたしかに巨大なテーブルファイル（すべてあわせて500GBを超える）が存在していましたが、このテーブルファイルは論理的なテーブルとしては存在しない孤立ファイルでした。
PostgreSQLでは論理的なテーブルが削除されれば、CHECKPOINTなどのタイミングで物理的にもファイルは削除されるはずです。
論理的なテーブルは存在しないのに、物理的なファイルのみ存在するとそれを論理側から削除する方法もなくゴミデータとしてディスクを圧迫してしまいます。
なぜ、孤立ファイルができてしまったか、その確認方法、削除方法などについて書いていきます。

ちなみに、PostgreSQLのテーブルデータの物理的な保存については下記記事にも書きました。
[【PostgreSQL】テーブルデータ・インデックスの物理的な保存とログ先行書き込み](../postgresql-physical-save)

## 孤立ファイルを作る方法

結論から言うと、孤立ファイルは**トランザクション内でテーブル作成とデータ挿入を行い、コミット前にサーバクラッシュやOOMによりトランザクションのプロセスがKILLされる**ことにより残ってしまいます。
実際に実験してみみます。

```sql
-- トランザクションの開始
begin;

-- テーブルの作成
create table t1 (a int);

-- テーブルファイルパスの取得
select pg_relation_filepath('t1');
 pg_relation_filepath
----------------------
 base/13091/24576
(1 row)

-- プロセスIDの取得
select * from pg_backend_pid();
 pg_backend_pid
----------------
           1195
(1 row)
```

テーブルファイルパスを調べてみますがこの時点ではまだファイルサイズは0です。

```sh
$ cd /var/lib/postgresql/11/main
$ ls -la base/13091/24576
-rw------- 1 postgres postgres 0 May 26 23:09 base/13091/24576
```

試しに少し大きめのデータをINSERTしてみます。

```sql
-- 1000万行を挿入
insert into t1 select * from generate_series(1,10000000);
INSERT 0 10000000
```

```sh
# テーブルサイズが増加したことを確認
$ ls -lah base/13091/24576
-rw------- 1 postgres postgres 346M May 26 23:12 base/13091/24576
```

このタイミングで先程のプロセスをSIGKILLでKILLし、OOMによるプロセスキルを擬似的に再現します。
※このときPostgreSQLがリカバリモードに入り、メインプロセスまでKILLして再起動しなければならない場合があるので注意します。

```sh
$ kill -9 1195
```

psqlでselectをするとトランザクション中にコネクションが切断されたことがわかります。

```sql
select 1;
server closed the connection unexpectedly
        This probably means the server terminated abnormally
        before or while processing the request.
The connection to the server was lost. Attempting reset: Succeeded.
```

トランザクション中にエラーが起きたのでテーブル作成は当然ロールバックされており、テーブルが存在しないことが確認できます。

```sql
select * from t1;
ERROR:  relation "t1" does not exist
LINE 1: select * from t1;
```

しかし、先程確認したテーブルファイルはサイズもそのままに残ってしまっています。

```sh
$ ls -lah base/13091/24576
-rw------- 1 postgres postgres 346M May 26 23:19 base/13091/24576
```

念の為、pg_classテーブルでテーブルファイルのoidで探してみますがレコードは存在しません。
先程のテーブルファイルはPostgreSQLの内部システムテーブルからも関知していない孤立したファイルであることがわかります。

```sql
select relname from pg_class where oid = '24576';
 relname
---------
(0 rows)
```

## 孤立ファイルの削除方法

このように作成されてしまった孤立ファイルは、PostgreSQLが内部システムで関知していないため勝手に掃除されることがなくユーザーが手動で削除する必要があります。
先程のテーブルファイルは数百MBほどでしたが、場合によっては冒頭のように数百GBのファイル郡を作ることもあります。

削除方法についてですが、残念ながらあまりスマートな方法はありません。
pg_classテーブルとつけあわせて、pg_classに存在しないのにテーブルファイルに存在するものは孤立ファイルであると判断して削除していくしかありません。
誤って存在するテーブルファイルを削除してしまうと当然論理側のテーブルにも影響があるのでこの作業は慎重に行う必要があります。

## まとめ

まとめると下記のような手順で孤立ファイルは作られてしまいます。

- トランザクション中、コミット前に下記操作が行われる
- テーブル作成・レコード挿入
- OOMなどによるトランザクションプロセスのKILL

この問題はデータインポート中にディスクフルやOOMによるPostgreSQLのダウンなどで意外と起きえます。
小さいデータサイズであれば問題になることは少ないが、巨大なデータとなるとPostgreSQLの復旧だけでは解決しない問題になります。
根本的な解決にはディスクフルやOOMの手前で安全にPostgreSQLをダウンさせるようリソースチェックの仕組みを整える必要などがあります。

## 参考

[Can there be orphaned data files in PostgreSQL? - Blog dbi services](https://blog.dbi-services.com/can-there-be-orphaned-data-files-in-postgresql/)

