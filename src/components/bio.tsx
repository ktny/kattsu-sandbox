import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import styles from "../styles/bio.module.scss"

const Bio = () => {
  const data = useStaticQuery<GatsbyTypes.BioQuery>(
    graphql`
      query Bio {
        site {
          siteMetadata {
            author
            twitterUrl
            githubUrl
          }
        }
        avatar: file(absolutePath: { regex: "/avatar.png/" }) {
          childImageSharp {
            fixed(width: 48, height: 48) {
              base64
              width
              height
              src
              srcSet
            }
          }
        }
        github: file(absolutePath: { regex: "/github.png/" }) {
          childImageSharp {
            fixed(width: 24, height: 24) {
              base64
              width
              height
              src
              srcSet
            }
          }
        }
      }
    `
  )

  return (
    <section className="box mt-2">
      <h3 className={styles.title}>書いている人</h3>
      <div className={styles.inner}>
        <div className={styles.avatar}>
          <Img
            fixed={data.avatar.childImageSharp.fixed}
            alt={data.site.siteMetadata.author}
          />
        </div>
        <div>
          <div className={styles.sns}>
            <div className={styles.name}>
              <a
                href={data.site.siteMetadata.twitterUrl}
                target="_blank"
                rel="noreferrer"
              >
                @{data.site.siteMetadata.author}
              </a>
            </div>
            <div className={styles.snsIcon}>
              <a
                href={data.site.siteMetadata.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Img
                  fixed={data.github.childImageSharp.fixed}
                  alt={data.site.siteMetadata.author}
                />
              </a>
            </div>
          </div>
          <p className={styles.desc}>
            大阪でソフトウェアエンジニアとして働いています。
          </p>
        </div>
      </div>
    </section>
  )
}

export default Bio
