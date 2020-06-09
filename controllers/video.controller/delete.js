const db = require('../../models')
const Video = db.videos
const { handleMissingParams } = require('../../utils/validationUtils')


exports.delete = (req, res) => {
  Video.destroy({
    where: { id: req.body.id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Video was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Video with id=${id}. Maybe Playlist was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Playlist with id=" + id
      });
    });
}

exports.deleteAll = (req, res) => {
  Video.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Videos were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all videos."
      });
    });
};
