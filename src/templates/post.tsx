import Post from "../components/post"
import { graphql } from "gatsby"

export default Post

export const query = graphql`
  query Post($slug: String!, $draft: [Boolean]!) {
    mdx(
      fields: { slug: { eq: $slug } }
      frontmatter: { draft: { in: $draft } }
    ) {
      slug
      body
      tableOfContents(maxDepth: 3)
      frontmatter {
        title
        date
        tags
      }
    }
  }
`
