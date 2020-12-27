import { PageProps } from "gatsby"
import React from "react"
import Layout from "../components/layout"

const NotFoundPage: React.FC<PageProps> = (props) => {
  return (
    <Layout {...props}>
      <div className="container">
        <main className="main">
          <div className="box">
            <h1>404 ページが見つかりません</h1>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default NotFoundPage
