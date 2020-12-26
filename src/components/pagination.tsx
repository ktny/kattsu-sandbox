import React from "react"
import { Link } from "gatsby"
import styles from "../styles/pagination.module.scss"

// type PageContext = {
//   previousPagePath: string
//   nextPagePath: string
// }

const Pagination = ({ pageContext }) => {
  return (
    <nav>
      <ul className={styles.pagination}>
        <li className={styles.paginationItem}>
          {pageContext.previousPagePath ? (
            <Link
              to={pageContext.previousPagePath}
              className={styles.paginationItemLink}
            >
              ← 前へ
            </Link>
          ) : (
            <></>
          )}
        </li>

        <li className={styles.paginationItem}>
          {pageContext.nextPagePath ? (
            <Link
              to={pageContext.nextPagePath}
              className={styles.paginationItemLink}
            >
              次へ →
            </Link>
          ) : (
            <></>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
