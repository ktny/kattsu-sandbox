import React from "react"
import Tag from "./tag"
import { graphql, useStaticQuery } from "gatsby"
import styles from "../styles/tag-list.module.scss"

const TagList = () => {
  const data = useStaticQuery<GatsbyTypes.TagListQuery>(
    graphql`
      query TagList {
        allMdx {
          nodes {
            frontmatter {
              tags
            }
          }
        }
      }
    `
  )

  const tags = collectTagList(data.allMdx.nodes)

  return (
    <section className="aside-box">
      <div className={styles.tagList}>
        {tags.map((tag) => (
          <Tag tag={tag.name} count={tag.count} key={tag.name} />
        ))}
      </div>
    </section>
  )
}

type Tag = { name: string; count: number }
type TagCount = { [name: string]: number }

const collectTagList = (nodes): Tag[] => {
  const tagCount: TagCount = {}
  nodes.forEach((node) => {
    node.frontmatter.tags.forEach((tag) => {
      if (tagCount[tag] === undefined) {
        tagCount[tag] = 1
      } else {
        tagCount[tag] += 1
      }
    })
  })
  const tags = Object.keys(tagCount).map((tag) => ({
    name: tag,
    count: tagCount[tag],
  }))
  const sortedTags = tags.sort((a, b) => {
    if (a.count < b.count) return 1
    if (a.count > b.count) return -1
    return 0
  })
  return sortedTags
}

export default TagList
