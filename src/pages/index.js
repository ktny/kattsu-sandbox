import React from "react"
import Layout from "../components/layout"
import Footer from "../components/footer"
import { graphql, Link } from "gatsby"

export default function Home(props) {
  const { data } = props
  return (
    <div>
      <Layout {...props}>
        <div className="post-list">
          {data.allMarkdownRemark.nodes.map(node => (
            <article className="post-item" key={node.id}>
              <Link to={node.fields.slug} className="post-item-title">
                <h2>{node.frontmatter.title}</h2>
              </Link>
              <p>{node.frontmatter.date}</p>
            </article>
          ))}
        </div>
      </Layout>
    </div>
  )
}

export const query = graphql`
  {
    allMarkdownRemark (
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        id
        html
        fields {
          slug
        }
        frontmatter {
          date
          title
        }
      }
    }
  }
`
