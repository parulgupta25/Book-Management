const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')


const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
};

/**************************************************Create User API**************************************************/
const createUser = async function (req, res) {
    try {

        const data = req.body

        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: 'Please Enter The User Details' })

        if (!isValid(data.title)) return res.status(400).send({ status: false, message: 'Title Is Required' })

        if (["Mr", "Mrs", "Miss" ].indexOf(data.title) == -1) {
            return res.status(400).send({ status: false, data: "Enter a valid Title (e.g- Mr or Mrs or Miss)", });
        }

        if (!isValid(data.name)) return res.status(400).send({ status: false, message: 'Name Is Required' })

        if (!data.name.match(/^[a-zA-Z. ]{2,30}$/)) return res.status(400).send({ status: false, msg: "Please Enter A Valid User Name" })

        if (!isValid(data.phone)) return res.status(400).send({ status: false, message: 'Phone Is Required' })

        if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/).test(data.phone)) {
            return res.status(400).send
                ({ status: false, msg: `${data.phone} is Not a Valid Mobile Number ` })
        }

        const checkPhone = await userModel.findOne({ phone: data.phone });

        if (checkPhone) return res.status(400).send({ status: false, message: `${data.phone} Phone Is Already Registered` })

        if (!isValid(data.email)) return res.status(400).send({ status: false, message: 'Email Is Required' })

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
            return res.status(400).send({ status: false, message: 'Email should be Valid Email Address' })
        }

        const checkEmail = await userModel.findOne({ email: data.email });

        if (checkEmail) return res.status(400).send({ status: false, message: `${data.email} Email Address is Already Registered` })

        if (!isValid(data.password)) return res.status(400).send({ status: false, message: 'Password is Required' })

        if (!(data.password.trim().length >= 8) || !(data.password.trim().length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should have length in range 8 to 15" })
        }

        const newUser = await userModel.create(data);

        res.status(201).send({ status: true, message: 'User created successfully!!!', data: newUser });

     } catch (err) {

      res.status(500).send({ status: false, message: err.message })
    }
}

/**************************************************User Login API**************************************************/


const loginUser = async function (req, res) {
    try {

        let data = req.body

        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: "Please Provide Login Details" })

        if (!isValid(data.email)) return res.status(400).send({ status: false, message: 'Email is Required' })

        if (!isValid(data.password)) return res.status(400).send({ status: false, message: 'Password is Required' })

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
            return res.status(400).send({ status: false, message: 'Email Should Be Valid Email Address' })
        }

        if (!(data.password.trim().length >= 8) || !(data.password.trim().length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should have length in range 8 to 15" })
        }

        const user = await userModel.findOne({ email: data.email, password: data.password })

        if (!user) return res.status(401).send({ status: false, message: 'Invalid Login Credentials' });

        const token = await jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000)*24*60*60,
        }, 'NONOINWW2Q9NAQO2OQ0#jn$@ono@')

        res.status(200).send({ status: true, message: "Login Sucsessful", data: token });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { createUser, loginUser }
