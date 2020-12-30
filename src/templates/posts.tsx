import Posts from "../components/posts"
import { graphql } from "gatsby"

export default Posts

export const query = graphql`
  query Posts($skip: Int!, $limit: Int!, $draft: [Boolean]!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { in: $draft } } }
      skip: $skip
      limit: $limit
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
