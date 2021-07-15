class Constants {

    USER_TABLE = 'users';
    PASSWORD_TOKEN_TABLE = 'password_tokens';

    MIN_ROLE = 0;
    MAX_ROLE = 3;

    // In miliseconds
    TOKEN_MAX_AGE = 1000 * 60 * 10;

    // In seconds
    PASSWORD_TOKEN_MAX_AGE = 60 * 10

}

module.exports = new Constants();