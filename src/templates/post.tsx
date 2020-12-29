import Post from "../components/post"
import { graphql } from "gatsby"

export default Post

export const query = graphql`
  query Post($slug: String!, $status: String!) {
    mdx(
      fields: { slug: { eq: $slug } }
      frontmatter: { status: { regex: $status } }
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
