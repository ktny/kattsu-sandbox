import Posts from "../components/posts"
import { graphql } from "gatsby"

export default Posts

export const query = graphql`
  query Posts($skip: Int!, $limit: Int!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
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
