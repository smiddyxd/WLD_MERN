const keysQueue = require('./credentialsSets.json').credentialsSets
const fs = require('fs')

exports.queueNextSetOfKeys = () => {
  console.log()
  let finishedSwappingKeys = new Promise((res, rej) => {
    let newKeysQueue = [keysQueue[4], keysQueue[0], keysQueue[1], keysQueue[2], keysQueue[3]]
    console.log(newKeysQueue[0].api_key)
    let newCredentialsSets = {
      redirect_uri: "http://localhost:3000",
      credentialsSets: newKeysQueue
    }
    fs.writeFile(__dirname + '/credentialsSets.json', JSON.stringify(newCredentialsSets), (err) => {
      if (err) {
        console.log("couldnt write credentialsSets.json", err)
        rej("couldnt write credentialsSets.json")
      }
      console.log("wrote credsets.json")
      res()
    })
  })
  return finishedSwappingKeys
}

/* 
{
  "access_token": "ya29.a0Ae4lvC3oSOk8ch7sqC4PhlAElCD66xXeYX7UkJ_S9BANd32drnxoW8zLtVeBk0EgMTGonzjSeUbRQ_Q-ZpvI91oyyqHQzxrPGxMjGO1HgMsq9rHb8_hMa5Nw5_W3ABpGdkIdzgfHGD-5YJsjUupYEyTb7tZBe_Xj_6U",
  "expires_in": 3598,
  "refresh_token": "1//092cbfAZSb5tQCgYIARAAGAkSNwF-L9IrAiPtd0qMFW_QUZP8XV6eo6vzIEHfhxo0nZBlggByC17wZyFHwojcw35ScYzZRRQqso8",
  "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube openid https://www.googleapis.com/auth/userinfo.email",
  "token_type": "Bearer",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc0YmQ4NmZjNjFlNGM2Y2I0NTAxMjZmZjRlMzhiMDY5YjhmOGYzNWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDgzMzU1NzA3ODcwLWxlbXF1dDh1cWZrN3J0N29maWtza3I0YTRlY3Q4dHFnLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA4MzM1NTcwNzg3MC1sZW1xdXQ4dXFmazdydDdvZmlrc2tyNGE0ZWN0OHRxZy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMDA3ODIxNDk3NjA0OTU5MDkxMiIsImVtYWlsIjoiYXNmZm9xd3VkcWFzb2Y5YnVzYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ikg0TWM0RjA4UVNRQ0M0RHFEQkVOZ1EiLCJuYW1lIjoiZWltYSBtaXQgb2huZSBhbGxlcyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaW15ZlRMWmxQSXduZ1ZwTWhNUWJFTlljMEJJODIxVjhFWFVRZXNzZz1zOTYtYyIsImdpdmVuX25hbWUiOiJlaW1hIiwiZmFtaWx5X25hbWUiOiJtaXQgb2huZSBhbGxlcyIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNTg4NjgyOTEyLCJleHAiOjE1ODg2ODY1MTJ9.Rqc6fjkjiWY_6YiXi9HABu-pUveYj2Z3mSeBwh_pBjUNnVcd0Aiwo26_-GmfXU2CqfEa_xzlAATfa_rQ5V5jfzgkoUD6chA0E6MFPpK2Fxo67OsUILablgfx-5cjRZcxddN_EJWyi8H5HdFp070JsV3dfgtl2eZbuJDW_mx-3dKcC-xCWqV7i437uQk2drapmeLwrAYxhTE2dnu1eLRf_Zczqb2hEHvKWGUVfozdmqp91zX4tDfS6-DuuSl6R73g9kF8tqh_22htSFo8Vwepr4tS-jrzOWv7tz8R_kzokzKNT-hAbaAHnIdy0hLd5SWzGFgfPlAdiFc9r2bUaubjCg"
}

*/
