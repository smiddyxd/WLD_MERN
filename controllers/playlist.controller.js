const db = require('../models')
const Playlist = db.playlists
const Video = db.videos
const PlaylistItem = db.playlistItems
const Op = db.Sequelize.Op


const { handleMissingParams } = require('../utils/validationUtils')
const { asyncForEach } = require('../utils/utils')
const { getPlaylistData, getPlaylistItems } = require('../youtubeApi/playlists')
const { createVideoWithoutRequest } = require('./video.controller')

exports.test = async (req, res) => {
  let videoWithPlaylists = await Video.findAll({where: {id : req.body.id}, include: Playlist})
  res.send(videoWithPlaylists)
}

exports.cache = async (req, res) => {
  let parameterMissing = handleMissingParams(req, res, 'body', ['data', 'items'], 'PlaylistDataAndItems')
  if (parameterMissing) return
  const {items} = req.body
  const data = req.body.data.data.items[0]
  console.log(data)
  let playlist = {
    id: data.id,
    etag: data.etag,
    title: data.snippet.title,
    channelId: data.snippet.channelId,
    publishedAt: data.snippet.publishedAt,
    description: data.snippet.description
  }

  let playlistSavedInDB = await Playlist.create(playlist)
  let playlistItemsSavedInDB = []
  let videosSavedInDB = []
  let itemsAndVideosSavedInDB = await asyncForEach(items, async item => {
    let videoSavedInDB = await createVideoWithoutRequest(item.videoData)
    videosSavedInDB.push(videoSavedInDB)

    let playlistItem = {
      id: item.playlistItemData.id,
      etag: item.playlistItemData.etag,
      position: item.playlistItemData.snippet.position,
      VideoId: item.videoData.id,
      PlaylistId: data.id
    }

    let playlistItemSavedInDB = await PlaylistItem.create(playlistItem)
    playlistItemsSavedInDB.push(playlistItemSavedInDB)
  })

  res.send({
    success: true,
    playlist: playlistSavedInDB,
    playlistItems: playlistItemsSavedInDB,
    videos: videosSavedInDB
  })
}

exports.create = async (req, res) => {
  // let { id, action } = req.body

  let parameterMissing = handleMissingParams(req, res, 'body', ['id', 'action'] , 'Playlist')
  if (parameterMissing) return
  let { id, action } = req.body

  let playlistInDB = await Playlist.findByPk(id)

  /* 
  scenarios
  cache playlist
  register playlist
  
  playlist notInDB
  playlistCached
  playlistRegistered
  */

  if (playlistInDB !== null) {
    res.send({message: 'Playlist already exists in DB'})
    return
  }

  
  let fetchedPlaylistData = await getPlaylistData(id)

  let playlist = {
    id,
    etag: fetchedPlaylistData.etag,
    publishedAt: fetchedPlaylistData.snippet.publishedAt,
    channelId: fetchedPlaylistData.snippet.channelId,
    title: fetchedPlaylistData.snippet.title,
    description: fetchedPlaylistData.snippet.description
  }
  
  let createdPlaylist = await Playlist.create(playlist)
  
  if (action === 'register') {  
    registerPlaylistItems(id)
    .then(successful => {
      if (successful) {
        createdPlaylist.registered = true
        createdPlaylist.save()
        res.status(201).send({ message: 'playlist and items registered' })
      }
    })
  } else if (action === 'cache') {
    cachePlaylistItems()
  }
  return
}

const registerPlaylistItems = async (playlistId) => {
  console.log(1)
  // let allPlaylistItemsRegistered = new Promise(async (res, rej) => {
    console.log(2)
    let fetchedPlaylistItems = await getPlaylistItems(playlistId, [], 'snippet, contentDetails, statistics')
    // console.log(fetchedPlaylistItems.length)

    // console.log(Object.keys(fetchedPlaylistItems[0]))
    let itemsRegistered = await asyncForEach(fetchedPlaylistItems, async item => {
      // console.log(item.videoData.snippet.title)
      
      // assumptions:
      // none of playlistItems are in DB yet

      // every item has to be registered as a video and as a playlistItem

      let videoCreated = await createVideoWithoutRequest(item.videoData, 'register')

      let playlistItem = {
        VideoId: item.videoData.id,
        PlaylistId: playlistId,
        etag: item.playlistItemData.etag,
        id: item.playlistItemData.id,
        position: item.playlistItemData.position
      }

      let playlistItemCreated = await PlaylistItem.create(playlistItem)
    })

    return true
      
      /* let videoInDB = await Video.findAll({where: {id: item.videoData.id}, include: Playlist})
      

      if (videoExistsinDB) {
        if (playlistItemExists) {
          if ()
        } else {

        }
      } else {
        registerVideo()
        createPlaylistItem()
      }

      if (item.videoData.etag !== videoInDB.etag)
      if (item.playlistItemData.etag !== videoInDB.etag)
      // check if cached
      // check if etag changed

      if (videoInDB !== null && !videoInDB.registered) {
        videoInDB.viewCount = fetchedVideoData.statistics.viewCount
        videoInDB.likeCount = fetchedVideoData.statistics.likeCount
        videoInDB.dislikeCount = fetchedVideoData.statistics.dislikeCount
        videoInDB.commentCount = fetchedVideoData.statistics.commentCount
        videoInDB.registered = true
        videoInDB.save()
      } else if (videoInDB === null) {
        let video = {
          fetchedPlaylistItems
        }
      }
      let playlistItem = {

      }

      console.log(item.videoData.snippet.title + (videoInDB !== null ? ' already in DB' : ' not found in DB'))
    })
    res(true)
  })
  return allPlaylistItemsRegistered */
}

