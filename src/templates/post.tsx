import React from "react"
import Layout from "../components/layout"
import Tags from "../components/tags"
import Toc from "../components/toc"
import Bio from "../components/bio"
import { graphql, PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
// import Img from "gatsby-image"
import styles from "../styles/post.module.scss"

const Post: React.FC<PageProps<GatsbyTypes.PostQuery>> = (props) => {
  const { data } = props
  // const post = data.mdx

  return (
    <Layout {...props}>
      <div className="container">
        {/* <Img fixed={data.mdx.frontmatter.topImage.childImageSharp.fixed} /> */}
        <main className="main">
          <div className="box">
            <section>
              <h1>{data.mdx?.frontmatter?.title}</h1>
              <small>
                投稿日: <time>{data.mdx?.frontmatter?.date}</time>
              </small>
              <Tags tags={data.mdx?.frontmatter?.tags} />
            </section>
            <section className={styles.postBody}>
              <MDXRenderer>{data.mdx.body}</MDXRenderer>
            </section>
          </div>
          <Bio />
        </main>
        <aside className="aside">
          <Toc items={data.mdx.tableOfContents.items} depth={1} />
        </aside>
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
