const express = require("express")
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const momentJSTimeJS = require('moment-timezone')
momentJSTimeJS().tz("Asia/Kolkata").format()
const router = express.Router()

const UserCredSchemaObj = require("../model/userCredSchema")


router.get('/', (req, res) => {
    res.send(`Home form auth`);
    res.end();
});


router.get('/users',(req,res) => {
    UserCredSchemaObj.find({},{password : 0, tokens : 0}).sort({'username': 1})
        .then(result => {
            res.status(200).json({credUsers: result})
        })
});

router.get('/users/:email',(req,res) => {
    UserCredSchemaObj.findOne({'email' : `${req.params.email}`}, {password : 0}).then(result => {
            res.status(200).json({credUser: result})
        })
});

router.post('/sign_in', check('email')

    .not()
    .isEmpty()
    .withMessage({
        errorCode: 'LOG1000', field: 'email', msg: 'Email can\'t be empty'
    })
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage({
        errorCode: 'LOG1001', field: 'email', msg: 'Email is not valid'
    })
    .bail()
    .custom((value, {req}) => {
        return new Promise((resolve, reject) => {
            UserCredSchemaObj.findOne({email: req.body.email}, (err, user) => {
                if (err) {
                    reject(new Error({
                        errorCode: 'SER1000QD', msg: `Server Fetch Error`
                    }))
                }
                if (!Boolean(user)) {
                    reject(new Error({
                        msg: "Email already exists in DB"
                    }))
                }
                resolve(true)
            })
        })
    })
    .withMessage({
        errorCode: "LOG1002D", field: "all", msg: "Invalid Credentials"
    }), check('password')
    .not()
    .isEmpty()
    .withMessage({
        errorCode: 'LOG1201', field: 'password', msg: 'Password can\'t be empty'
    }), async (req, res) => {

    const validationErrors = validationResult(req)
    let errors = [];
    if (!validationErrors.isEmpty()) {
        Object.keys(validationErrors.mapped()).forEach(field => {
            errors.push(validationErrors.mapped()[field]['msg']);
        });
    }

    let userLogin

    if (!errors.length) {
        try {
            const {email, password} = req.body
            userLogin = await UserCredSchemaObj.findOne({email: email})
            const isMatch = await bcrypt.compareSync(password, userLogin.password)


            if (!isMatch) {
                errors.push({
                    errorCode: "LOG1000GEN", field: "all", msg: "Invalid Credentials"
                })
            }
        } catch (err) {
            console.log({Response: "Error(s) occurred"}, err)
            res.status(400).send({err})
        }
    }
    if (errors.length) {
        console.log({Response: "Error(s) occurred"}, errors)
        res.status(400).send({errors})
    } else {
        try {
            const token = await userLogin.generateAuthToken(req)
            const toke_key = token.token
            console.log(token)
        } catch (err) {
            console.log(err)
        }
        console.log({LogMsg: "Successfully Signed in", body: req.body})
        res.status(200).send({Response: "Successfully Signed in", body: req.body})
    }
})
router.post('/sign_up', check('role')
        .trim()
        .not()
        .isEmpty()
        .withMessage({
            errorCode: 'REG1200', field: 'role', msg: 'role can\'t be empty'
        })
        .bail()
        .exists({checkFalsy: true})
        .toLowerCase()
        .bail()
        .isIn(['admin', 'client'])
        .withMessage({
            errorCode: 'REG1201', field: 'role', msg: 'roles are in ambiguity'
        }),

    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage({
            errorCode: 'REG1201', field: 'password', msg: 'Password can\'t be empty'
        })
        .bail()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
            pointsPerUnique: 1,
            pointsPerRepeat: 0.5,
            pointsForContainingLower: 10,
            pointsForContainingUpper: 10,
            pointsForContainingNumber: 10,
            pointsForContainingSymbol: 10,
        })
        .withMessage({
            errorCode: 'REG1202',
            field: 'password',
            msg: 'Password must be of min 8 chars, must have a lowercase, uppercase char, must have a numeric value and a special char'
        }),
    check('email')
        .not()
        .isEmpty()
        .withMessage({
            errorCode: 'REG1000', field: 'email', msg: 'Email can\'t be empty'
        })
        .bail()
        .normalizeEmail()
        .isEmail()
        .withMessage({
            errorCode: 'REG1001', field: 'email', msg: 'Email is not valid'
        })
        .bail()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                UserCredSchemaObj.findOne({email: req.body.email}, (err, user) => {
                    if (err) {
                        reject(new Error({
                            errorCode: 'SER1000QD', msg: `Server Fetch Error`
                        }))
                    }
                    if (Boolean(user)) {
                        reject(new Error({
                            msg: "Email already exists in DB"
                        }))
                    }
                    resolve(true)
                })
            })
        })
        .withMessage({
            errorCode: "REG1002D", field: "email", msg: "Email already exists in DB"
        }), check('username')
        .trim()
        .not()
        .isEmpty()
        .withMessage({
            errorCode: 'REG1051', field: 'username', msg: `Username can\'t be empty`
        })
        .bail()
        .matches("^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$")
        .withMessage({
            errorCode: 'REG1052', field: 'username', msg: `username is not in a valid pattern`
        })
        .bail()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                UserCredSchemaObj.findOne({username: req.body.username}, (err, user) => {
                    if (err) {
                        reject(new Error('Server Error'))
                    }
                    if (Boolean(user)) {
                        reject(new Error(`Username : '${req.body.username}', already exists Database`))
                    }
                    resolve(true)
                })
            })
        })
        .withMessage({
            errorCode: "REG1053D", field: "username", msg: "Username already exists in DB"
        }), async (req, res) => {
        let {username, role, password, email} = req.body;

        let currentDate = momentJSTimeJS.utc()
        console.log(currentDate)
        console.log(currentDate.diff(momentJSTimeJS.utc()))
        const validationErrors = validationResult(req)


        let errors = [];
        if (!validationErrors.isEmpty()) {
            Object.keys(validationErrors.mapped()).forEach(field => {
                errors.push(validationErrors.mapped()[field]['msg']);
            });
        }

        if (errors.length) {
            console.log({Response: "Error(s) occurred"}, errors)
            res.status(400).send({errors})
        } else {
            try {
                let joinDate, lastUpdateDate
                joinDate = lastUpdateDate = currentDate
                const userCred = new UserCredSchemaObj({username, email, role, password, joinDate, lastUpdateDate})
                await userCred.save()

                console.log({log_msg: "Data successfully pushed in database", body: userCred})
                res.status(201).send({Response: "Data successfully pushed in database", body: req.body})
            } catch (err) {
                console.log({Response: "Error(s) occurred"}, err)
                res.status(400).send({Response: "Error(s) occurred", msg: errors})
            }
        }
    })
module.exports = router
