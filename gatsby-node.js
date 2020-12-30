const path = require(`path`)
const kebabCase = require("lodash/kebabCase")
const { createFilePath } = require("gatsby-source-filesystem")
const { paginate } = require("gatsby-awesome-pagination")

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const draft = process.env.NODE_ENV === "production" ? [false] : [true, false]
  const postsResult = await graphql(`
    query {
      allMdx(filter: { frontmatter: { draft: { in: [${draft}] } } }) {
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

  const posts = postsResult.data.allMdx.edges
  const tagSet = new Set()

  // 記事ページを作成
  posts.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/post.tsx`),
      context: {
        slug: node.fields.slug,
        draft: draft,
      },
    })
    node.frontmatter.tags.map((tag) => tagSet.add(tag))
  })

  // 記事一覧ページを作成
  paginate({
    createPage,
    items: posts,
    itemsPerPage: 10,
    pathPrefix: "/",
    component: path.resolve(`./src/templates/posts.tsx`),
    context: {
      draft: draft,
    },
  })

  // タグごとの記事一覧ページを作成
  Array.from(tagSet).map((tag) => {
    paginate({
      createPage,
      items: posts,
      itemsPerPage: 10,
      pathPrefix: `/tag/${kebabCase(tag)}`,
      component: path.resolve(`./src/templates/tag-posts.tsx`),
      context: {
        tag: tag,
        draft: draft,
      },
    })
  })
}
