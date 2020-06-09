const fs = require('fs')


// currently unused since json files can be required
exports.readFilePromise = (path) => {
  let done = new Promise((res, rej) => {
    fs.readfile(path, (err, data) => {
      if (err) {
        rej(err)
      }
      res(data)
    })
  })
  return done
}
