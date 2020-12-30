import Posts from "../components/posts"
import { graphql } from "gatsby"

export default Posts

export const query = graphql`
  query TagPosts($skip: Int!, $limit: Int!, $tag: String!, $draft: [Boolean]!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { in: $draft }, tags: { in: [$tag] } } }
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
