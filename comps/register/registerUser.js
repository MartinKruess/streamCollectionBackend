const UserDataModel = require("../../schemas/user-schemas")

const basic = "user"
const premium = "premium"

const userDataToDB = () => {

    const dataOfUser = {
        mail: registerMail, //Required!!!
        username: registerName,
        password: registerPassword,
        groupe: currentGroupe,
      }

    if(UserDataModel(dataOfUser.mail) === null){
        UserDataModel(dataOfUser).save()
    } else{
        console.log("User is registrated!")
    }
}