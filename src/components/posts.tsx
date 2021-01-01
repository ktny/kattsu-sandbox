import React from "react"
import { Link, PageProps } from "gatsby"
import Layout from "./layout"
import Helmet from "./helmet"
import Tags from "./tags"
import TagList from "./tag-list"
import Bio from "./bio"
import Pagination from "./pagination"
import styles from "../styles/posts.module.scss"

type PageContext = {
  previousPagePath: string
  nextPagePath: string
}

const Posts: React.FC<PageProps<GatsbyTypes.PostsQuery, PageContext>> = (
  props
) => {
  const { data } = props

  return (
    <Layout {...props}>
      <Helmet title="トップページ" />
      <div className="container">
        <main className="main">
          <div className="box">
            {data.allMdx.nodes.map((node) => (
              <article className={styles.post} key={node.fields.slug}>
                <small>
                  <time>{node.frontmatter.date}</time>
                </small>
                <h2 className={styles.postTitle}>
                  <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
                </h2>
                <Tags tags={node.frontmatter.tags} />
              </article>
            ))}
            <Pagination pageContext={props.pageContext}></Pagination>
          </div>
          <Bio />
        </main>
        <aside className="aside">
          <TagList />
        </aside>
      </div>
    </Layout>
  )
}

export default Posts
