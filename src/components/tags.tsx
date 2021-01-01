import React from "react"
import Tag from "./tag"
import styles from "../styles/tags.module.scss"

const Tags = ({ tags }) => {
  if (!tags) {
    return <></>
  }
  return (
    <div className={styles.tags}>
      {(tags || []).map((tag: string) => (
        <Tag tag={tag} count={0} key={tag} />
      ))}
    </div>
  )
}

export default Tags
