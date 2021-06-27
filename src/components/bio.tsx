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
            social {
              twitter
              github
              qiita
              atcoder
            }
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
        qiita: file(absolutePath: { regex: "/qiita.png/" }) {
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
        atcoder: file(absolutePath: { regex: "/atcoder.png/" }) {
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
                href={data.site.siteMetadata.social.twitter}
                target="_blank"
                rel="noreferrer"
              >
                @{data.site.siteMetadata.author}
              </a>
            </div>
            <div className={styles.snsIcon}>
              <a
                href={data.site.siteMetadata.social.github}
                target="_blank"
                rel="noreferrer"
              >
                <Img
                  fixed={data.github.childImageSharp.fixed}
                  alt={data.site.siteMetadata.author}
                />
              </a>
            </div>
            <div className={styles.snsIcon}>
              <a
                href={data.site.siteMetadata.social.qiita}
                target="_blank"
                rel="noreferrer"
              >
                <Img
                  fixed={data.qiita.childImageSharp.fixed}
                  alt={data.site.siteMetadata.author}
                />
              </a>
            </div>
            <div className={styles.snsIcon}>
              <a
                href={data.site.siteMetadata.social.atcoder}
                target="_blank"
                rel="noreferrer"
              >
                <Img
                  fixed={data.atcoder.childImageSharp.fixed}
                  alt={data.site.siteMetadata.author}
                />
              </a>
            </div>
          </div>
          <p className={styles.desc}>
            大阪でソフトウェアエンジニアとして働いています。
            <br />
            <a href="https://bukumanga.com/" target="_blank">
              BUKUMANGA - はてなブックマーク数を元にwebマンガをまとめたサイト
            </a>
            を運営しています。
          </p>
        </div>
      </div>
    </section>
  )
}

export default Bio
