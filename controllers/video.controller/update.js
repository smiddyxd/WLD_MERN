const differenceInHours = require('date-fns')

const db = require('../../models')
const Video = db.videos
const VideoSnapshot = db.videoSnapshots

const { handleMissingParams } = require('../../utils/validationUtils')
const { getVideoData } = require('../../youtubeApi/videos')

// maybe do another update function for statistics

exports.updateOneV2 = async (req, res) => {
  let paramtersMissing = handleMissingParams(req, res, 'body', ['id', 'action'], 'Video.Update')
  if (paramtersMissing) return

  let { id, parts, action } = req.body

  console.log(1)

  let videoInDB = await Video.findByPk(id)

  console.log(2)

  if (videoInDB === null) {
    res.send({ msg: "video doesn't exist in DB yet" })
    return
    console.log(3)
  }
  console.log(4)

  if (!parts && action === 'register') {
    videoInDB.registered = true
    let videoSaved = await videoInDB.save()
    res.send({msg: "video registered without data update"})
    return
  }

  let fetchedVideoData = await getVideoData(id, parts)
  console.log(5)

  let snippetChanged = false
  let statisticsChanged = false
  // console.log(videoInDB.publishedAt, videoInDB.updatedSnippetAt)
  console.log(6)
  if (parts.includes('snippet') && snippetIsAllowedToUpdate(videoInDB.publishedAt, videoInDB.updatedSnippetAt) && (
    videoInDB.title !== fetchedVideoData.snippet.title ||
    videoInDB.description !== fetchedVideoData.snippet.description ||
    videoInDB.thumbnailUrl !== fetchedVideoData.snippet.thumbnails.default.url ||
    videoInDB.categoryId !== fetchedVideoData.snippet.categoryId))
  { snippetChanged = true; console.log(7) }
  if (parts.includes('statistics') && statisticsIsAllowedToUpdate(videoInDB.publishedAt, videoInDB.updatedStatisticsAt) && (
    videoInDB.viewCount !== fetchedVideoData.statistics.viewCount ||
    videoInDB.likeCount !== fetchedVideoData.statistics.likeCount ||
    videoInDB.dislikeCount !== fetchedVideoData.statistics.dislikeCount ||
    videoInDB.commentCount !== fetchedVideoData.statistics.commentCount)) 
  { statisticsChanged = true; console.log(8) }

  if (!snippetChanged && !statisticsChanged) {
    console.log(9)
    res.send({ 
      msg: "video is up to date or is not allowed to be updated yet", 
      statsAllowedToUpdate: statisticsIsAllowedToUpdate(videoInDB.publishedAt, videoInDB.updatedStatisticsAt),
      "parts.includes('statistics')": parts.includes('statistics') ,
      statisticsChanged/*,
      title: videoInDB.title !== fetcstatisticsChangededVideoData.snippet.title,
      description: videoInDB.description !== fetchedVideoData.snippet.description,
      thumbnailUrl: videoInDB.thumbnailUrl !== fetchedVideoData.snippet.thumbnails.default.url,
      categoryId: videoInDB.categoryId !== fetchedVideoData.snippet.categoryId */
    })
    return
  }
  console.log(10)

  let videoSnapshot = {
    VideoId: videoInDB.id,
    snapshotRecordedAt: videoInDB.updatedAt,
    etag: videoInDB.etag,
    title: videoInDB.title,
    description: videoInDB.description,
    thumbnailUrl: videoInDB.thumbnailUrl,
    tags: videoInDB.tags,
    categoryId: videoInDB.categoryId,
    viewCount: videoInDB.viewCount,
    likeCount: videoInDB.likeCount,
    dislikeCount: videoInDB.dislikeCount,
    commentCount: videoInDB.commentCount,
    thumbnailPath: videoInDB.id + '_' + videoInDB.updatedAt
  }
  console.log(videoSnapshot)
  let videoSnapshotCreated = await VideoSnapshot.create(videoSnapshot)
  console.log(11)
  if (snippetChanged) {
    console.log(12)
    videoInDB.title = fetchedVideoData.snippet.title
    videoInDB.description = fetchedVideoData.snippet.description
    videoInDB.thumbnailUrl = fetchedVideoData.snippet.thumbnails.default.url
    videoInDB.tags = fetchedVideoData.snippet.tags ? fetchedVideoData.snippet.tags.toString() : ''
    videoInDB.categoryId = fetchedVideoData.snippet.categoryId
    videoInDB.updatedSnippetAt = Date.now()
  }

  if (statisticsChanged) {
    videoInDB.viewCount = fetchedVideoData.statistics.viewCount
    videoInDB.likeCount = fetchedVideoData.statistics.likeCount
    videoInDB.dislikeCount = fetchedVideoData.statistics.dislikeCount
    videoInDB.commentCount = fetchedVideoData.statistics.commentCount
    videoInDB.updatedStatisticsAt = Date.now()
    console.log(13)
  }

  if (action === 'register') {
    console.log(14)
    videoInDB.register = true
  }
  console.log(15)


  let videoSaved = await videoInDB.save()
  console.log(16)

  let message = 'video updated with ' + action + 'and parts: '
  if (snippetChanged) message += 'snippet'
  if (statisticsChanged) message += ' and statistics'
  console.log(17)

  res.send({ message })
  console.log(18)

  return
}

