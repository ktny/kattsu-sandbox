import React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"

const Header = ({ location }) => {
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
    <header>
      {
        location.pathname === "/"
        ? <h1 className="header-title">{data.site.siteMetadata.title}</h1>
        : <Link to="/" className="header-title">{data.site.siteMetadata.title}</Link>
      }
    </header>
  )
}

export default Header
