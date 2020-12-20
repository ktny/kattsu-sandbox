import React from "react"
import Layout from "../components/layout"
import Tags from "../components/tags"
import { graphql, PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
// import Img from "gatsby-image"

const Post: React.FC<PageProps<GatsbyTypes.PostQuery>> = (props) => {
  const { data } = props
  // const post = data.mdx

  return (
    <Layout {...props}>
      {/* <Img fixed={data.mdx.frontmatter.topImage.childImageSharp.fixed} /> */}
      <section className="post-head">
        <h1>{data.mdx?.frontmatter?.title}</h1>
        <small>
          投稿日: <time>{data.mdx?.frontmatter?.date}</time>
        </small>
        <Tags tags={data.mdx?.frontmatter?.tags} />
      </section>
      <section className="post-body">
        {/* <div dangerouslySetInnerHTML={{ __html: data.mdx?.body }} /> */}
        <MDXRenderer>{data.mdx.body}</MDXRenderer>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query Post($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
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
