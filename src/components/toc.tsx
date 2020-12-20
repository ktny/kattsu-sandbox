import React from "react"
import { Link } from "react-scroll"

const Toc = ({ items, depth }) => {
  console.log(items)
  return (
    <ul className="toc-list">
      {items.map((item, i) => (
        <li key={i} className={depth === 1 ? "heading1" : "heading2"}>
          <Link
            activeClass="active"
            to={item.url.replace("#", "")}
            spy={true}
            smooth={true}
            offset={-10}
            duration={300}
            className="toc-list-item"
          >
            {item.title}
          </Link>
          {item.items && <Toc items={item.items} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  )
}

export default Toc
