const axios = require('axios')
const { api_key } = require('../credentials/credentialsSets').credentialsSets[0]
const { access_token } = require('../credentials/tokens')

const { getVideoData } = require('./videos')

let config = {
  headers: { authorization: 'Bearer ' + access_token },
  Accept: 'application/json'
}
exports.getPlaylistData = async (id) => {

  let playlistData = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${id}&key=${api_key}`, config)
    .then(res => res.data.items[0])

  // let playlistItems = await recursvielyGetPlaylistItems(id, [])
  // playlistData.items = playlistItems

  return playlistData
}

exports.getPlaylistItems = async (playlistId, items, videoParts, nextPageToken) => {
  console.log(3)
  url = `https://www.googleapis.com/youtube/v3/playlistItems?part=${encodeURIComponent('snippet, contentDetails')}&playlistId=${playlistId}&maxResults=50&key=${api_key}$`
  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`
  }
  let data = await axios.get(url, config)
  .then(res => res.data)
  let allItems = items.concat(data.items)
  if (data.nextPageToken) {
    allItems = await getPlaylistItems(playlistId, allItems, videoParts, data.nextPageToken)
  }  
  
  let allItemsWithVideoDataFetched = await Promise.all(allItems.map(async (item, i, arr) => {
      let fetchedVideoData = await getVideoData(item.contentDetails.videoId, videoParts)
      if (i === arr.length - 1) {
        finished = true
      }
      return {
        playlistItemData: {
          id: item.id,
          etag: item.etag,
          position: item.snippet.position
        },
        videoData: fetchedVideoData
      }
    })
  )
  let allItemsWithVideoData = await allItemsWithVideoDataFetched
  return allItemsWithVideoData
}

/* 
GET https://www.googleapis.com/youtube/v3/playlistItems?
part=snippet%2C%20contentDetails&
maxResults=50&
playlistId=PLbhdMTAYtzZbvWTxuHlxkJK3hteLv8CSV&
key=[YOUR_API_KEY]

Authorization: Bearer [YOUR_ACCESS_TOKEN]
Accept: application/json


*/
