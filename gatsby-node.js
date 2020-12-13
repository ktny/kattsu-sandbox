const path = require(`path`)
const kebabCase = require('lodash/kebabCase')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
        }
      }
    }  
  `)

  const posts = result.data.allMarkdownRemark.edges
  const tagSet = new Set();

  // 各記事の静的ページを作成
  posts.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/post.js`),
      context: {
        slug: node.fields.slug,
      },
    })
    node.frontmatter.tags.map(tag => tagSet.add(tag))
  })


  // 各タグ一覧ページを作成
  Array.from(tagSet).forEach(tag => {
    createPage({
      path: `/tag/${kebabCase(tag)}`,
      component: path.resolve(`./src/templates/posts.js`),
      context: {
        tag: tag
      }
    })    
  })
}
