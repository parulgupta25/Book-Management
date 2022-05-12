const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')



/**************************************************Create User API**************************************************/
const createUser = async function (req, res) {
    try {

        const data = req.body

        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: 'please enter the user details' })

        if (!data.title) return res.status(400).send({ status: false, message: 'Title is required' })

        if (["Mr", "Mrs", "Miss"].indexOf(data.title) == -1) {
            return res.status(400).send({ status: false, data: "Enter a valid title Mr or Mrs or Miss ", });
        }

        if (!data.name) return res.status(400).send({ status: false, message: 'Name is required' })

        if (!data.name.match(/^[a-zA-Z. ]{2,30}$/)) return res.status(400).send({ status: false, msg: "Please Enter A valid Intern Name" })

        if (!data.phone) return res.status(400).send({ status: false, message: 'Phone is required' })

        if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/).test(data.phone)) {
            return res.status(400).send
                ({ status: false, msg: `${data.phone} is not a valid mobile number, Please provide a valid mobile number` })
        }

        const checkPhone = await userModel.findOne({ phone: data.phone });

        if (checkPhone) return res.status(400).send({ status: false, message: `${data.phone} phone is already registered` })

        if (!data.email) return res.status(400).send({ status: false, message: 'Email is required' })

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
            return res.status(400).send({ status: false, message: 'Email should be valid email address' })
        }

        const checkEmail = await userModel.findOne({ email: data.email });

        if (checkEmail) return res.status(400).send({ status: false, message: `${data.email} email address is already registered` })

        if (!data.password) return res.status(400).send({ status: false, message: 'Password is required' })

        if (!(data.password.length >= 8) || !(data.password.length <= 15)) {
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

        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: "Please provide login details" })

        if (!data.email) return res.status(400).send({ status: false, message: 'Email is required' })

        if (!data.password) return res.status(400).send({ status: false, message: 'Password is required' })

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
            return res.status(400).send({ status: false, message: 'Email should be valid email address' })
        }

        if (!(data.password.length >= 8) || !(data.password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should have length in range 8 to 15" })
        }

        const user = await userModel.findOne({ email: data.email, password: data.password })

        if (!user) return res.status(401).send({ status: false, message: 'Invalid login credentials' });

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