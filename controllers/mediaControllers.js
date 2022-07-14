const ImgDataModel = require("../schemas/img-schemas");
const UserDataModel = require("../schemas/user-schemas");

exports.getAllImages = async (req, res) => {

    //const userToken = await JSON.stringify(req.oauthtoken)
    const userID = req.user._id
    
    try {
    // Load imgData from DB
    const imagesFromDB = await ImgDataModel.find({ userID: userID })

    // Send Data to Frontend
    res.send({ ImagesFromDB: imagesFromDB })
    } catch (error) {
    }
 };

// IMG Upload
exports.imageUpload = async (req, res, next) => {
    const userID = req.user._id
    try {

        const maxStorage = req.user.storage

        //Find: all images of user in DB
        const userImages = await ImgDataModel.find({ userID })

        // Variable <- Request
        const imgData = req.body
        console.log(imgData)

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
            const imagesFromDB = await ImgDataModel.find({ userID })

            // Send Data to Frontend
            res.send({ maxStorage: sum, ImagesFromDB: imagesFromDB })

        } else {
            const newNumber = Number(sum) + newImgSize
            console.log(sum, newImgSize, maxStorage)
            next(`Belegt: ${newNumber / 1024} MB Max ${maxStorage} MB`)
        }
    }
    catch (error) {
        console.log("ERROR:", "Error by Img upload!", error)
    }
}

exports.mediaDelete = async (req, res) => {
    console.log(req.body)
    const userID = req.user._id
    const mediaID = req.body._id
    const mediaType = req.body.type

    switch (mediaType) {
        case "img":
            await ImgDataModel.deleteOne({_id: mediaID})
            const images = await ImgDataModel.find( userID )
            res.send(images)
            break;
        case "sound":
            
            break;
        case "video":
            
            break;
    
        default:
            break;
    }

    

    
}