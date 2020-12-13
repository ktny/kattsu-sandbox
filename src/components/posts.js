import React from "react"
import { Link } from "gatsby"
import Layout from "./layout"
import Tags from "./tags"

const Posts = (props) => {
  const { data } = props
  return (
    <Layout {...props}>
      <div className="post-list">
        {data.allMarkdownRemark.nodes.map(node => (
          <article className="post-item" key={node.fields.slug}>
            <small><time>{node.frontmatter.date}</time></small>
            <h2 className="post-item-title">
              <Link to={node.fields.slug}>
                {node.frontmatter.title}
              </Link>
            </h2>
            <Tags tags={node.frontmatter.tags} />
          </article>
        ))}
      </div>
    </Layout>
  )
}

export default Posts
