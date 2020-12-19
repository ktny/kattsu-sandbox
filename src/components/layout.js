import React from "react"
import Header from "./header"
import Footer from "./footer"
import Helmet from "./helmet"

const Layout = (props) => {
  const { data } = props

  return (
    <>
      <Helmet />
      <div className="container">
        <Header {...props} />
        <main>
          {props.children}
          <Footer />
        </main>
      </div>
    </>
  )
}

export default Layout
