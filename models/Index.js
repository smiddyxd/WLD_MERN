const Sequelize = require('sequelize');


// Option 1: Passing parameters separately
const sequelize = new Sequelize('mydb', 'root', 'asdqwe123', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '+02:00',
  dialectOptions: {
    useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: true
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.playlists = require("./Playlists.js")(sequelize, Sequelize);
db.videos = require("./Videos.js")(sequelize, Sequelize);
db.playlistItems = require("./PlaylistItems.js")(sequelize, Sequelize);
db.videoSnapshots = require("./VideoSnapshots.js")(sequelize, Sequelize);


db.videos.belongsToMany(db.playlists, { through: 'PlaylistItems' })
db.playlists.belongsToMany(db.videos, { through: 'PlaylistItems' })

db.videos.hasMany(db.videoSnapshots);
db.videoSnapshots.belongsTo(db.videos);

module.exports = db;
