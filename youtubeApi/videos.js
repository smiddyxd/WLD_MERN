const axios = require('axios')
const { api_key } = require('../credentials/credentialsSets').credentialsSets[0]
const { access_token } = require('../credentials/tokens')

// const { api_key, access_token } = credentialsSets[0]
// { access_token, refresh_token } = require('../credentials/credentialsSets.json').credentialsSets[0]
// const access_token = 
// const api_key = require('../credentials/credentialsSets.json').credentialsSets[0].api_key
const { getTokenWithRefreshToken } = require('../controllers/auth.controller')

// const getVideoData = async (id, parts) => {
//   console.log('api_key:' + api_key, 'access_token: ' + access_token)
// }

const getVideoData = async (id, parts) => {
  console.log(parts)
  let config = {
    headers: { authorization: 'Bearer ' + access_token }, // might still use the old access token
    Accept: 'application/json'
  }
  let data = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=${encodeURIComponent(parts)}&id=${id}&key=${api_key}`, config)
  .then(res => res.data.items[0])
    .catch(err => { console.log(err.response)})
    // if (err.response.status === 401) {
    //   getTokenWithRefreshToken(refresh_token)
    //     .then(() => {
    //       exports.getVideoData(id, parts)
    //   })
    // }
  // })
  // if (data === 401) {
  //   let tokenRefreshed = await getTokenWithRefreshToken(refresh_token)
  //   data = await getVideoData(id, parts)
  // }
  return data
}

exports.getVideoData = getVideoData