const cachePlaylistItems = (req, res) => {

}


  // Playlist.save(playlist)
  // .then(() => {res.send({message: 'playlist created'})})



  
  // if action === register and when all items are registered
  // set playlist.registered = true and save again
  

  /* playlistData.items.forEach(item => {
    let video = {}
    let  */
    // find item in DB by id

    // if (!R && AR) {
    //   1. register video
    //   2. create PI in DB
    // } else if (N && AC) {
    //   1. cache video
    //   2. create PI in DB
    // } else {
    //   create PI in DB
    // }

    /* 
    let videoInDB = getVideoFromDB
    if (videoInDB !== null) {
      if (!registered && action === 'register') 
      {
        registerVideo
      } else {

      }
    } 
    
    action register
    action cache
    
    registered
    cached
    notInDB

    AR + R - create PI in DB
    // AR + C - 1. register video 2. create PI in DB
    // AR + N - 1. register video 2. create PI in DB
    AC + R - create PI in DB
    AC + C - create PI in DB
    AC + N - 1. cache video 2. create PI in DB

    if (!R && AR) {
      1. register video 
      2. create PI in DB
    } else if (N && AC) {
      1. cache video
      2. create PI in DB
    } else {
      create PI in DB
    }
    
    */
/*     Video.
    PlaylistItem.create(item)
  }) */

exports.delete = (req, res) => {
  const id = req.body.id;

// console.log('deleting ' + id)
// res.status(200).send({message: 'deleted ' + id})
  Playlist.destroy({
    where: { id: id }
  })
    .then(num => {
      console.log(num)
      if (num == 1) {
        res.send({
          message: "Playlist was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Playlist with id=${id}. Maybe Playlist was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Playlist with id=" + id
      });
    });
}

exports.update = (req, res) => {
  const { id } = req.body

  Playlist.update({title: 'this is a new title'},{where: {id: id}})
  .then(num => {
    console.log('updated ' + id)
    console.log('num: ' + num)
    res.send({message: 'updated ' + id})
  })
/*   

  // check if playlist info itself has changed with playlist etag
  // check for each playlistItem info has changed with video etags and playlistItem etags

  let playlistInDB = await Playlist.findByPK(id)
  let playlistData = await getPlaylistData(id)


  let actionRedundant = (playlistInDB.registered === true && action === 'cache')
  ||  (playlistInDB.registered === true && action === 'cache')

  if (playlistInDB.etag === playlistData.etag) {
    res.send()
  }
  // if etag has changed: update playlist / send request back 
  // to ask user whether playlist should be updated 
  
  */
}

// Retrieve all Playlists from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Playlist.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving playlists."
      });
    });
};

// Find a single Playlist with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Playlist.findById(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Playlist with id=" + id
      });
    });
};

// Update a Playlist by the id in the request
// exports.update = (req, res) => {
//   const id = req.params.id;

//   Playlist.update(req.body, {
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Playlist was updated successfully."
//         });
//       } else {
//         res.send({
//           message: `Cannot update Playlist with id=${id}. Maybe Playlist was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating Playlist with id=" + id
//       });
//     });
// };

// Delete a Playlist with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Playlist.destroy({
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Playlist was deleted successfully!"
//         });
//       } else {
//         res.send({
//           message: `Cannot delete Playlist with id=${id}. Maybe Playlist was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete Playlist with id=" + id
//       });
//     });
// };

// Delete all Playlists from the database.
exports.deleteAll = (req, res) => {
  Playlist.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Playlists were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all playlists."
      });
    });
};

// Find all published Playlists
// exports.findAllPublished = (req, res) => {
// Tutorial.findAll({ where: { published: true } })
//   .then(data => {
//     res.send(data);
//   })
//   .catch(err => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while retrieving tutorials."
//     });
//   });
// };
