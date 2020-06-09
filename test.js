// const { differenceInHours } = require('date-fns')
const { api_key } = require('./credentials/credentialsSets.json').credentialsSets[0]
const { access_token } = require('./credentials/tokens.json')

const { asyncForEach } = require('./utils/utils')
const { getVideoData } = require('./youtubeApi/videos')

const axios = require('axios')

const db = require('./models')
const Video = db.videos

// const getVideoData = require('./youtubeApi/videos').getVideoData

// getVideoData('7g5AHio1O_A')

// const { access_token, refresh_token } = require('./youtubeApi/credentials/tokens.json')

// const { getIsTokenExpired } = require('./controllers/auth.controller.js')

// const { queueNextSetOfKeys } = require('./credentials/keysManager')

const { recursvielyGetPlaylistItems, getPlaylistData } = require('./youtubeApi/playlists')

const snippetIsAllowedToUpdate = (publishedAt, updatedAt) => {
  let publishedAtDate = new Date(publishedAt)
  let updatedAtDate = new Date(updatedAt)
  let publishedThisManyHoursAgo = (Date.now() - publishedAtDate) / (1000 * 60 * 60)
  let updatedThisManyHoursAgo = (Date.now() - updatedAtDate) / (1000 * 60 * 60)
  switch (true) {
    case publishedThisManyHoursAgo < 2:
      if (updatedThisManyHoursAgo > 0.5) return true
    case publishedThisManyHoursAgo > 2 && publishedThisManyHoursAgo < 4:
      if (updatedThisManyHoursAgo > 1) return true
    case publishedThisManyHoursAgo > 4 && publishedThisManyHoursAgo < 8:
      if (updatedThisManyHoursAgo > 2) return true
    case publishedThisManyHoursAgo > 8 && publishedThisManyHoursAgo < 32:
      if (updatedThisManyHoursAgo > 4) return true
    case publishedThisManyHoursAgo > 32 && publishedThisManyHoursAgo < 72:
      if (updatedThisManyHoursAgo > 10) return true
    case publishedThisManyHoursAgo > 72:
      if (updatedThisManyHoursAgo > 12) return true
    default:
      return false
  }
}

const statisticsIsAllowedToUpdate = (publishedAt, updatedAt) => {
  let publishedAtDate = new Date(publishedAt)
  let updatedAtDate = new Date(updatedAt)
  let publishedThisManyHoursAgo = (Date.now() - publishedAtDate) / (1000 * 60 * 60)
  let updatedThisManyHoursAgo = (Date.now() - updatedAtDate) / (1000 * 60 * 60)
  switch (true) {
    case publishedThisManyHoursAgo < 2:
      if (updatedThisManyHoursAgo > 0.333333) return true
    case publishedThisManyHoursAgo > 2 && publishedThisManyHoursAgo < 4:
      if (updatedThisManyHoursAgo > 0.5) return true
    case publishedThisManyHoursAgo > 4 && publishedThisManyHoursAgo < 8:
      if (updatedThisManyHoursAgo > 1) return true
    case publishedThisManyHoursAgo > 8 && publishedThisManyHoursAgo < 16:
      if (updatedThisManyHoursAgo > 2) return true
    case publishedThisManyHoursAgo > 16 && publishedThisManyHoursAgo < 32:
      if (updatedThisManyHoursAgo > 4) return true
    case publishedThisManyHoursAgo > 32 && publishedThisManyHoursAgo < 72:
      if (updatedThisManyHoursAgo > 8) return true
    case publishedThisManyHoursAgo > 72:
      if (updatedThisManyHoursAgo > 10) return true
    default:
      return false
  }
}

function* mockYTApi() {
  yield { items: [1, 2, 3, 50], nextPageToken: '1stPageToken' }
  yield 'playlistData'
  yield { items: [51, 52, 53, 100], nextPageToken: '2ndPageToken' }
  yield { items: [101, 102, 103, 150], nextPageToken: '3rdPageToken' }
  yield { items: [151, 152, 153, 200], nextPageToken: '4thPageToken' }
  yield { items: [201, 202, 203, 250]}
}

function* playlistFetchGeneratorTest(playlistId, apiKey, accessToken) {
  let mockApi = mockYTApi()
  // let counter = 0
  yield mockApi.next().value
  // console.log('nextPageToken: ', nextPageToken)
  let nextPageToken = yield mockApi.next().value
  // console.log('nextPageToken: ', nextPageToken)
  while (nextPageToken) {
    // console.log('nextPageToken: ', nextPageToken)
    nextPageToken = yield mockApi.next().value
  }
/*   let config = {
    headers: { authorization: 'Bearer ' + access_token },
    Accept: 'application/json'
  }

  let first50ItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=${encodeURIComponent('snippet, contentDetails')}&playlistId=${playlistId}&maxResults=50&key=${apiKey}$`
  yield axios(first50ItemsUrl, config).then(res => res.data.items[0])

  let playlistDataUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
  let nextPageToken = yield axios.get(playlistDataUrl, config)

  if (nextPageToken) {
    yield axios.get(playlistDataUrl + `&pageToken=${nextPageToken}`, config)
  } */
}

