import React from "react"
import { useStaticQuery, graphql, PageProps } from "gatsby"
import styles from "../styles/footer.module.scss"

const Footer = () => {
  const data = useStaticQuery<GatsbyTypes.FooterQuery>(
    graphql`
      query Footer {
        site {
          siteMetadata {
            name
          }
        }
      }
    `
  )

  return (
    <footer className={styles.footer}>
      &copy; 2020 {data.site.siteMetadata.name}
    </footer>
  )
}

export default Footer
