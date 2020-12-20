import { PageProps } from "gatsby"
import React from "react"
import Layout from "../components/layout"

const NotFoundPage: React.FC<PageProps> = (props) => {
  return (
    <Layout {...props} showProfile={false}>
      <h1>404 ページが見つかりません</h1>
    </Layout>
  )
}

export default NotFoundPage
