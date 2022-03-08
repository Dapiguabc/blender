const { createProxyMiddleware } = require("http-proxy-middleware")
/** @type {import('gatsby).GatsbyConfig} */
module.exports = {
  // developMiddleware: app => {
  //   app.use(
  //     "/relayer",
  //     createProxyMiddleware({
  //       target: "http://localhost:9000",
  //       pathRewrite: {
  //         "/relayer": "",
  //       },
  //     })
  //   )
  // },
  siteMetadata: {
      title: `Blender`,
      siteUrl: `https://www.yourdomain.tld`
  },
  plugins: ["gatsby-plugin-postcss", "gatsby-plugin-sass", "gatsby-plugin-react-helmet", "gatsby-plugin-sitemap", {
    resolve: 'gatsby-plugin-manifest',
    options: {
      "icon": "src/assets/images/icon.png"
    }
  }]
};