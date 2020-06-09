module.exports = app => {
  const videos = require("../../controllers/video.controller");

  var router = require("express").Router();

  router.post("/", videos.create)
  
  router.post("/updateOne", videos.updateOneV2);

  router.post("/updateMany", videos.updateMany);
  
  router.post("/delete", videos.delete);

  // // router.post("/cache", videos.cache);

  // // router.post("/register", videos.register);

  // // router.post("/unregister", videos.unregister);

  router.get("/", videos.findAll);

  // router.get("/:id", videos.findOne)

  // // Retrieve all Tutorials
  // router.get("/", videos.findAll);

  // // Retrieve all published Tutorials
  // // router.get("/published", videos.findAllPublished);

  // // Retrieve a single Tutorial with id
  // router.get("/:id", videos.findOne);

  // // Update a Tutorial with id
  // router.put("/:id", videos.update);

  // // Delete a Tutorial with id
  // router.delete("/:id", videos.delete);

  // // Create a new Tutorial
  // router.delete("/", videos.deleteAll);

  app.use('/api/video', router);
};
