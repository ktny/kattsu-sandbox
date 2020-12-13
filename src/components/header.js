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
        <h1>{data.site.siteMetadata.title}</h1>
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
