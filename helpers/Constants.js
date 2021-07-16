class Constants {

    constructor() {

        this.USER_TABLE = 'users';
        this.PASSWORD_TOKEN_TABLE = 'password_tokens';

        this.MIN_ROLE = 0;
        this.MAX_ROLE = 3;

        this.ADMIN_ROLE = 0;
        this.STANDARD_ROLE = 1;

        // In miliseconds
        this.TOKEN_MAX_AGE = 1000 * 60 * 10;

        // In seconds
        this.PASSWORD_TOKEN_MAX_AGE = 60 * 10;

    }

}

module.exports = new Constants();