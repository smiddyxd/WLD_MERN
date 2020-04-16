module.exports = app => {
  const playlists = require("../../controllers/playlist.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", playlists.create);

  // Retrieve all Tutorials
  router.get("/", playlists.findAll);

  // Retrieve all published Tutorials
  // router.get("/published", playlists.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", playlists.findOne);

  // Update a Tutorial with id
  router.put("/:id", playlists.update);

  // Delete a Tutorial with id
  router.delete("/:id", playlists.delete);

  // Create a new Tutorial
  router.delete("/", playlists.deleteAll);

  app.use('/api/playlists', router);
};
