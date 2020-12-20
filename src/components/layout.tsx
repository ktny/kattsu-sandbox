import React from "react"
import Header from "./header"
import Helmet from "./helmet"

const Layout = (props) => {
  return (
    <>
      <Helmet />
      <div className="wrapper">
        <Header {...props} />
        <div className="">{props.children}</div>
      </div>
    </>
  )
}

Layout.defaultProps = {
  showProfile: true,
}

export default Layout
