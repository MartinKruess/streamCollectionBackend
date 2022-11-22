const ImgDataModel = require("../schemas/img-schemas");
const MediaDataModel = require("../schemas/media-schemas");
const cloudinary = require("cloudinary").v2;

exports.getAllMedia = async (req, res) => {
  //const userToken = await JSON.stringify(req.oauthtoken)
  const userID = req.user._id;

  try {
    // Load imgData from DB
    const imagesFromDB = await ImgDataModel.find({ userID: userID });
    const mediaFromDB = await MediaDataModel.find({ userID: userID });

    // Send Data to Frontend
    res.send({ ImagesFromDB: imagesFromDB, mediafromDB: mediaFromDB });
  } catch (error) {}
};

// IMG Upload
exports.imageUpload = async (req, res, next) => {
  const userID = req.user._id;
  try {
    const maxKbStorage = req.user.storage; // 400MB = 400.000 KB
    const imgN = 20; // Max Images 400KB*20 = 8MB
    const vidN = 10; // Max Videos 60MB*10 = 600MB
    const soundN = 20; // Max Sounds 2MB*20 = 400MB

    //Find: all images of user in DB
    const userImages = await ImgDataModel.find({ userID });

    // Variable <- Request
    const imgData = req.body;
    console.log(req.body);

    // Convert "size" in Bytes to size in KB
    const byteSize = imgData.size / 1024;
    const kbSize = Number(byteSize.toFixed(2));

    // size of all Img in DB from User
    const kbSum = userImages.reduce((acc, object) => {
      return acc + object.size;
    }, 0);

    // Check img in DB  + new img is smaller than max storage
    if (
      kbSum + kbSize < maxKbStorage &&
      userImages.length < imgN &&
      userImages.length < vidN &&
      userImages.length < soundN
    ) {
      // Upload Data of IMG to DB - Fail
      const imgRes = await cloudinary.uploader.upload(imgData.view);
      const imgUrl = imgRes.secure_url;
      imgData.view = imgUrl;
      imgData.size = kbSize;
      await ImgDataModel(imgData).save();

      // Load imgData from DB
      const imagesFromDB = await ImgDataModel.find({ userID });

      // Send Data to Frontend
      res.send({ maxStorage: kbSum, ImagesFromDB: imagesFromDB });
    } else {
      const newKbSum = Number(kbSum) + kbSize;
      next(
        `Belegt: ${newKbSum} KB von Max ${maxKbStorage} KB, oder die Maximale Anzahl von ${n} der Bilder ist überschritten!`
      );
    }
  } catch (error) {
    //Error to Frontend
    res.send({
      message: "Das hat leider nicht funktioniert! Dein Speicherplatz ist voll",
      error,
    });
    //console.log("ERROR:", "Error by Img upload!", error)
  }
};

exports.mediaDelete = async (req, res) => {
  const userID = req.user._id;
  const mediaID = req.body._id;
  const mediaType = req.body.type;

  switch (mediaType) {
    case "img":
      await ImgDataModel.deleteOne({ _id: mediaID });
      const images = await ImgDataModel.find(userID);
      res.send(images);
      break;
    case "sound":
      await MediaDataModel.deleteOne({ _id: mediaID });
      const sounds = await MediaDataModel.find(userID);
      res.send(sounds);
      break;
    case "video":
      await MediaDataModel.deleteOne({ _id: mediaID });
      const videos = await MediaDataModel.find(userID);
      res.send(videos);
      break;

    default:
      break;
  }
};
