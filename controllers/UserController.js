require('dotenv').config();

const Message = require('../helpers/Message');
const User = require('../models/User');
const Validate = require('../helpers/Validate');

const validator = require('validator');
const bcrypt = require('bcryptjs');

const salt = parseInt(process.env.SALT_ROUNDS);

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

    async createUser(req, res, next) {

        const { name, email, password, role } = req.body;

        if (email != undefined && await User.findByEmail(email)) {
            res.status(409);
            res.json(Message.error("The e-mail already exists in our database!"));
            return;
        }

        const errors = Validate.validateNewUser(req.body);

        if (errors.length > 0) {
            res.status(400);
            res.json(Message.error("Some errors occurred!", errors));
            return;
        } 

        const hash = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hash,
            role
        };

        const newUser = await User.create(user);

        if (newUser == undefined) {
            res.status(500);
            res.json(Message.error("An internal error occurred!"));
            return;
        }

        const data = {
            user: {
                id: newUser[0]
            }
        };

        res.status(201);
        res.json(Message.success(data, "User created!"))
        return;

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

    async updateUser(req, res, next) {

        const id = req.params.id;

        const { name, email, password, role } = req.body;

        if (email != undefined) {
            const foundUser = await User.findByEmail(email);
            
            if (foundUser != undefined && foundUser.user_id != id) {
                res.status(409);
                res.json(Message.error("The e-mail already exists in our database!"));
                return;
            }
        }

        if (password != undefined || role != undefined) {
            res.status(403);
            res.json(Message.error("You cannot update password or role here!"));
            return;
        }

        const errors = Validate.validateUpdateUser(req.body);

        if (errors.length > 0) {
            res.status(400);
            res.json(Message.error("Some errors occurred!", errors));
            return;
        }

        const user = {
            user_id: id,
            name, 
            email
        };

        const result = await User.update(user);

        if (!result) {
            res.status(500);
            res.json(Message.error("An internal error occurred!"));
            return;
        }

        res.status(200);
        res.json(Message.success(undefined, "User updated"));

    }
};

module.exports = new UserController();