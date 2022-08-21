const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const geoIp = require('geoip-lite')
const momentJSTimeJS = require('moment-timezone')
momentJSTimeJS().tz("Asia/Kolkata").format()
// const momentJSTimeJS = require('moment-timezone')


const userCredSchema = new mongoose.Schema({
    username: {
        type: String, require: true, unique: true
    }, email: {
        type: String, require: true

    }, password: {
        type: String, require: true
    }, role: {
        type: String, default: 'admin', require: false
    }, // userDetails_id: {
    //     type: Schema.Types.ObjectId, ref: 'user_details',
    //     require: false
    // },
    joinDate: {
        type: String
    }, lastUpdateDate: {
        type: String
    }, tokens: [{
        token: {
            type: String, require: true
        }, token_role: {
            type: String, require: true
        }, token_iat: {
            type: Date, default: Date.now(), require: true
        }, token_exp: {
            type: Date, require: true
        }, token_ip: {
            type: String
        }, token_city: {
            type: String
        }, token_country: {
            type: String
        }, token_ll: {
            type: String
        }


    }]

}, {
    collection: 'user_credentials',
})


userCredSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 12)
    }
    next()
})

userCredSchema.methods.generateAuthToken = async function (req) {
    try {

        let current_date = momentJSTimeJS.utc()
        let token                       //This will store token, if active it will come from DB, if not, we will create one
        let exception_no = 5;           //i.e We will not delete last 5 expired tokens for future need
        let deleted_exp_tokens = 0;           //i.e We will not delete last 5 expired tokens for future need
        let current_exception = 0;      //This will count prev exp tokens


        // We will delete all expired tokens (except last 5 expired tokens)
        for (let i = this.tokens.length - 1; i >= 0; i--) {     // loop is reversed so that will not delete last added expired exception tokens
            const obj = this.tokens[i];

            if (momentJSTimeJS(obj.token_exp).diff(current_date) < 0)    //checks if the token is exp at all? if yes Proceed, else return
            {
                if (current_exception <= 5)                                //checks if the exception flag is not = or > 5, if yes we don't want to delete the token, if no delete it
                {
                    current_exception++                                 //increment the exception flag
                } else                                                    // here we know, this token is expired and also exceeds that exception limit we set, so we will delete it!
                {
                    deleted_exp_tokens++;                               // Increment delete to token
                    this.tokens.splice(i, 1);                           // Remove the token object from tokens array
                }
            }

        }


        console.log({current_exp: current_exception})
        console.log({deleted_exp_tokens: deleted_exp_tokens})


        // Now lets check if there is any valid token available in DB
        let valid_token_exists = false;                 // lets assume we dont have valid token
        let valid_token_index = -1;                     // we will store that valid token's index in this if we encounter any
        for (let i = this.tokens.length - 1; i >= 0 && (valid_token_exists === false); i--) {     // we will run the loop until 1: we check all the tokens OR 2: We found at least one valid token
            const obj = this.tokens[i];
            if (momentJSTimeJS(obj.token_exp).diff(current_date) > 0) {       //  check if token is not yet expired
                valid_token_exists = true                                   // change the flag to true since we found one valid token, this will ensure we exit the loop in next run
                valid_token_index = i;                                      // Also lets store the index number for future use
            }
        }

        // if valid token is not available, we will make one ourselves!
        if (!valid_token_exists) {
            const secret_key = process.env.SECRET_KEY
            let payload = {
                client_id : this.tokens
            }



            token = jwt.sign(payload, secret_key)
            let expire_date = current_date.clone()
            // expire_date.utc().add(7, 'd')      //7 days of expiration
            expire_date.utc().add(15, 's')      //15 seconds of expiration for test purpose
            let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "unknown";
            let geo = geoIp.lookup(clientIp)
            let clientCity = geo ? geo.city : "unknown"
            let clientCountry = geo ? geo.country : "unknown"
            let clientll = geo ? geo.ll : "unknown"
            let new_token = {
                token: token,
                token_role: this.role,
                token_iat: current_date,
                token_exp: expire_date,
                token_city: clientCity,
                token_country: clientCountry,
                token_ll: clientll
            };
            this.tokens = this.tokens.concat(new_token)
            await this.save()
            token = new_token
        } else        // if we have token, we will give it to $token with the help of our index number
        {
            token = this.tokens[valid_token_index]
        }
        return token;       // Now return token
    } catch (err) {
        console.log(err)
    }
}


const userCred = mongoose.model('user_credentials', userCredSchema)

module.exports = userCred

