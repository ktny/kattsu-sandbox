---
title: "2番目の記事"
date: "2020-12-12"
---

ひゃー

- test
- test2

```javascript:title=gatsby.js
result.data.allMarkdownRemark.edges.forEach(({ node }) => {
  createPage({
    path: node.fields.slug,
    component: path.resolve(`./src/templates/post.js`),
    context: {
      slug: node.fields.slug,
    },
  })
})
```
