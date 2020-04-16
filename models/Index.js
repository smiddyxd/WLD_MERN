const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('mydb', 'root', 'asdqwe123', {
  host: 'localhost',
  dialect: 'mysql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.playlists = require("./Playlist.js")(sequelize, Sequelize);

module.exports = db;
