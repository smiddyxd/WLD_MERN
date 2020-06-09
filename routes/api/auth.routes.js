module.exports = app => {
  var router = require("express").Router();

  const auth = require("../../controllers/auth.controller.js");

  router.get("/getTokenStatus", auth.getTokenStatus);

  router.get("/renewTokenWithAuthCode", auth.getTokenWithAuthCode);

  router.get("/limitExceeded", auth.handleLimitExceeded);
  
  app.use('/api/auth', router);
};