// fetch all items first, then load playlist data

async function getBatchOfPlaylistVideos(playlistId, passedApiKey, passedAccessToken, videoParts, currentPageToken) {
  let config = {
    headers: { authorization: 'Bearer ' + passedAccessToken },
    Accept: 'application/json'
  }

  let playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=${encodeURIComponent('snippet, contentDetails')}&playlistId=${playlistId}&maxResults=50&key=${passedApiKey}$`
  playlistItemsUrl += currentPageToken ? `&pageToken=${currentPageToken}` : ''
  let playlistItems = await axios(playlistItemsUrl, config).then(res => res.data).catch(err => console.log(err))

  let videoIds = playlistItems.items.map(item => item.contentDetails.videoId).join(', ')
  let videosUrl = `https://www.googleapis.com/youtube/v3/videos?id=${encodeURIComponent(videoIds)}&part=${encodeURIComponent(videoParts)}&playlistId=${playlistId}&maxResults=1&key=${passedApiKey}$`
  let videos = await axios(videosUrl, config).then(res => res.data.items).catch(err => console.log(err))

  return {
    nextPageToken: playlistItems.nextPageToken ? playlistItems.nextPageToken : undefined,
    playlistItems: playlistItems.items,
    videos
  }
}

// function* playlistItemsAndVideosGen(playlistId, apiKey, accessToken, videoParts) {
//   const { getBatchOfPlaylistVideos } = exports
//   // let allVideos = []
//   // let allPlaylistItems = []
//   let firstBatch = yield getBatchOfPlaylistVideos(playlistId, apiKey, accessToken, videoParts)
//   // allVideos = allVideos.concat(firstBatch.videos)
//   // allPlaylistItems = allPlaylistItems.concat(firstBatch.playlistItems)

//   let nextPageToken = yield
//   // let { nextPageToken } = firstBatch
//   while (nextPageToken) {
//     let nextBatch = yield getBatchOfPlaylistVideos(playlistId, apiKey, accessToken, videoParts, nextPageToken)
//     // allVideos = allVideos.concat(nextBatch.videos)
//     // allPlaylistItems = allPlaylistItems.concat(nextBatch.playlistItems)
//     nextPageToken = nextBatch.nextPageToken
//   }
//   // return {
//   //   videos: allVideos,
//   //   playlistItems: allPlaylistItems
//   // }
// }



/* 
fetch first 50 PIs
fetch the video for each item
yield first 50 PIs + video

*/

