import React from "react"
import { Link } from "gatsby"
import kebabCase from "lodash/kebabCase"
import styles from "../styles/tags.module.scss"

const Tags = ({ tags }) => {
  if (!tags) {
    return <></>
  }
  return (
    <div className={styles.tags}>
      {(tags || []).map((tag: string) => (
        <Link to={`/tag/${kebabCase(tag)}`} className={styles.tag} key={tag}>
          {tag}
        </Link>
      ))}
    </div>
  )
}

export default Tags
