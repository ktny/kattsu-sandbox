import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Bio = () => {
  const data = useStaticQuery<GatsbyTypes.BioQuery>(
    graphql`
      query Bio {
        site {
          siteMetadata {
            author
            twitterUrl
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
      }
    `
  )

  return (
    <section className="about container">
      <h3 className="about-title">書いている人</h3>
      <div className="bio">
        <div className="bio-image">
          <Img
            fixed={data.avatar.childImageSharp.fixed}
            alt={data.site.siteMetadata.author}
          />
        </div>
        <div className="bio-text">
          <p className="bio-name">
            <a
              href={data.site.siteMetadata.twitterUrl}
              target="_blank"
              rel="noreferrer"
            >
              @{data.site.siteMetadata.author}
            </a>
          </p>
          <p className="bio-desc">機械メーカーに勤めるwebエンジニアです。</p>
        </div>
      </div>
    </section>
  )
}

export default Bio
