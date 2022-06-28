const ImgDataModel = require("../schemas/img-schemas");
const UserDataModel = require("../schemas/user-schemas");

exports.getAllImages = async (req, res) => {

    //const userToken = await JSON.stringify(req.oauthtoken)
    const userID = req.user.userID
    
    try {
    // Load imgData from DB
    const imagesFromDB = await ImgDataModel.find({ userID: userID })

    // Send Data to Frontend
    res.send({ ImagesFromDB: imagesFromDB })
    } catch (error) {
        
    }
 };

// IMG Upload
exports.imageUpload = async (req, res) => {
    try {

        //Find: storageSetting in user at DB
        const userFromDB = await UserDataModel.findOne({ userID: req.body.userID })
        const maxStorage = userFromDB.storage

        //Find: all images of user in DB
        const userImages = await ImgDataModel.find({ userID: req.body.userID })

        // Variable <- Request
        const imgData = await req.body

        // Convert "size" in Bytes to size in KB
        const rawSize = imgData.size / 1024
        const newImgSize = Number(rawSize.toFixed(2))

        // size of all Img in DB from User
        const sum = userImages.reduce((acc, object) => {
            return acc + object.size
        }, 0)

        // Check img in DB  + new img is smaller than max storage
        if (sum + newImgSize < maxStorage) {
            const newNumber = Number(sum / 1024) + newImgSize

            // Upload Data of IMG to DB - Fail
            ImgDataModel(imgData).save()

            // Load imgData from DB
            const imagesFromDB = await ImgDataModel.find({ userID: req.body.userID })

            // Send Data to Frontend
            res.send({ maxStorage: sum, ImagesFromDB: imagesFromDB })

        } else {
            const newNumber = Number(sum) + newImgSize
            console.log(`Belegt: ${newNumber / 1024} MB Max ${maxStorage} MB`)
            res.send("Upload Failed!")
        }
    }
    catch (error) {
        console.log("ERROR:", "Error by Img upload!", error)
    }
}