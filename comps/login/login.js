const { userInfo } = require("os")
const express = require('express')
const server = express
const UserDataModel = require('../../schemas/user-schemas')
const bcrypt = require('bcrypt')
const saltRounds = 10
let examplePassword = "hase"
let login = {}


const LoginController = async () => {
        try {
            const userMail = "martinkr90@googlemail.com" //req.mail

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
                console.log("userFromDB:", loginUserData)
                console.log("userID Raw:", loginUserData._id)
                
            //Controller
            if(loginUserData.mail === login.mail && loginUserData.password === login.password){
                console.log("userFromDB:", loginUserData._id)
                loadUserData
            }else {
                console.log(login.mail, login.password)
                console.log("DB Password is hashed?", loginUserData.password)
            }
            // Generate Token

        // SEND Data
            // Send Token

        } catch (error) {
            
        }
    }
//)}

module.exports = LoginController()