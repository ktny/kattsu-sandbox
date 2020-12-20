import React from "react"
import Layout from "../components/layout"
import Tags from "../components/tags"
import Toc from "../components/toc"
import Bio from "../components/bio"
import { graphql, PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
// import Img from "gatsby-image"

const Post: React.FC<PageProps<GatsbyTypes.PostQuery>> = (props) => {
  const { data } = props
  // const post = data.mdx

  console.log(data)

  return (
    <Layout {...props}>
      {/* <Img fixed={data.mdx.frontmatter.topImage.childImageSharp.fixed} /> */}
      <div className="post-container">
        <aside className="post-toc">
          <Toc items={data.mdx.tableOfContents.items} depth={1} />
        </aside>
        <div>
          <div className="post-content">
            <section className="post-head">
              <h1>{data.mdx?.frontmatter?.title}</h1>
              <small>
                投稿日: <time>{data.mdx?.frontmatter?.date}</time>
              </small>
              <Tags tags={data.mdx?.frontmatter?.tags} />
            </section>
            <section className="post-body">
              <MDXRenderer>{data.mdx.body}</MDXRenderer>
            </section>
          </div>
          <Bio />
        </div>
      </div>
    </Layout>
  )
}

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

export default Post
