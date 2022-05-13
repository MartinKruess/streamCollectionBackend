const express = require('express')
const server = express
const bcrypt = require('bcrypt')
const saltRounds = 10
let examplePassword = "hase"
let dataOfUser = {}

const registerFetch = () => {
    try {
        server.get('./register', (req, res) => {
            bcrypt.hash(req.registerPassword, saltRounds)
                .then(() => {
                    // if(req.registerMail === dataOfUser.mail && req.registerName){

                    // }
                    
                    const hash = () => {
                        console.log("Hash", hash)
                        const hashedRegisterPassword = hash
                    }
                })
        
                // Fetch to registerData
                // .then(
                //     dataOfUser = {
                //         mail: req.registerMail, 
                //         username: req.registerName,
                //         password: hashedRegisterPassword,
                //         group: "user"
                //     }
                // ) 
        
                .then (
                    res.send('Hello World')
                )
            })
    } catch (error) {
        console.log("ERROR:", error, "Error by registration!")
    }
}

module.exports = registerFetch()