const ImgDataModel = require("../schemas/img-schemas");
const UserDataModel = require("../schemas/user-schemas");
const bcrypt = require('bcrypt')

const { authenticateToken, createAccessToken } = require("../authServer");

exports.register = async (req, res) => {
    // Password hash
    const saltRounds = 10
    
    try {
        let dataOfUser = {}
        const hashedRegisterPassword = await bcrypt.hash(req.body.password, saltRounds)

        dataOfUser = {
            mail: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: hashedRegisterPassword,
            group: "regularUser",
            movies: 0,
            music: 0,
            images: 0,
            storage: 400000,
        },

        //SAVE: userData to userDB
        UserDataModel(dataOfUser).save()
        res.send('Successfull registrated!')

    } catch (error) {
        console.log("ERROR:", error, "Error by registration!")
    }
};

exports.login = async (req, res) => {
    console.log("Login process started... ")
    //Find: userData in userDB
    const userFromDB = await UserDataModel.findOne({ username: req.body.username })
    console.log("userFromDB", userFromDB)
    try {
        // COMPARE: loginData === userData
        const isLogedIn = await bcrypt.compare(req.body.password, userFromDB.password)
        console.log("IsLogedIn?", isLogedIn)
        if (isLogedIn === false) return

        const userData = {
            userID: userFromDB._id,
            username: userFromDB.username,
            usergroup: userFromDB.group,
        }

        const generateToken = createAccessToken(userData)
        console.log("JWT Token", generateToken)
        // Send Data to Frontend
        res.send({ isLogedIn: isLogedIn, generateToken: generateToken, userData })

    } catch (error) {
        console.log("ERROR:", "Error by Login!", error)
    }
};