import React from "react"
import { useStaticQuery, Link, graphql, PageProps } from "gatsby"

const Header: React.FC<PageProps> = ({ location }) => {
  const data = useStaticQuery<GatsbyTypes.HeaderQuery>(
    graphql`
      query Header {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  return (
    <header>
      {location.pathname === "/" ? (
        <h1 className="header-title">{data.site.siteMetadata.title}</h1>
      ) : (
        <Link to="/" className="header-title">
          {data.site.siteMetadata.title}
        </Link>
      )}
    </header>
  )
}

export default Header
