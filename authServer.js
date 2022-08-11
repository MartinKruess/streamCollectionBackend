//require('dotenv').config();
const config = require('./config')
const jwt = require('jsonwebtoken');
const UserDataModel = require('./schemas/user-schemas');
const token = jwt.sign({ foo: 'bar' }, 'shhhhh')

//Testlogin Data
// USERNAME: Martin
// PASSWORD: LoginPW123!

// Auth function
exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authtoken']
    if(token === null) return res.sendStatus(401)

    jwt.verify(token, config.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
      if (err) return res.status(403).send(err)
      const userFromDB = await UserDataModel.findById( decodedUser.userID )
      const userPublic = userFromDB.toObject()
      delete userPublic.password
      userPublic.userID = userPublic._id
      req.user = userPublic
      console.log("reqUser",req.user)
      //req.user = user;

      next()
    })
  }

  // Create Token with userData(DB)
  exports.createAccessToken = (user)=> {
      const accessToken = jwt.sign(user, config.ACCESS_TOKEN_SECRET)
      return accessToken;
    }

  