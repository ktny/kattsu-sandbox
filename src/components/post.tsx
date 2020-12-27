import React from "react"
import Layout from "../components/layout"
import Tags from "../components/tags"
import Toc from "../components/toc"
import Bio from "../components/bio"
import { PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
// import Img from "gatsby-image"
import styles from "../styles/post.module.scss"

const Post: React.FC<PageProps<GatsbyTypes.PostQuery>> = (props) => {
  const { data } = props
  const post = data.mdx

  return (
    <Layout {...props}>
      <div className="container">
        {/* <Img fixed={post.frontmatter.topImage.childImageSharp.fixed} /> */}
        <main className="main">
          <div className="box">
            <section>
              <h1>{post.frontmatter?.title}</h1>
              <small>
                投稿日: <time>{post.frontmatter?.date}</time>
              </small>
              <Tags tags={post.frontmatter?.tags} />
            </section>
            <section className={styles.postBody}>
              <MDXRenderer>{post.body}</MDXRenderer>
            </section>
          </div>
          <Bio />
        </main>
        <aside className="aside">
          <Toc items={post.tableOfContents.items} depth={1} />
        </aside>
      </div>
    </Layout>
  )
}

export default Post
