const database = require('../database/config');

const Constants = require('./Constants');

class User {

    async findAll() {

        try {
            
            const fields = ['user_id', 'name', 'email', 'role'];
            const users = await database.select(fields).from(Constants.USER_TABLE);

            if(users == undefined || users == null || users.length == 0)
                return undefined;

            return users;

        } catch (error) {
            //TODO: handle error
        };

    };

    async findById(id) {

        try {
            
            const fields = ['user_id', 'name', 'email', 'role'];
            const user = await database.select(fields).from(Constants.USER_TABLE).where( { user_id: id } );

            if (user == undefined || user == null || user.length == 0)
                return undefined;

            return user[0];

        } catch (error) {
            //TODO: handle error
        };

    };

    async findByEmail(email) {

        try {
            
            const fields = ['user_id', 'name', 'email', 'role'];
            const user = await database.select(fields).from(Constants.USER_TABLE).where( { email: email } );

            if (user == undefined || user == null || user.length == 0)
                return undefined;

            return user[0];

        } catch (error) {
            //TODO: handle error
        };

    };

    async create(user) {

        try {

            const { name, email, password, role } = user;
            
            const newUser = await database.insert({
                name: name,
                email: email,
                password: password,
                role: role
            }).into(Constants.USER_TABLE);

            return newUser;

        } catch (error) {
            //TODO: handle error
            return undefined;
        }

    };

    async delete(id) {

        try {
            
            await database.delete().from(Constants.USER_TABLE).where( { user_id: id } );
            return true;

        } catch (error) {

            //TODO: handle error
            return false;
        };

    }

};

module.exports = new User();