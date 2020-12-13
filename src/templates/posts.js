import Posts from "../components/posts"
import { graphql } from "gatsby"

export default Posts

export const query = graphql`
  query ($tag: String) {
    allMarkdownRemark (
      sort: { fields: [frontmatter___date], order: DESC },
      filter: {frontmatter: {tags: {in: [$tag]}}}
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date
          tags
        }
      }
    }
  }
`
