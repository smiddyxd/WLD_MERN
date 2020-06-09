module.exports = app => {
  const playlist = require("../../controllers/playlist.controller.js");

  var router = require("express").Router();

  // router.post("/cache", playlists.cache)
  
  router.post("/", playlist.create)

  router.post("/delete", playlist.delete)

  router.post("/update", playlist.update)
  
  router.get("/", playlist.findAll)

  router.post('/test', playlist.test)

  router.post('/cache', playlist.cache)

  // Retrieve all published Tutorials
  // router.get("/published", playlists.findAllPublished);

  // // Retrieve a single Tutorial with id
  // router.get("/:id", playlists.findOne);

  // // Update a Tutorial with id
  // router.put("/:id", playlists.update);

  // // Delete a Tutorial with id
  // router.delete("/:id", playlists.delete);

  // // Create a new Tutorial
  // router.delete("/", playlists.deleteAll);

  app.use('/api/playlist', router);
};
