const Express = require('express')
const Cors = require('cors')
const Mongoose = require('mongoose')
const BodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrpt = require('bcrypt')
const userModel = require("./models/users")

let app = Express()
app.use(BodyParser.urlencoded({ extended: true }))
app.use(BodyParser.json())
app.use(Cors())

Mongoose.connect('mongodb+srv://testerh:testerh@cluster0.mksxcra.mongodb.net/BootcampBlogdb?retryWrites=true&w=majority', { useNewUrlParser: true })

app.post("/signin", async (req, res) => {
    var email = req.body.email
    var password = req.body.password

    let result = userModel.find({ email: email }, (err, data) => {

        if (data.length > 0) {
            const passwordValidator = bcrpt.compareSync(password, data[0].password)
            if (passwordValidator) {
                res.json({ "status": "success", "data": data})
            }
            else{
                res.json({ "status": "failed", "data": "invalid password" })
            }
        }
        else {
            res.send({"status": "failed", "data": "invalid email id"})
        }

    })

})

// app.post("/signin", (req, res) => {
//     var email = req.body.email
//     var password = req.body.password

//     let result = userModel.find({ email: email }, (err, data) => {
//         if (data.length > 0) {
//             const passwordValidator = bcrpt.compareSync(password, data[0].password)
//             if (passwordValidator) {
//                 jwt.sign({ email: getEmail, id: data[0]._id }, "ictacademy",
//                     (err, token) => {
//                         if (err) {
//                             res.json({ "status": "error", "err": err})
//                         }
//                         else {
//                             res.json({ "status": "success", "data": data, "token": token })
//                         }
//                     })
//             }
//             else {
//                 res.json({ "status": "failed", "data": "invalid password" })
//             }
//         }
//         else {
//             res.json({ "status": "failed", "data": "invalid email id" })
//         }
//     })
// })

app.post("/signup", async (req, res) => {

    console.log(req.body)
    let data = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: bcrpt.hashSync(req.body.password, 10)
    })
    console.log(data)
    await data.save


    res.json({ "status": "success", "data": data })
})

app.post("/blogpost", (req, res) => {
    res.send("blogpost working")
})

app.listen(3001, () => {
    console.log("App running")
})