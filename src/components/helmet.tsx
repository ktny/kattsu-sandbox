import React from "react"
import { useStaticQuery, graphql, PageProps } from "gatsby"
import { Helmet as HelmetWrapper } from "react-helmet"

const Helmet = () => {
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
      <title>{data.site.siteMetadata.title}</title>
    </HelmetWrapper>
  )
}

export default Helmet
