// Copyright 2016 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

/**
 * This is used by several samples to easily provide an oauth2 workflow.
 */

// [START auth_oauth2_workflow]
const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, 'oauth2.keys.json');
let keys = {
  redirect_uris: ['http://localhost:2000/oauth2callback'],
};
if (fs.existsSync(keyPath)) {
  const keyFile = require(keyPath);
  keys = keyFile.installed || keyFile.web;
}

const invalidRedirectUri = `The provided keyfile does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:2000/oauth2callback'.  Please edit
your keyfile, and add a 'redirect_uris' section.  For example:

"redirect_uris": [
  "http://localhost:2000/oauth2callback"
]
`;

  function storeToken(token) {
    fs.writeFile('storedToken.json', JSON.stringify(token), (err) => {
      if (err) throw err;
      console.log('Token stored to storedToken.json');
    });
  }

class YTClient {
  constructor() {
    this._options = ['https://www.googleapis.com/auth/youtube']

    // validate the redirectUri.  This is a frequent cause of confusion.
    if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
      throw new Error(invalidRedirectUri);
    }
    const redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1];
    const parts = new url.URL(redirectUri);
    if (
      redirectUri.length === 0 ||
      parts.port !== '2000' ||
      parts.hostname !== 'localhost' ||
      parts.pathname !== '/oauth2callback'
    ) {
      throw new Error(invalidRedirectUri);
    }

    // create an oAuth client to authorize the API call
    this.oAuth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      redirectUri
    );
    this.youtube = {}
  }

  authorize() {
    let self = this
    let authorized = new Promise((res, rej) => {
      
      var clientSecret = keys.client_secret;
      var clientId = keys.client_id;
      var redirectUrl = keys.redirect_uris[keys.redirect_uris.length - 1];
      var oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
      
      // Check if we have previously stored a token.
      fs.readFile('storedToken.json', async function (err, token) {
        if (err) { // if file not found, get new token and eventually give the callback the client
          let client = await self.authenticate()
          self.oAuth2Client = client
          self.youtube = google.youtube({
            version: 'v3',
            auth: client,
          });
          console.log(self.youtube)
          console.log('-----------------------------------------------------------------------------------------------------')
          res()
        } else { // if file found get the stored credentials immediately give the callback the client
          oauth2Client.credentials = JSON.parse(token);
          self.oAuth2Client = oauth2Client;
          self.youtube = await google.youtube({
            version: 'v3',
            auth: oauth2Client,
          });
          // console.log(self.oAuth2Client.getAccessToken())
          res()
        }
      });
    })
    return authorized
  }

  // Open an http server to accept the oauth callback. In this
  // simple example, the only request to our webserver is to
  // /oauth2callback?code=<code>
  async authenticate() {
    return new Promise((resolve, reject) => {
      // grab the url that will be used for authorization
      this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this._options.join(' '),
      });
      const server = http
        .createServer(async (req, res) => {
          try {
            if (req.url.indexOf('/oauth2callback') > -1) {
              const qs = new url.URL(req.url, 'http://localhost:2000')
                .searchParams;
              res.end(
                'Authentication successful! Please return to the console.'
              );
              server.destroy();
              const { tokens } = await this.oAuth2Client.getToken(qs.get('code'));
              this.oAuth2Client.credentials = tokens;
              storeToken(tokens)
              resolve(this.oAuth2Client);
            }
          } catch (e) {
            reject(e);
          }
        })
        .listen(2000, () => {
          // open the browser to the authorize url to start the workflow
          // opn(this.authorizeUrl).then(cp => cp.unref());
        });
      destroyer(server);
    });
  }


}
// [END auth_oauth2_workflow]
module.exports = new YTClient();
