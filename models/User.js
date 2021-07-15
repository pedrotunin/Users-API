const { text } = require('body-parser');
const database = require('../database/config');

const Constants = require('../helpers/Constants');

function buildFields(user) {
    var res = '';
    for (const field in user)
        if (user[field] != undefined) 
            res += `${field} = "${user[field]}",`;
    return res.slice(0, -1);
}
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

    }

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

    }

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

    }

    async findByEmailWithPassword(email) {

        try {
            
            const fields = ['user_id', 'name', 'email', 'password', 'role'];
            const user = await database.select(fields).from(Constants.USER_TABLE).where( { email: email } );

            if (user == undefined || user == null || user.length == 0)
                return undefined;

            return user[0];

        } catch (error) {
            //TODO: handle error
        };

    }

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

    }

    async delete(id) {

        try {
            
            await database.delete().from(Constants.USER_TABLE).where( { user_id: id } );
            return true;

        } catch (error) {

            //TODO: handle error
            return false;
        };

    }

    async update(user) {

        try {

            const { user_id } = user;
            delete user.user_id;
            const query = `UPDATE ${ Constants.USER_TABLE } SET ${ buildFields(user) } WHERE user_id = ${ user_id };`;

            console.log(query);

            await database.raw(query);

            return true;

        } catch (error) {

            //TODO: handle error
            return false;
        }

    }

    async updatePassword(user_id, newPassword) {

    };

    async updateRole(user_id, newRole) {

    };

};

module.exports = new User();