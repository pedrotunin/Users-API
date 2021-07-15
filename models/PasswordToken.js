const User = require('./User');
const Constants = require('../helpers/Constants');

const database = require('../database/config');
const { v4: uuidv4 } = require('uuid');

class PasswordToken {

    async create(email) {

        try {

            const user = await User.findByEmail(email);

            const token = uuidv4().toString();
            const timestamp = new Date().getTime();

            await database.insert({
                user_id: user.user_id,
                token: token,
                used: false,
                max_age: new Date(timestamp + Constants.PASSWORD_TOKEN_MAX_AGE * 1000)
            }).into(Constants.PASSWORD_TOKEN_TABLE);

            return token;

        } catch (error) {

            //TODO: handle error
            return undefined;

        }

    }

    async validate(token) {

        try {

            const query = `SELECT user_id, token FROM ${Constants.PASSWORD_TOKEN_TABLE} WHERE token = "${token}" AND used = 0 AND max_age > CURRENT_TIMESTAMP;`;
            const result = await database.raw(query);

            if (result[0].length > 0) return result[0][0];
            return undefined;
            
        } catch (error) {
            
            //TODO: handle error

            return undefined;
        
        }

    }

    async setUsed(token) {

        try {

            await database.update({ used: true }).where({
                token: token
            }).from(Constants.PASSWORD_TOKEN_TABLE);

            return true;
            
        } catch (error) {

            //TODO: handle error
            return false;

        }

    }

}

module.exports = new PasswordToken();