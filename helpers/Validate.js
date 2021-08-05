const validator = require('validator');

const Constants = require('./Constants');

class Error {

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

    #validateName(name, errors) {

        var message = '';

        if (name == undefined) {
            message = 'No name was given!';
            errors.push(new Error("name", message));
            return;
        }

        if (name.length < 3) {
            message = 'The given name is invalid!';
            errors.push(new Error("name", message));
        }

    }

    validateEmail(email, errors) {

        var message = '';
        if (email == undefined) {
            message = 'No e-mail was given!';
            errors.push(new Error("name", message));
            return;
        }
        if (email == undefined || !validator.isEmail(email)) {
            message = 'The given e-mail is invalid!';
            errors.push(new Error("email", message));
        }

    }
    
    validatePassword(password, errors) {
    
        var error = undefined;

        if (password == undefined)
            error = new Error("password", "No password was given!")

        if (password != undefined && password.length < 6)
            error = new Error("password", "Password must be at least 6 characters long.")

        if (error != undefined) 
            errors.push(error);

    }

    #validateRole(role, errors) {
        
        var message = '';

        if (role == undefined) {
            message = 'No role was given!';
            errors.push(new Error("role", message));
            return;
        }

        if (!validator.isInt(String(role))) {
            message = 'The field role must be a number.';
            errors.push(new Error("role", message));
        }

        if (validator.isInt(String(role)) && !this.#validateRoleRange(parseInt(String(role)))) {
            message = 'The given role is not valid.';
            errors.push(new Error("role", message));
        }

    }

    #validateRoleRange(role) {

        if (role < Constants.MIN_ROLE || role > Constants.MAX_ROLE) 
            return false;
        return true;

    }

    validateNewUser(user) {

        const { name, email, password, role } = user;
        var errors = [];

        this.#validateName(name, errors);
        this.validateEmail(email, errors);
        this.validatePassword(password, errors);
        this.#validateRole(role, errors); 

        return errors;

    }

    validateUpdateUser(user) {

        const { name, email } = user;
        var errors = [];

        if (!name) this.validateEmail(email, errors);
        if (!email) this.#validateName(name, errors);
        
        return errors;

    }

    validateLogin(email, password) {

        var errors = [];

        this.validateEmail(email, errors);
        this.validatePassword(password, errors);

        return errors;

    }

};

module.exports = new Validate();