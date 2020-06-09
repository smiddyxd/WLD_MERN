
const Video = require('./')

module.exports = (sequelize, DataTypes) => {
  const VideoSnapshots = sequelize.define('VideoSnapshots', {
    VideoId: {
      type: DataTypes.STRING,
      references: {
        model: Video,
        key: 'id',
      },
      primaryKey: true
    },
    etag: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    thumbnailUrl: DataTypes.STRING,
    thumbnailPath: DataTypes.STRING,
    tags: DataTypes.TEXT,
    categoryId: DataTypes.STRING,
    viewCount: DataTypes.STRING,
    likeCount: DataTypes.STRING,
    dislikeCount: DataTypes.STRING,
    commentCount: DataTypes.STRING,
    snapshotRecordedAt: { type: DataTypes.DATE, primaryKey: true }
  }, {
    sequelize,
    modelName: 'VideoSnapshots'
  })

  return VideoSnapshots;
}

/* 
    id: { type: DataTypes.STRING, primaryKey: true },
    etag: DataTypes.STRING,
    publishedAt: DataTypes.DATE,
    channelId: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING(10000),
    thumbnailUrl: DataTypes.STRING,
    thumbnailPath: DataTypes.STRING,
    tags: DataTypes.STRING(400),
    categoryId: DataTypes.INTEGER,
    length: DataTypes.STRING,
    viewCount: DataTypes.INTEGER,
    likeCount: DataTypes.INTEGER,
    dislikeCount: DataTypes.INTEGER,
    commentCount: DataTypes.INTEGER,
    registered: { type: DataTypes.BOOLEAN, defaultValue: false }

*/

/*
id
snippet
  publishedAt
  channelId (if not already registered register now with this id and the channelTitle that comes with snippet)
  title
  description
  channelTitle
  tags
  categoryId
  thumbnails
contentDetails
  duration
statistics
  viewCount
  likeCount
  dislikeCount
  commentCount
*/

