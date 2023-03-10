const mongodb = require("mongodb");
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();
const mongoClient = mongodb.MongoClient;
const MONGO_URL = process.env.MONGO_URL;

const register = async (req, res) => {
    try {

       
        let client = await mongoClient.connect(MONGO_URL);
      
        let db = client.db("FPadmin");
       
        let user = await db.collection('users').find({ email: req.body.email }).toArray();
        console.log(user);
        if (user.length <= 0) {
           
            const salt = bcrypt.genSaltSync(10);
            const hashedpassword = bcrypt.hashSync(req.body.password, salt);

            let data = await db.collection('users').insertOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashedpassword
            });
            await client.close();
            res.json({
                message: "User registered",
                userexists: false
            })
        } else {
            res.json({
                message: "User already exists!",
                userexists: true
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

module.exports = register