exports.handleMissingParams = (req, res, parameterType, itemKeys, entity) => {
  let params = parameterType === 'body' ? req.body : req
  let missingParameters = []
  itemKeys.forEach(itemKey => {
    if (!params[itemKey]) {
      console.log(itemKey + ' missing')
      missingParameters.push(itemKey)
    }
  })
  if (missingParameters.length > 0) {
    res.status(400).send({
      message: `${missingParameters.join(', ')} of ${entity} cannot be empty!`
    })
  }
  return missingParameters.length > 0
}
