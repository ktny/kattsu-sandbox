import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
// import Img from "gatsby-image"

export default function Post(props) {
  const { data } = props
  return (
    <Layout {...props}>
      {/* <Img fixed={data.markdownRemark.frontmatter.topImage.childImageSharp.fixed} /> */}
      <h1>{data.markdownRemark.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        topImage {
          childImageSharp {
            fixed(width: 700) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`
