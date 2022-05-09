const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidTitle = (title) => {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidRequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}

const registerUser = async (req, res) => {
    try{
        const requestBody = req.body
        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
        }

        // Extract params
        const { title, name, phone, email, password, address } = requestBody  //Object destructring

        // Validation starts
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'Title is required' })
            return
        }

        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, message: 'Title should be among Mr, Mrs, Miss' })
            return
        }

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'Name is required' })
            return
        }

        if (!isValid(phone)) {
            res.status(400).send({ status: false, message: 'Phone is required' })
            return
        }

        if (!(/^[6-9]\d{9}$/.test(phone))) {
            res.status(400).send({ status: false, message: 'Phone should be valid mobile number' })
            return
        }

        const isPhoneAlreadyUsed = await userModel.findOne({ phone });  //{phone : phone} object shorthand property

        if (isPhoneAlreadyUsed) {
            res.status(400).send({ status: false, message: `${phone} phone is already registered` })
            return
        }
        
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: 'Email is required' })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: 'Email should be valid email address' })
            return
        }

        const isEmailAlreadyUsed = await userModel.findOne({ email });  //{email : email} object shorthand property

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, message: 'Password is required' })
            return
        }

        if(!(password.length >= 8) || !(password.length <= 15)){
            res.status(400).send({
                status: false, message: "Password should have length in range 8 to 15"
            })
            return
        }

        // Validation ends

        const userData = { title, name, phone, email, password, address }
        const newUser = await userModel.create(userData);

        res.status(201).send({ status: true, message: 'User created successfully', data: newUser });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const loginUser = async (req, res) => {
    try {
        const requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }

        // Extract params
        const { email, password } = requestBody

        // Validate starts
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: 'Email is required' })
            return
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, message: 'Password is required' })
            return
        }
        // Validation ends

        const user = await userModel.findOne({ email, password })

        if (!user) {
            res.status(401).send({ status: false, message: 'Invalid login credentials' });
            return
        }

        const token = await jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) * 10 * 60 * 60
        }, 'Project-3')

        res.status(200).send({ status: true, message: 'Success', data: { token } });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { registerUser, loginUser }