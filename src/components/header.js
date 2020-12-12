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

  if (location.pathname === "/") {
    return (
      <header>
        <h2>{data.site.siteMetadata.title}</h2>
      </header>
    )
  } else {
    return (
      <header>
        <Link to="/">{data.site.siteMetadata.title}</Link>
      </header>
    )
  }
}

export default Header
