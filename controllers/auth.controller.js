const axios = require('axios')
const fs = require('fs')

const { access_token, refresh_token } = require('../credentials/tokens.json')

const { api_key, client_id, client_secret } = require('../credentials/credentialsSets.json').credentialsSets[0]
const { redirect_uri } = require('../credentials/credentialsSets.json')

const { queueNextSetOfKeys } = require('../credentials/keysManager')

// "client_id": "563856617839-5plsi2jjd76jv7n9strql1hufi8co6vb.apps.googleusercontent.com",
//   "client_secret": "1AXfp0i06cPhkHV9Hn1pZCCv",

// "client_id": "653803885687-1m8l1em7u2mofr47mm8ahjprqjropcdc.apps.googleusercontent.com",
//   "client_secret": "eXF8Z9OxitTqet4GWJqnGs1L",

exports.handleLimitExceeded = async (req, res) => {
  console.log('a')
  let finished = await queueNextSetOfKeys()
  res.send({api_key, client_id, error: true})
}

exports.getTokenStatus = async (req, res) => {
  let isTokenExpired = await getIsTokenExpired(access_token)
  if (isTokenExpired) {
    console.log('isTokenExpired: true')
    if (refresh_token) {
      console.log('refresh_token: true')
      let tokenRefreshed = await getTokenWithRefreshToken(refresh_token)
      res.send({ newLoginRequired: false, client_id, access_token, api_key })
    } else {
      console.log('refresh_token: undefined')
      res.json({ newLoginRequired: true, client_id  })
    }
  } else {
    console.log('isTokenExpired: false')
    res.json({ newLoginRequired: false, client_id, access_token, api_key })
  }
}

exports.getTokenWithAuthCode = (req, res) => {
  let code = req.query.code
  body = 'code='
    + encodeURIComponent(code)
    + '&client_id='
    + client_id
    + '&client_secret='
    + client_secret
    + '&redirect_uri='
    + redirect_uri
    + '&grant_type=authorization_code'

  axios.request({
    url: 'https://oauth2.googleapis.com/token',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: body
  })
    .then(resp => {
      if (resp.status === 200 && resp.data.access_token) {
        fs.writeFile('./credentials/tokens.json', JSON.stringify(resp.data), (err) => {
          if (err) {
            res.json({ authorization_successful: false, client_id });
            throw err
          } else {
            console.log('The file has been saved!');
            res.json({ authorization_successful: true, client_id, access_token, api_key });
          }
      })
    }
    })
    .catch(function (error) {
      // console.log('---------error----------')
      console.log(error)
    });
}

const getTokenWithRefreshToken = (refreshToken) => {
  let body = '&client_id='
    + client_id
    + '&client_secret='
    + client_secret
    + '&refresh_token='
    + encodeURIComponent(refreshToken)
    + '&grant_type=refresh_token'

  let newTokensSaved = new Promise((res, rej) => {
    axios.request({
      url: 'https://oauth2.googleapis.com/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: body
    })
    .then(resp => {
      console.log('data: ', resp.data)
      if (resp.status === 200 && resp.data.access_token) {
        console.log('new access token: ', resp.data.access_token)
        console.log('new refresh token: ', resp.data.refresh_token)
        fs.writeFile('./credentials/tokens.json', JSON.stringify(resp.data), (err) => {
          if (err) throw err;
          console.log('New Tokens successfully fetched with refresh token and saved!');
          res()
        });
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  })
  return newTokensSaved
}

const getIsTokenExpired = async (access_token) => {
  let config = {
    headers: { authorization: 'Bearer ' + access_token },
    Accept: 'application/json'
  }
  let testResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=id&id=7g5AHio1O_A&key=${api_key}`, config)
    .then(res => { return res })
    .catch(err => { return err })
  if (testResponse.message === "Request failed with status code 401") {
    return true
  } else {
    return false
  }
}

exports.getIsTokenExpired = getIsTokenExpired
exports.getTokenWithRefreshToken = getTokenWithRefreshToken
