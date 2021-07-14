const validator = require('validator');

const Constants = require('../models/Constants');

class Error {

    message = "";

    constructor(message) {
        this.message = message;
    };

    getMessage() {
        return this.message;
    };

}

class Validate {

    validatePassword(password) {
    
        if (password == undefined || password.length == 0) {
            return new Error("No password was given.")
        }

        if (password.length < 6) {
            return new Error("Passwords must be at least 6 characters long.")
        }

    };

    validateRoleRange(role) {
        if (role < Constants.MIN_ROLE || role > Constants.MAX_ROLE) 
            return false;
        return true;
    };

    validateNewUser(user) {
        const { name, email, password, role } = user;
        var errors = [];
        var message = ''; 

        if (name == undefined || name.length < 3) {
            message = 'The given name is invalid!'
            errors.push(new Error(message));
        }

        if (!validator.isEmail(email)) {
            message = 'The given e-mail is invalid!';
            errors.push(new Error(message));
        }

        const validatePassword = this.validatePassword(password);

        if (validatePassword != undefined) {
            errors.push(new Error(validatePassword.getMessage()));
        }

        if (!validator.isInt(String(role))) {
            message = 'The field role must be a number.';
            errors.push(new Error(message));
        }

        if (validator.isInt(String(role)) && !this.validateRoleRange(parseInt(String(role)))) {
            message = 'The given role is not valid.';
            errors.push(new Error(message));
        }

        return errors;
    }

};

module.exports = new Validate();