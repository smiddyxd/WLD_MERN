const db = require('../../models')
const Video = db.videos
const Op = db.Sequelize.Op
const fs = require('fs')

const create = require('./create')
const find = require('./find')
const del = require('./delete')
const update = require('./update')

module.exports = {
  ...create,
  ...find,
  ...del,
  ...update
}
