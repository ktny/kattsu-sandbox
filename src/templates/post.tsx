import Post from "../components/post"
import { graphql } from "gatsby"

export default Post

export const query = graphql`
  query Post($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      slug
      body
      tableOfContents(maxDepth: 3)
      frontmatter {
        title
        date
        tags
        # topImage {
        #   childImageSharp {
        #     fixed(width: 700) {
        #       ...GatsbyImageSharpFixed
        #     }
        #   }
        # }
      }
    }
  }
`