async function run() {
  let newGen = playlistItemsAndVideosGen()
  let playlistId = 'PLbhdMTAYtzZafxapwvh1qlJGcetZedsn7'
  let videoParts = 'snippet'
  let cache = {
    videos: [],
    playlistItems: {}
  }

  let first50 = await getBatchOfPlaylistVideos(playlistId, api_key, access_token, videoParts).next().value
  console.log('nextPageToken: ' + first50.nextPageToken)
  console.log('playlistItems.length: ' + first50.playlistItems.length)
  console.log('videos.length: ' + first50.videos.length)
  console.log('first video id: ' + first50.videos[0].id)
  console.log('first playlistItem video id: ' + first50.playlistItems[0].contentDetails.videoId)
  let next50 = await getBatchOfPlaylistVideos(playlistId, api_key, access_token, videoParts, first50.nextPageToken)
  console.log('nextPageToken: ' + next50.nextPageToken)
  console.log('playlistItems.length: ' + next50.playlistItems.length)
  console.log('videos.length: ' + next50.videos.length)
  console.log('first video id: ' + next50.videos[0].id)
  console.log('first playlistItem video id: ' + next50.playlistItems[0].contentDetails.videoId)
  // let { nextPageToken } = first50 
  // let counter = 0
  // while (nextPageToken) {
  //   let next50 = await newGen(playlistId, api_key, access_token, videoParts, nextPageToken).next
  //   console.log('nextPageToken: ' + next50.nextPageToken)
  //   console.log('playlistItems.length: ' + next50.playlistItems.length)
  //   console.log('videos.length: ' + next50.videos.length)
  //   console.log('first video id: ' + next50.videos[0].id)
  //   console.log('first playlistItem video id: ' + next50.playlistItems[0].contentDetails.videoId)
  // }
  // let first50 = await getBatchOfPlaylistVideos(playlistId, api_key, access_token, videoParts)
  // console.log('nextPageToken: ' + first50.nextPageToken)
  // console.log('playlistItems.length: ' + first50.playlistItems.length)
  // console.log('videos.length: ' + first50.videos.length)
  // console.log('first video id: ' + first50.videos[0].id)
  // console.log('first playlistItem video id: ' + first50.playlistItems[0].contentDetails.videoId)
  // let first50 = await getBatchOfPlaylistVideos(playlistId, apiKey, accessToken, first50.nextPageToken)
  // test with next page token



/*   let counter = 0
  let newGen = playlistFetchGenerator('PLbhdMTAYtzZbvWTxuHlxkJK3hteLv8CSV', api_key, access_token)
  let content = []
  let first50 = await newGen.next().value
  content = content.concat(first50.items)
  console.log(++counter, 'content: ', content.items)
  if (first50.nextPageToken) {
    let nextBatch = await newGen.next(first50.nextPageToken).value
    content = content.concat(nextBatch.items)
    console.log(++counter, 'content: ', content)
    while (nextBatch.nextPageToken) {
      nextBatch = await newGen.next(nextBatch.nextPageToken).value
      content = content.concat(nextBatch.items)
      console.log(++counter, 'content: ', content)
    }
  }
  let playlistData = await newGen.next().value
  console.log(Object.keys(playlistData))
  playlistItemsPlusVideoData = []
  let finishedFetchingVideos = await asyncForEach(content, async item => {
    let fetchedVideoData = await getVideoData(item.contentDetails.videoId, 'snippet, contentDetails')
    playlistItemsPlusVideoData.push({
      playlistItemData: item,
      videoData: fetchedVideoData
    })
  })
  console.log(playlistItemsPlusVideoData.length)
  console.log(Object.keys(playlistItemsPlusVideoData[0].videoData)) */

    // console.log(item.contentDetails.videoId)

  // console.log(api_key, access_token)
  // let first50 = newGen.next().value
  // newGen.next('12345pageToken').value
  // newGen.next('6789pageToken').value
  // newGen.next('101112pageToken').value
  // newGen.next('131415pageToken').value
  // newGen.next('161718pageToken').value
  

  // let publishedAt = '2020-04-30 02:25:12'
  // // let updatedSnippetAt = '2020-04-30 20:28:12'
  // let updatedStatisticsAt = '2020-04-30 15:12:12'

  // // let videoInDB = await Video.findByPk('nWrpkxRi6sM')

  // // console.log('snippetIsAllowedToUpdate: ', snippetIsAllowedToUpdate(publishedAt, updatedSnippetAt))
  // console.log('statisticsIsAllowedToUpdate: ', statisticsIsAllowedToUpdate(publishedAt, updatedStatisticsAt))
  // console.log({ diff: (a - b) / (1000 * 60 * 60) })
  // let testVideo = await Video.findByPk('i4TjDaYfaiQ')
  // res.send({ msg: differenceInHours(new Date(testVideo.publishedAt)) })

  // var a = new Date('2020-4-30T17:20:00')
  // var b = new Date('2020-4-30T16:20:00')
  // // console.log(moment(a.diff(b)).format("h[h] m[m] s[s]"))
  // console.log(differenceInHours(
  //   new Date(2020, 4, 30, 18, 0),
  //   new Date(2020, 4, 30, 17, 0)
  // ))

  // let publishedAt = moment('2020-04-30 16:00:00')
  // let updatedSnippetAt = moment('2020-04-30 14:50:00')
  // let updatedStatisticsAt = moment(undefined)

  // res.send({ date: publishedAt.getTimezoneOffset()})
  // console.log(snippetIsAllowedToUpdate(videoInDB.publishedAt, videoInDB.updatedSnippetAt))
  // console.log(statisticsIsAllowedToUpdate(videoInDB.publishedAt, videoInDB.updatedStatisticsAt))


  // queueNextSetOfKeys()
  

  // let playlistData = await getPlaylistData('PLbhdMTAYtzZay_31z_q5YsC3A5UAud6uq')
  // console.log(playlistData.snippet.title)
  // console.log(playlistData.items.length)
  // playlistData.items.forEach(item => console.log(item.snippet.title))

  // let playlistItems = await recursvielyGetPlaylistItems('PLbhdMTAYtzZbvWTxuHlxkJK3hteLv8CSV', [])
  // playlistItems.forEach(item => {
  //   console.log(item.snippet.title)
  // })
  // console.log(playlistItems.length)
  
  // console.log(playlistItems.length)
    // console.log(videoData)
  // let isTokenExpired = await getIsTokenExpired(access_token)
  // console.log(isTokenExpired)
  // fs.writeFile('testResponse.json', JSON.stringify(data), (err) => {
  //   if (err) throw err;
  //   console.log('testResponse.json saved');
  // });
}

run()
