const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  cssLoaderOptions: {
    url: false
  }
})
module.exports = {
  reactStrictMode: true,
  // images:{
  //   // domains:["d2xjmi1k71iy2m.cloudfront.net"]
  // }
}
