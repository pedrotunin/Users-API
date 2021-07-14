const validator = require('validator');

const Constants = require('../models/Constants');

class Error {

    field = "";
    message = "";

    constructor(field, message) {
        this.field = field;
        this.message = message;
    };

    getMessage() {
        return this.message;
    };

    getField() {
        return this.field;
    };

}

class Validate {

    validatePassword(password) {
    
        if (password == undefined || password.length == 0) {
            return new Error("password", "No password was given.")
        }

        if (password.length < 6) {
            return new Error("password", "Passwords must be at least 6 characters long.")
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
            errors.push(new Error("name", message));
        }

        if (!validator.isEmail(email)) {
            message = 'The given e-mail is invalid!';
            errors.push(new Error("email", message));
        }

        const validatePassword = this.validatePassword(password);

        if (validatePassword != undefined) {
            errors.push(new Error(validatePassword.getField(), validatePassword.getMessage()));
        }

        if (!validator.isInt(String(role))) {
            message = 'The field role must be a number.';
            errors.push(new Error("role", message));
        }

        if (validator.isInt(String(role)) && !this.validateRoleRange(parseInt(String(role)))) {
            message = 'The given role is not valid.';
            errors.push(new Error("role", message));
        }

        return errors;
    }

};

module.exports = new Validate();