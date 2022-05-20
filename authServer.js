require('dotenv').config();
const { application } = require('express');
const express = require('express')
const PORT = 3332;
const authServer = express()
const jwt = require('jsonwebtoken')
const token = jwt.sign({ foo: 'bar' }, 'shhhhh')

// Webserver
authServer.listen(PORT, () => {
    console.log(`Authserver: http://localhost:${PORT}`)
  })

  authServer.use(express.json())
  authServer.post("/auth", authenticateToken, (req, res) => {
      const username = req.body.username
        const user = {
            userID: req.body.userID,
            username: req.body.username,
        }

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      res.json({accessToken: accessToken})

      res.json(posts.filter(post => post.username === req.user.name))
  })

  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authentization']
    const token = authHeader && authHeader.split(" ")[1]
    if(toekn === null) return res.sendStatus(401)

    jwt.verify(token, precess.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }