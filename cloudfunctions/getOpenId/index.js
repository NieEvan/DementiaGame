// const cloud = require('wx-server-sdk')
// cloud.init({
//   env: 'memory-app-7gb1hmbba13c9df9'
// })

// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()
//   return {
//     openid: wxContext.OPENID
//   }
// }

const cloud = require('wx-server-sdk')

cloud.init({
  env: 'memory-app-7gb1hmbba13c9df9'
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}