import React from "react"
import Header from "./header"
import Footer from "./footer"
import Helmet from "./helmet"
import styles from "../styles/layout.module.scss"

const Layout = (props) => {
  return (
    <>
      <Helmet />
      <Header {...props} />
      <div className={styles.wrapper}>
        {props.children}
        <Footer />
      </div>
    </>
  )
}

export default Layout
