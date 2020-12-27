import React from "react"
import { useStaticQuery, Link, graphql, PageProps } from "gatsby"
import styles from "../styles/header.module.scss"

const Header: React.FC<PageProps> = ({ location }) => {
  const data = useStaticQuery<GatsbyTypes.HeaderQuery>(
    graphql`
      query Header {
        site {
          siteMetadata {
            name
          }
        }
      }
    `
  )

  return (
    <header className={styles.header}>
      {location.pathname === "/" ? (
        <h1 className={styles.headerTitle}>{data.site.siteMetadata.name}</h1>
      ) : (
        <Link to="/" className={styles.headerTitle}>
          {data.site.siteMetadata.name}
        </Link>
      )}
    </header>
  )
}

export default Header
