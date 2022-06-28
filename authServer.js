require('dotenv').config();
const jwt = require('jsonwebtoken')
const token = jwt.sign({ foo: 'bar' }, 'shhhhh')

//Testlogin Data
// USERNAME: Martin
// PASSWORD: LoginPW123!

// Auth function
// "isAuth"
exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authtoken']
    if(token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send(err)
      req.user = user;
      next()
    })
  }

  // Create Token with userData(DB)
  exports.createAccessToken = (user)=> {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      return accessToken;
    }

  