/*
  {
   "kind": "youtube#video",
   "etag": "\"nxOHAKTVB7baOKsQgTtJIyGxcs8/qTW8_ani__jLd8BNlDIl_4sPUvI\"",
   "id": "UN8jFHd3yf4",
   "snippet": {
    "publishedAt": "2020-04-19T02:15:02.000Z",
    "channelId": "UCvixJtaXuNdMPUGdOPcY8Ag",
    "title": "Could We Really Vote by Mail in 2020?",
    "description": "--Audience Question: Will vote-by-mail be a reality for the 2020 election?\n\nSupport The David Pakman Show:\n-Become a Member: https://www.davidpakman.com/membership\n-Become a Patron: https://www.patreon.com/davidpakmanshow\n-Get your TDPS Gear: http://www.davidpakman.com/gear\n\nEngage with us on social media:\n\n-Join on YouTube: https://www.youtube.com/channel/UCvixJtaXuNdMPUGdOPcY8Ag/join\n-Follow David on Twitter: http://www.twitter.com/dpakman\n-David on Instagram: http://www.instagram.com/david.pakman\n-TDPS on Instagram: https://www.instagram.com/davidpakmanshow/\n-Discuss on TDPS subreddit: http://www.reddit.com/r/thedavidpakmanshow/\n-Facebook: http://www.facebook.com/davidpakmanshow\n-Call the 24/7 Voicemail Line: (219)-2DAVIDP\n\n-Timely news is important! We upload new clips every day! Make sure to subscribe!\n\nBroadcast on April 17, 2020\n\n#davidpakmanshow #votebymail #2020election",
    "thumbnails": {
     "default": {
      "url": "https://i.ytimg.com/vi/UN8jFHd3yf4/default.jpg",
      "width": 120,
      "height": 90
     },
     "medium": {
      "url": "https://i.ytimg.com/vi/UN8jFHd3yf4/mqdefault.jpg",
      "width": 320,
      "height": 180
     },
     "high": {
      "url": "https://i.ytimg.com/vi/UN8jFHd3yf4/hqdefault.jpg",
      "width": 480,
      "height": 360
     },
     "standard": {
      "url": "https://i.ytimg.com/vi/UN8jFHd3yf4/sddefault.jpg",
      "width": 640,
      "height": 480
     }
    },
    "channelTitle": "David Pakman Show",
    "tags": [
     "vote by mail 2020 election",
     "need to vote by mail",
     "trump vote by mail",
     "why is trump against vote by mail",
     "trump vote my mail hypocrisy",
     "2020 election coronavirus",
     "safe to vote 2020 election",
     "voter integrity",
     "election integrity",
     "voter fraud",
     "voter id laws",
     "trump delay 2020 election",
     "joe bdien vs donald trump",
     "can biden beat trump",
     "biden 2020",
     "trump 2020"
    ],
    "categoryId": "25",
    "liveBroadcastContent": "none",
    "defaultLanguage": "en",
    "localized": {
     "title": "Could We Really Vote by Mail in 2020?",
     "description": "--Audience Question: Will vote-by-mail be a reality for the 2020 election?\n\nSupport The David Pakman Show:\n-Become a Member: https://www.davidpakman.com/membership\n-Become a Patron: https://www.patreon.com/davidpakmanshow\n-Get your TDPS Gear: http://www.davidpakman.com/gear\n\nEngage with us on social media:\n\n-Join on YouTube: https://www.youtube.com/channel/UCvixJtaXuNdMPUGdOPcY8Ag/join\n-Follow David on Twitter: http://www.twitter.com/dpakman\n-David on Instagram: http://www.instagram.com/david.pakman\n-TDPS on Instagram: https://www.instagram.com/davidpakmanshow/\n-Discuss on TDPS subreddit: http://www.reddit.com/r/thedavidpakmanshow/\n-Facebook: http://www.facebook.com/davidpakmanshow\n-Call the 24/7 Voicemail Line: (219)-2DAVIDP\n\n-Timely news is important! We upload new clips every day! Make sure to subscribe!\n\nBroadcast on April 17, 2020\n\n#davidpakmanshow #votebymail #2020election"
    },
    "defaultAudioLanguage": "en"
   },
   "contentDetails": {
    "duration": "PT4M58S",
    "dimension": "2d",
    "definition": "hd",
    "caption": "true",
    "licensedContent": true,
    "projection": "rectangular"
   },
   "status": {
    "uploadStatus": "processed",
    "privacyStatus": "public",
    "license": "youtube",
    "embeddable": true,
    "publicStatsViewable": true,
    "madeForKids": false
   },
   "statistics": {
    "viewCount": "4631",
    "likeCount": "337",
    "dislikeCount": "16",
    "favoriteCount": "0",
    "commentCount": "161"
   },
   "player": {
    "embedHtml": "\u003ciframe width=\"480\" height=\"270\" src=\"//www.youtube.com/embed/UN8jFHd3yf4\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen\u003e\u003c/iframe\u003e"
   },
   "topicDetails": {
    "relevantTopicIds": [
     "/m/098wr",
     "/m/05qt0",
     "/m/098wr",
     "/m/05qt0"
    ],
    "topicCategories": [
     "https://en.wikipedia.org/wiki/Politics",
     "https://en.wikipedia.org/wiki/Society"
    ]
   },
   "localizations": {
    "en": {
     "title": "Could We Really Vote by Mail in 2020?",
     "description": "--Audience Question: Will vote-by-mail be a reality for the 2020 election?\n\nSupport The David Pakman Show:\n-Become a Member: https://www.davidpakman.com/membership\n-Become a Patron: https://www.patreon.com/davidpakmanshow\n-Get your TDPS Gear: http://www.davidpakman.com/gear\n\nEngage with us on social media:\n\n-Join on YouTube: https://www.youtube.com/channel/UCvixJtaXuNdMPUGdOPcY8Ag/join\n-Follow David on Twitter: http://www.twitter.com/dpakman\n-David on Instagram: http://www.instagram.com/david.pakman\n-TDPS on Instagram: https://www.instagram.com/davidpakmanshow/\n-Discuss on TDPS subreddit: http://www.reddit.com/r/thedavidpakmanshow/\n-Facebook: http://www.facebook.com/davidpakmanshow\n-Call the 24/7 Voicemail Line: (219)-2DAVIDP\n\n-Timely news is important! We upload new clips every day! Make sure to subscribe!\n\nBroadcast on April 17, 2020\n\n#davidpakmanshow #votebymail #2020election"
    }
   }
  }*/
