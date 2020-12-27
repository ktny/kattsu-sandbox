import React from "react"
import Header from "./header"
import Footer from "./footer"
import styles from "../styles/layout.module.scss"

const Layout = (props) => {
  return (
    <div className={styles.wrapper}>
      <Header {...props} />
      {props.children}
      <Footer />
    </div>
  )
}

export default Layout
