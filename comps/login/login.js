const { userInfo } = require("os")
const express = require('express')
const server = express
const UserDataModel = require('../../schemas/user-schemas') 
const bcrypt = require('bcrypt')
const saltRounds = 10
let examplePassword = "hase"
let login = {}



const LoginController = async () => {
    //server.get('./login', (req, res) => {
        try {
        // GET Data
            // Get Mail
            const userMail = "martinkr90@googlemail.com" //req.mail
            // Get Password

            // Hash Password
            bcrypt.hash(examplePassword, saltRounds)
                .then( hash => {
                    login = {
                        mail: userMail,
                        password: hash,
                }
            })
        // VALID Data
            const loginUserData = await UserDataModel.findOne({ mail: "martinkr90@googlemail.com" })
            console.log("Zeile 30")
            console.log("Zeile 31")
                console.log("userFromDB:", loginUserData)
                console.log("userID Raw:", loginUserData._id)
                console.log("userID Raw:", loginUserData._id.id)
                console.log("userID umgewandelt:", loginUserData._id.id.join(""))
            //Controller
            if(loginUserData.mail === login.mail && loginUserData.password === login.password){
                console.log("Zeile 34")
                console.log("userFromDB:", loginUserData._id)
                console.log("userID Raw:", loginUserData._id.id)
            }else {
                console.log("Zeile 38")
                console.log(login.mail, login.password)
                console.log("DB Password is hased?", loginUserData.password)
            }
            console.log("Zeile 42")
            // Generate Token

        // SEND Data
            // Send Token

        } catch (error) {
            
        }
    }
//)}

module.exports = LoginController()