import React from "react"
import { Link } from "gatsby"
import kebabCase from "lodash/kebabCase"
import styles from "../styles/tag.module.scss"

const Tag = ({ tag, count }) => {
  return (
    <Link to={`/tag/${kebabCase(tag)}`} className={styles.tag} key={tag}>
      {tag}
      {count > 0 ? <span className={styles.count}>({count})</span> : ""}
    </Link>
  )
}

export default Tag
