import "./src/assets/styles/global.scss"
import React from "react"
import Layout from "./src/components/layout"


export const wrapPageElement = ({ props, element }) => {
  return (
    <Layout {...props}> 
        {element}
    </Layout>
  )
}