const snippetIsAllowedToUpdate = (publishedAt, updatedAt) => {
  let publishedAtDate = new Date(publishedAt)
  let updatedAtDate = new Date(updatedAt)
  let publishedThisManyHoursAgo = (Date.now() - publishedAtDate) / (1000 * 60 * 60)
  let updatedThisManyHoursAgo = (Date.now() - updatedAtDate) / (1000 * 60 * 60)
  console.log('publishedThisManyHoursAgo: ', publishedThisManyHoursAgo)
  console.log('updatedThisManyHoursAgo: ', updatedThisManyHoursAgo)
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
  console.log('publishedThisManyHoursAgo: ', publishedThisManyHoursAgo)
  console.log('updatedThisManyHoursAgo: ', updatedThisManyHoursAgo)
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


exports.updateOne = async (req, res) => {
  let paramtersMissing = handleMissingParams(req, res, 'body', ['id', 'parts', 'action'], 'Video.Update')
  if (paramtersMissing) return

  let { id, action } = req.body

  let videoInDB = await Video.findByPk(id)

  if (videoInDB === null) {
    res.send({ msg: "video doesn't exist in DB yet" })
    return
  }

  let parts = action === 'register' ?
    'snippet, statistics' :
    'snippet'
  let fetchedVideoData = await getVideoData(id, parts)
  // console.log(Object.keys(fetchedVideoData))

  let videoDataChanged = false
  if (videoInDB.title != fetchedVideoData.snippet.title ||
    videoInDB.description != fetchedVideoData.snippet.description ||
    videoInDB.thumbnailUrl != fetchedVideoData.snippet.thumbnails.default.url ||
    videoInDB.categoryId != fetchedVideoData.snippet.categoryId) {videoDataChanged = true}
  if (action === 'register' && (
    videoInDB.viewCount !== fetchedVideoData.statistics.viewCount ||
    videoInDB.likeCount !== fetchedVideoData.statistics.likeCount ||
    videoInDB.dislikeCount !== fetchedVideoData.statistics.dislikeCount ||
    videoInDB.commentCount !== fetchedVideoData.statistics.commentCount
  )) {videoDataChanged = true}

  console.log('statistics different', videoInDB.viewCount !== fetchedVideoData.statistics.viewCount ||
  videoInDB.likeCount !== fetchedVideoData.statistics.likeCount ||
  videoInDB.dislikeCount !== fetchedVideoData.statistics.dislikeCount ||
  videoInDB.commentCount !== fetchedVideoData.statistics.commentCount)

  console.log(typeof videoInDB.viewCount)
  console.log(typeof fetchedVideoData.statistics.viewCount)
  console.log(typeof videoInDB.likeCount)
  console.log(typeof fetchedVideoData.statistics.likeCount)
  console.log(typeof videoInDB.dislikeCount)
  console.log(typeof fetchedVideoData.statistics.dislikeCount)
  console.log(typeof videoInDB.commentCount)
  console.log(typeof fetchedVideoData.statistics.commentCount)
    

  if (!videoDataChanged) {
    res.send({msg: 'video is up to date'})
    return
  }

  let videoSnapshotCreated = await VideoSnapshot.create({
    etag: videoInDB.etag,
    VideoId: videoInDB.id,
    title: videoInDB.title,
    description: videoInDB.description,
    thumbnailUrl: videoInDB.thumbnailUrl,
    tags: videoInDB.tags,
    categoryId: videoInDB.categoryId,
    snapshotRecordedAt: videoInDB.updatedAt,
    viewCount: videoInDB.viewCount,
    likeCount: videoInDB.likeCount,
    dislikeCount: videoInDB.dislikeCount,
    commentCount: videoInDB.commentCount,
    thumbnailPath: videoInDB.id + '_' + videoInDB.updatedAt
  })

  if (videoDataChanged) {
    videoInDB.title = fetchedVideoData.snippet.title
    videoInDB.description = fetchedVideoData.snippet.description
    videoInDB.thumbnailUrl = fetchedVideoData.snippet.thumbnails.default.url
    videoInDB.tags = fetchedVideoData.snippet.tags ? fetchedVideoData.snippet.tags.toString() : ''
    videoInDB.categoryId = fetchedVideoData.snippet.categoryId
    if (action === 'register') {
      videoInDB.viewCount = fetchedVideoData.statistics.viewCount
      videoInDB.likeCount = fetchedVideoData.statistics.likeCount
      videoInDB.dislikeCount = fetchedVideoData.statistics.dislikeCount
      videoInDB.commentCount = fetchedVideoData.statistics.commentCount
      videoInDB.registered = true
    }
  }

  let videoSaved = await videoInDB.save()

  res.send({message: "video updated with " + action})
  
  return
}

exports.updateMany = (updatedData) => { }
/* 
const cacheVideo = async (id) => {
  fetchedVideoData = await getVideoData(id, 'snippet, contentDetails')

  let video = {
    id,
    etag = fetchedVideoData.etag,
    publishedAt = fetchedVideoData.snippet.publishedAt,
    channelId = fetchedVideoData.snippet.channelId,
    title = fetchedVideoData.snippet.title,
    description = fetchedVideoData.snippet.description,
    thumbnailUrl = fetchedVideoData.snippet.thumbnails.default.url,
    thumbnailPath = './thumbnails/' + req.body.id,
    tags = fetchedVideoData.snippet.tags.toString(),
    categoryId = fetchedVideoData.snippet.categoryId,
    length = fetchedVideoData.contentDetails.duration
  }

  Video.create(video)
    .then(data => {
      res.send({
        data,
        message: 'caching successful!'
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Video."
      });
    });
}

const registerVideo = async (id) => {
  fetchedVideoData = await getVideoData(id, 'snippet, contentDetails, statistics')
}



exports.cache = async (req, res) => {

  if (!req.body.id) {
    // fs.writeFile('videoTestLog.json', JSON.stringify(req.headers),err => {console.log(err)})
    res.status(400).send({
      message: "Video ID can not be empty!"
    });
    return;
  }

  // if video has changed save old version in seperat table
  
  let fetchedVideoData = await getVideoData(req.body.id, 'snippet, contentDetails')
  
  let videoInDB = await Video.findByPk(req.body.id)

  if (fetchedVideoData.etag !== videoInDB.etag) {
    let videoScreenshot = videoInDB
    videoScreenshot.videoId = req.body.id
    videoScreenshot.id = undefined
    let finishedSaving = await videoScreenshot.save()
    videoScreenshot.thumbnailPath = './thumbnails/videoScreenshots' 
    + videoScreenshot.videoId 
    + '-' 
    + videoScreenshot.screenshotId
    videoScreenshot.registered = undefined
    videoScreenshot.Save()
  }

  let video = {}
  video.id = req.body.id
  video.etag = fetchedVideoData.etag
  video.publishedAt = fetchedVideoData.snippet.publishedAt
  video.channelId = fetchedVideoData.snippet.channelId
  video.title = fetchedVideoData.snippet.title
  video.description = fetchedVideoData.snippet.description
  video.thumbnailUrl = fetchedVideoData.snippet.thumbnails.default.url
  video.thumbnailPath = './thumbnails/' + req.body.id
  video.tags = fetchedVideoData.snippet.tags.toString()
  video.categoryId = fetchedVideoData.snippet.categoryId
  video.length = fetchedVideoData.contentDetails.duration


  Video.create(video)
    .then(data => {
      res.send({
        data,
        message: 'caching successful!'
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Video."
      });
    });
}

exports.register = async (req, res) => {
  console.log(req.body.id)
  // if video is already cached, do a reduced verison

  if (!req.body.id) {
    res.status(400).send({
      message: "Video ID can not be empty!"
    });
    return;
  }
  let video = {}
  const cachedVideo = await Video.findByPk(req.body.id)
  console.log(cachedVideo)
  if (cachedVideo !== null) {
    video = cachedVideo
    let fetchedStatistics = await getVideoData(req.body.id, 'statistics')
    video.viewCount = fetchedStatistics.statistics.viewCount
    video.likeCount = fetchedStatistics.statistics.likeCount
    video.dislikeCount = fetchedStatistics.statistics.dislikeCount
    video.commentCount = fetchedStatistics.statistics.commentCount
    video.registered = true
    video.save()
    res.send({
      video,
      message: 'registering cached video successful!'
    });
  } else {
    let fetchedVideoData = await getVideoData(req.body.id, 'snippet, contentDetails')
    video.id = req.body.id
    video.etag = fetchedVideoData.etag
    video.publishedAt = fetchedVideoData.snippet.publishedAt
    video.channelId = fetchedVideoData.snippet.channelId
    video.title = fetchedVideoData.snippet.title
    video.description = fetchedVideoData.snippet.description
    video.thumbnail_url = fetchedVideoData.snippet.thumbnails.default.url
    video.thumbnail_path = './thumbnails/' + req.body.id
    video.tags = fetchedVideoData.snippet.tags
    video.categoryId = fetchedVideoData.snippet.categoryId
    video.length = fetchedVideoData.contentDetails.duration
    video.viewCount = fetchedVideoData.statistics.viewCount
    video.likeCount = fetchedVideoData.statistics.likeCount
    video.dislikeCount = fetchedVideoData.statistics.dislikeCount
    video.commentCount = fetchedVideoData.statistics.commentCount
    video.registered = true

    Video.create(video)
      .then(data => {
        res.send({
          data,
          message: 'registering successful!'
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Video."
        });
      });
  };
};
 */
// Retrieve all Videos from the database.

exports.unregister = async (req, res) => {
  if (!req.body.id) {
    res.status(400).send({
      message: "Video ID can not be empty!"
    })
  }

  const registeredVideo = await Video.findByPk(req.body.id)
  registeredVideo.registered = false
  registeredVideo.save()
  res.send({ message: `Video ${req.body.id} successfully unregistered!` })
}

// Find a single Video with an id


// Update a Video by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Video.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Video was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Video with id=${id}. Maybe Video was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Video with id=" + id
      });
    });
};
