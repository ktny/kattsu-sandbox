import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

const AboutPage = ({ data }) => {
  return (
    <Layout>
      <h1>About Page</h1>
      <table>
        <thead>
          <tr>
            <th>パス</th>
            <th>サイズ</th>
            <th>作成時間</th>
          </tr>
        </thead>
        <tbody>
          {data.allFile.nodes.map((node) => (
            <tr key={node.id}>
              <td>{node.relativePath}</td>
              <td>{node.size}</td>
              <td>{node.ctime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

export const query = graphql`
  {
    allFile {
      totalCount
      nodes {
        id
        relativePath
        ctime
        size
        name
        extension
      }
    }
  }
`

export default AboutPage
