import React from "react"
import Header from "./header"
import Footer from "./footer"

const Layout = (props) => {
  return (
    <div className="container">
      <Header {...props} />
        <main>
          { props.children }
        </main>
      <Footer/>
    </div>
  )
}

export default Layout
