const ImgDataModel = require("../schemas/img-schemas");
const UserDataModel = require("../schemas/user-schemas");
const bcrypt = require('bcrypt')

const { authenticateToken, createAccessToken } = require("../authServer");

exports.register = async (req, res) => {
    try {
        let dataOfUser = {}
        const hashedRegisterPassword = await bcrypt.hash(req.body.password, saltRounds)
        console.log("HashedPW ", hashedRegisterPassword)

        dataOfUser = {
            mail: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: hashedRegisterPassword,
            group: userGroups[0],
            movies: 0,
            music: 0,
            images: 0,
            storage: 400000,
        },
            console.log("Data of User, DB get ->", dataOfUser)

        //SAVE: userData to userDB
        UserDataModel(dataOfUser).save()
        res.send('Successfull registrated!')

    } catch (error) {
        console.log("ERROR:", error, "Error by registration!")
    }
};

// USERNAME: Martin
// PASSWORD: LoginPW123!

exports.login = async (req, res) => {
    console.log("Hi")
    //Find: userData in userDB
    const userFromDB = await UserDataModel.findOne({ username: req.body.username })
    try {
        // COMPARE: loginData === userData
        const isLogedIn = await bcrypt.compare(req.body.password, userFromDB.password)
        if (isLoginIn === false) return
        console.log("HashedPW ", isLogedIn)

        const userData = {
            userID: userFromDB._id,
            username: userFromDB.username,
            usergroup: userFromDB.group,
        }
        console.log(userData)

        const generateToken = createAccessToken(userData)

        // Send Data to Frontend
        res.send({ isLogedIn: isLogedIn, generateToken: generateToken, userData })

    } catch (error) {
        console.log("ERROR:", "Error by Login!", error)
    }
};