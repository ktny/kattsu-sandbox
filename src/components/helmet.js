import React from "react"
import { useStaticQuery } from "gatsby"
import { Helmet as ReactHelmet } from "react-helmet"

const Helmet = () => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  return (
    <ReactHelmet>
      <html lang="ja" />
      <title>{data.site.siteMetadata.title}</title>
    </ReactHelmet>
  )
}

export default Helmet
