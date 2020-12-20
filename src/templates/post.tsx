import React from "react"
import Layout from "../components/layout"
import Tags from "../components/tags"
import { graphql, PageProps } from "gatsby"
// import Img from "gatsby-image"

const Post: React.FC<PageProps<GatsbyTypes.PostQuery>> = (props) => {
  const { data } = props
  // const post = data.markdownRemark

  return (
    <Layout {...props}>
      {/* <Img fixed={data.markdownRemark.frontmatter.topImage.childImageSharp.fixed} /> */}
      <section className="post-head">
        <h1>{data.markdownRemark?.frontmatter?.title}</h1>
        <small>
          投稿日: <time>{data.markdownRemark?.frontmatter?.date}</time>
        </small>
        <Tags tags={data.markdownRemark?.frontmatter?.tags} />
      </section>
      <section className="post-body">
        <div dangerouslySetInnerHTML={{ __html: data.markdownRemark?.html }} />
      </section>
    </Layout>
  )
}

export const query = graphql`
  query Post($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
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

export default Post
