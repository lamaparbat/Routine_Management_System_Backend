const { StatusCodes } = require("http-status-codes");

const DEFAULT_ROUTES = (req, res) => {
 console.log(StatusCodes.OK)
 return res.send('Server has started...')
}

module.exports = DEFAULT_ROUTES;