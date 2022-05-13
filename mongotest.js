// const mongoose = require("mongoose")

// // 1. Connection
// mongoose.connect("mongodb://localhost/animals")
// .then(() => {
//   console.log("DB connection established!")
// })
// .catch((err) => {
//   console.log("DB connection failed!", err.message)
// })

// // 2. Schema => rules for an ITEM
// const { Schema, model } = mongoose

// // STUDENT schema (= student rules)
// const studentSchema = new Schema({
//   name: { type: String, required: true }, // optional !
//   age: Number
//   // name: String, // optional !
//   // age: Number
// })

// // 3. Model => create MANAGER to manage items in DATABASE
// // Model wlll take over all communication with database for this ITEM type

// const Student = model("Student", studentSchema) // converts "Student" => students

// const addStudent = async () => {
//   const studentCreated = await Student.create({
//     name: "Gael"
//   })
//   console.log( studentCreated )
// }

// addStudent()