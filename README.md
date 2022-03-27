# Kattsu Sandbox

[https://katsusand.dev](https://katsusand.dev)

## セットアップ

```sh
npm i
npx gatsby develop
```

## ディレクトリ構成

.
├── README.md
├── gatsby-browser.js
├── gatsby-config.js
├── gatsby-node.js
├── package-lock.json
├── package.json
├── post.sh*
├── public/
├── src/
│   ├── components/
│   ├── images/
│   ├── pages/
│   ├── posts/
│   ├── styles/
│   ├── templates/
│   └── utils/
├── template.mdx
└── tsconfig.json

下記コマンドで出力
`tree -aF -L 2 -I . | sed 's/   /\t/g'`

## 記事作成

```sh
./post.sh {article name}
```
