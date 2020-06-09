module.exports = (sequelize, DataTypes) => {
  const PlaylistItems = sequelize.define('PlaylistItems', {
    id: { type: DataTypes.STRING, primaryKey: true },
    etag: DataTypes.STRING,
    position: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PlaylistItems'
  })

  return PlaylistItems;
}


// {
//   "kind": "youtube#playlistItem",
//     "etag": "\"tnVOtk4NeGU6nDncDTE5m9SmuHc/hgP-7bFbhqYSxoQyoHKoV5IaCCA\"",
//       "id": "UExiaGRNVEFZdHpaWVlCVWwzQU9NZ1dpMzNtMnNiVUh6aC41NkI0NEY2RDEwNTU3Q0M2",
//         "snippet": {
//     "publishedAt": "2020-04-13T19:39:31.000Z",
//       "channelId": "UCIg5EReAljcyemPfDSn-V3g",
//         "title": "Infinite procedurally generated city in Unity",
//           "description": "This video shows an infinite, procedurally generated city made from a set of ~100 blocks using the Wave Function Collapse Algorithm.\n\nDownload a playable build here: https://marian42.itch.io/wfc\nSource code: https://github.com/marian42/wavefunctioncollapse\nMy blog post explaining the project: https://marian42.de/article/wfc/\nAbout the Wave Function Collapse Algorithm: https://github.com/mxgmn/WaveFunctionCollapse",
//             "thumbnails": {
//       "default": {
//         "url": "https://i.ytimg.com/vi/-W7zt8181Zo/default.jpg",
//           "width": 120,
//             "height": 90
//       },
//       "medium": {
//         "url": "https://i.ytimg.com/vi/-W7zt8181Zo/mqdefault.jpg",
//           "width": 320,
//             "height": 180
//       },
//       "high": {
//         "url": "https://i.ytimg.com/vi/-W7zt8181Zo/hqdefault.jpg",
//           "width": 480,
//             "height": 360
//       },
//       "standard": {
//         "url": "https://i.ytimg.com/vi/-W7zt8181Zo/sddefault.jpg",
//           "width": 640,
//             "height": 480
//       },
//       "maxres": {
//         "url": "https://i.ytimg.com/vi/-W7zt8181Zo/maxresdefault.jpg",
//           "width": 1280,
//             "height": 720
//       }
//     },
//     "channelTitle": "eima mit ohne alles",
//       "playlistId": "PLbhdMTAYtzZYYBUl3AOMgWi33m2sbUHzh",
//         "position": 0,
//           "resourceId": {
//       "kind": "youtube#video",
//         "videoId": "-W7zt8181Zo"
//     }
//   },
//   "contentDetails": {
//     "videoId": "-W7zt8181Zo",
//       "videoPublishedAt": "2018-11-13T23:30:54.000Z"
//   }
// }
