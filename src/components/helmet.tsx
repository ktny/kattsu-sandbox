import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet as HelmetWrapper } from "react-helmet"

const Helmet = (props) => {
  const data = useStaticQuery<GatsbyTypes.HelmetQuery>(
    graphql`
      query Helmet {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  return (
    <HelmetWrapper>
      <html lang="ja" />
      <title>
        {props.title} - {data.site.siteMetadata.title}
      </title>
      {props.children}
    </HelmetWrapper>
  )
}

export default Helmet
