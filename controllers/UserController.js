require('dotenv').config();

const Message = require('../helpers/Message');
const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const Validate = require('../helpers/Validate');
const Constants = require('../helpers/Constants');

const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const secret = process.env.JWT_SECRET;

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

        const id = req.params.id;

        if (validator.isInt(id)) { // Number

            await handleFindById(req, res, id);

        } else { // None

            res.status(400);
            res.json(Message.error("The key is not a number!"))
            return;

        }

    };

    async createUser(req, res, next) {

        const { name, email, password } = req.body;

        const role = Constants.STANDARD_ROLE;

        req.body.role = role;

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

    async login(req, res, next) {

        const { email, password } = req.body;

        const errors = await Validate.validateLogin(email, password);

        if (errors.length > 0) {
            res.status(400);
            res.json(Message.error("Some errors occurred!", errors));
            return;
        }

        const user = await User.findByEmailWithPassword(email);

        if (user == undefined) {
            res.status(406);
            res.json(Message.error("E-mail or password incorrect!"));
            return;
        }

        const comparePasswords = await bcrypt.compare(password, user.password);

        if (!comparePasswords) {
            res.status(406);
            res.json(Message.error("E-mail or password incorrect!"));
            return;
        }

        const token = jwt.sign({
            id: user.user_id, 
            email: user.email, 
            role: user.role 
        }, secret, { expiresIn: `${ Constants.TOKEN_MAX_AGE }ms` });

        res.status(200);
        res.json(Message.success({ token: token }, "Successfully logged!"));

    }

    async recoverPassword(req, res, next) {

        const { email } = req.body;
        var errors = [];

        if (User.findByEmail(email) == undefined) {
            res.status(400);
            res.json(Message.error("The e-mais does not exists in our database!"));
            return;
        }

        Validate.validateEmail(email, errors);
        if (errors.length > 0) {
            res.status(400);
            res.json(Message.error("Some errors occurred!", errors));
            return;
        }

        const token = await PasswordToken.create(email);

        if (token == undefined) {
            res.status(500);
            res.json(Message.error("An internal error occurred!"));
            return;
        }

        res.status(200);
        res.json(Message.success({ recovery_token: token }, `Recovery token created! It expires in ${Constants.PASSWORD_TOKEN_MAX_AGE / 60} minutes.`))

    }

    async changePassword(req, res, next) {

        const { token, password } = req.body;
        var errors = [];

        Validate.validatePassword(password, errors);
        if (errors.length > 0) {
            res.status(400);
            res.json(Message.error("Some errors occurred!", errors));
            return;
        }

        const validToken = await PasswordToken.validate(token);

        if (validToken == undefined) {
            res.status(404);
            res.json(Message.error("Invalid token!"));
            return;
        }

        const user = await User.findById(validToken.user_id);
        const hash = bcrypt.hashSync(password, salt);
        const result = await User.updatePassword(user.user_id, hash);

        if (!result) {
            res.status(500);
            res.json(Message.error("An internal error occurred!"));
            return;
        }

        await PasswordToken.setUsed(token);

        res.status(200);
        res.json(Message.success("Password updated successfully!"));

    }

};

module.exports = new UserController();