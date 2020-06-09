// Copyright 2012 Google LLC
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

// 'use strict';

// const http = require('http');
// const url = require('url');
// const opn = require('open');
// const destroyer = require('server-destroy');

// const { google } = require('googleapis');
// const youtube  = google.youtube  ('v3');

// /**
//  * Create a new OAuth2 client with the configured keys.
//  */
// const oauth2Client = new google.auth.OAuth2(
//   '563856617839-5plsi2jjd76jv7n9strql1hufi8co6vb.apps.googleusercontent.com',
//   '1AXfp0i06cPhkHV9Hn1pZCCv',
//   'http://localhost:3000/'
// );

// /**
//  * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
//  */
// google.options({ auth: oauth2Client });

// /**
//  * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
//  */
// async function authenticate(scopes) {
//   return new Promise((resolve, reject) => {
//     // grab the url that will be used for authorization
//     const authorizeUrl = oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: scopes.join(' '),
//     });
//     const server = http
//       .createServer(async (req, res) => {
//         try {
//           if (req.url.indexOf('/oauth2callback') > -1) {
//             const qs = new url.URL(req.url, 'http://localhost:4000')
//               .searchParams;
//             res.end('Authentication successful! Please return to the console.');
//             server.destroy();
//             const { tokens } = await oauth2Client.getToken(qs.get('code'));
//             oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
//             resolve(oauth2Client);
//           }
//         } catch (e) {
//           reject(e);
//         }
//       })
//       .listen(4000, () => {
//         // open the browser to the authorize url to start the workflow
//         opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
//       });
//     destroyer(server);
//   });
// }

// async function runSample() {
//   const res = await youtube.playlists.list({
//     part: 'id,snippet',
//     id: 'PLIivdWyY5sqIij_cgINUHZDMnGjVx3rxi'
//   });
//   console.log('Status code: ' + res.status);
//   console.log(res.data);
//   return res;
// }

// const scopes = ['https://www.googleapis.com/auth/youtube'];
// authenticate(scopes)
//   .then(client => runSample(client))
//   .catch(console.error);

const { runSample } = require('playlists')
