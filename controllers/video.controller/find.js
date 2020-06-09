const db = require('../../models')
const Video = db.videos
const { handleMissingParams } = require('../../utils/validationUtils')


exports.findOne = (req, res) => {
  const id = req.params.id;

  Video.findById(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Video with id=" + id
      });
    });
};

exports.findAll = (req, res) => {
  Video.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving videos."
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
