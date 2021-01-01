import React from "react"
import Layout from "../components/layout"
import Helmet from "./helmet"
import Tags from "../components/tags"
import TagList from "../components/tag-list"
import Toc from "../components/toc"
import Bio from "../components/bio"
import Share from "../components/share"
import { PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import styles from "../styles/post.module.scss"

const Post: React.FC<PageProps<GatsbyTypes.PostQuery>> = (props) => {
  const { data } = props
  const post = data.mdx

  return (
    <Layout {...props}>
      <Helmet title={post.frontmatter?.title}>
        <script async src="//platform.twitter.com/widgets.js" />
        <script async src="//b.st-hatena.com/js/bookmark_button.js" />
      </Helmet>
      <div className="container">
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
            <Share />
          </div>
          <Bio />
        </main>
        <aside className="aside">
          <Toc items={post.tableOfContents.items} depth={1} />
          <TagList />
        </aside>
      </div>
    </Layout>
  )
}

export default Post
