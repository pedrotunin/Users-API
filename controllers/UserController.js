const Message = require('../helpers/Message');
const User = require('../models/User');

const validator = require('validator');

async function handleFindById(req, res, id) {

    const user = await User.findById(id);
    if (user == undefined) {

        res.status(404);
        res.json(Message.error("User not found!"));
        return;
            
    } 

    res.status(200);
    res.json(Message.success(user, undefined));
    return;
    
}

async function handleFindByEmail(req, res, email) {

    const user = await User.findByEmail(email);
    if (user == undefined) {

        res.status(404);
        res.json(Message.error("User not found!"));
        return;
            
    } 

    res.status(200);
    res.json(Message.success(user, undefined));
    return;

}

class UserController {

    async findAllUsers(req, res, next) {

        const users = await User.findAll();
        if (users == undefined) { // No users in database

            res.status(404);
            res.json(Message.error("There aren't any users in the database."));
            return;

        }

        // Success
        res.status(200);
        res.json(Message.success(users, undefined));

    };

    async findUser(req, res, next) {

        const key = req.params.key;

        if (validator.isInt(key)) { // Number

            await handleFindById(req, res, key);
            
        } else if (validator.isEmail(key)) { // E-mail

            await handleFindByEmail(req, res, key);

        } else { // None

            res.status(400);
            res.json(Message.error("The key is neither a number nor a valid email!"))
            return;

        }

    };

    async deleteUser(req, res, next) {

        const id = req.params.id;

        if (!validator.isInt(id)) { // NaN

            res.status(400);
            res.json(Message.error("The given id is not a number!"));
            return;

        }

        if (await User.findById(id) == undefined) { // Not in database

            res.status(404);
            res.json(Message.error("User not found!"));
            return;

        }

        const result = await User.delete(id);

        if (!result) { // An error during deletion

            res.status(500);
            res.json(Message.error("An internal error has occurred!"));
            return;

        }

        // Success
        res.status(200);
        res.json(Message.success(undefined, "User deleted!"));
        return;

    }
};

module.exports = new UserController();