import React from "react"
import { useStaticQuery, Link, graphql, PageProps } from "gatsby"
import styles from "../styles/header.module.scss"

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
    <header className={styles.header}>
      {location.pathname === "/" ? (
        <h1 className={styles.headerTitle}>{data.site.siteMetadata.title}</h1>
      ) : (
        <Link to="/" className={styles.headerTitle}>
          {data.site.siteMetadata.title}
        </Link>
      )}
    </header>
  )
}

export default Header
