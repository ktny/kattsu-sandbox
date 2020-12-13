import React from "react"
import { Link } from "gatsby"
import kebabCase from 'lodash/kebabCase'

const Tags = ({ tags }) => {
  return (
    <div className="tags">
      {(tags || []).map(tag => (
        <Link to={`/tag/${kebabCase(tag)}`} className="tag" key={tag}>{tag}</Link>          
      ))}
    </div>
  )
}

export default Tags
