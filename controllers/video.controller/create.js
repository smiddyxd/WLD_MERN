const db = require('../../models')
const Video = db.videos
const { handleMissingParams } = require('../../utils/validationUtils')

const { getVideoData } = require('../../youtubeApi/videos')

exports.create = async (req, res) => {
  let paramterMissing = await handleMissingParams(req, res, 'body', ['id', 'action'], 'video')
  if (paramterMissing) return

  let { id, action } = req.body

  let videoInDB = await Video.findByPk(id)

  if (videoInDB !== null) {
    res.send({ message: 'Video already exists in DB' })
    return
  }

  let parts = action === 'register' ?
    'snippet, contentDetails, statistics' :
    'snippet, contentDetails'
  let fetchedVideoData = await getVideoData(id, parts)

  let video = {
    id,
    etag: fetchedVideoData.etag,
    publishedAt: fetchedVideoData.snippet.publishedAt,
    channelId: fetchedVideoData.snippet.channelId,
    title: fetchedVideoData.snippet.title,
    description: fetchedVideoData.snippet.description,
    thumbnailUrl: fetchedVideoData.snippet.thumbnails.default.url,
    thumbnailPath: './thumbnails/' + req.body.id,
    tags: fetchedVideoData.snippet.tags ? fetchedVideoData.snippet.tags.toString() : '',
    categoryId: fetchedVideoData.snippet.categoryId,
    length: fetchedVideoData.contentDetails.duration
  }

  if (action === 'register') {
    video.viewCount = fetchedVideoData.statistics.viewCount
    video.likeCount = fetchedVideoData.statistics.likeCount
    video.dislikeCount = fetchedVideoData.statistics.dislikeCount
    video.commentCount = fetchedVideoData.statistics.commentCount
    video.registered = true
  }

  Video.create(video)
    .then(data => {
      res.send({
        data,
        message: action + ' successful!'
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Video."
      });
    });
}

exports.createVideoWithoutRequest = (data, parts) => {
  let video = {
    id: data.id,
    etag: data.etag,
    publishedAt: data.snippet.publishedAt,
    channelId: data.snippet.channelId,
    title: data.snippet.title,
    description: data.snippet.description,
    thumbnailUrl: data.snippet.thumbnails.default.url,
    thumbnailPath: './thumbnails/' + data.id,
    tags: data.snippet.tags ? data.snippet.tags.toString() : '', 
    categoryId: data.snippet.categoryId,
    length: data.contentDetails ? data.contentDetails.duration : undefined
  }

  /* if (action === 'register') {
    video.viewCount = data.statistics.viewCount
    video.likeCount = data.statistics.likeCount
    video.dislikeCount = data.statistics.dislikeCount
    video.commentCount = data.statistics.commentCount
    video.registered = true
  } */

  let videoCreated = Video.create(video)

  return videoCreated
}
