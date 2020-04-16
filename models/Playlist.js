
module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('playlist', {
    id: { type: DataTypes.STRING, primaryKey: true },
    etag: DataTypes.STRING,
    channelId: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'playlist',
    paranoid: true
  })

  return Playlist;
}

/* {
  "kind": "playlistutube#playlist",
    "etag": "\"tnVOtk4NeGU6nDncDTE5m9SmuHc/Ct8m3dONDLcbfD_JobyHywNy-3w\"",
      "id": "PLbhdMTAYtzZYYBUl3AOMgWi33m2sbUHzh",
        "snippet": {
    "publishedAt": "2020-04-13T19:39:31.000Z",
      "channelId": "UCIg5EReAljcyemPfDSn-V3g",
        "title": "Mc inspiration",
          "description": "",
            "thumbnails": {
      "default": {
        "url": "https://i.ytimg.com/vi/-W7zt8181Zo/default.jpg",
          "width": 120,
            "height": 90
      },
      "medium": {
        "url": "https://i.ytimg.com/vi/-W7zt8181Zo/mqdefault.jpg",
          "width": 320,
            "height": 180
      },
      "high": {
        "url": "https://i.ytimg.com/vi/-W7zt8181Zo/hqdefault.jpg",
          "width": 480,
            "height": 360
      },
      "standard": {
        "url": "https://i.ytimg.com/vi/-W7zt8181Zo/sddefault.jpg",
          "width": 640,
            "height": 480
      },
      "maxres": {
        "url": "https://i.ytimg.com/vi/-W7zt8181Zo/maxresdefault.jpg",
          "width": 1280,
            "height": 720
      }
    },
    "channelTitle": "eima mit ohne alles",
      "localized": {
      "title": "Mc inspiration",
        "description": ""
    }
  }
} */
