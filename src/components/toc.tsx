import React from "react"
import { Link } from "react-scroll"
import styles from "../styles/toc.module.scss"

const Toc = ({ items, depth }) => {
  return (
    <section className={depth === 1 ? "aside-box" : ""}>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li
            key={i}
            className={depth === 2 ? styles.heading2 : styles.heading1}
          >
            <Link
              activeClass="active"
              to={item.url.replace("#", "")}
              spy={true}
              smooth={true}
              offset={-10}
              duration={300}
              className={styles.listItem}
            >
              {item.title}
            </Link>
            {item.items && <Toc items={item.items} depth={depth + 1} />}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Toc
