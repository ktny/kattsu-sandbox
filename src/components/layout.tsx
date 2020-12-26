import React from "react"
import Header from "./header"
import Helmet from "./helmet"
import styles from "../styles/layout.module.scss"

const Layout = (props) => {
  return (
    <>
      <Helmet />
      <Header {...props} />
      <div className={styles.wrapper}>{props.children}</div>
    </>
  )
}

export default Layout
