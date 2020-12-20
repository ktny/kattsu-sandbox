import React from "react"
import { Link } from "gatsby"
import kebabCase from "lodash/kebabCase"

const Tags = ({ tags }) => {
  if (!tags) {
    return <></>
  }
  return (
    <div className="tags">
      {(tags || []).map((tag: string) => (
        <Link to={`/tag/${kebabCase(tag)}`} className="tag" key={tag}>
          {tag}
        </Link>
      ))}
    </div>
  )
}

export default Tags
