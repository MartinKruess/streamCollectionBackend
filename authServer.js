require('dotenv').config();
const jwt = require('jsonwebtoken')
const token = jwt.sign({ foo: 'bar' }, 'shhhhh')

//Testlogin Data
// USERNAME: Martin
// PASSWORD: LoginPW123!

// Auth function
// "isAuth"
   const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(token === null) return res.sendStatus(401)

    jwt.verify(token, precess.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      res.user = user;
      next()
    })
    
  }

  // Create Token with userData(DB)
   const createAccessToken = (user)=> {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      return accessToken;
    }

  