class Message {

    error(message, errors = undefined) {

        const obj = {
            status: 'Error',
            message: message,
            errors: errors
        };

        return obj;

    }

    success(data, message) {

        const obj = {
            status: 'OK',
            message: message,
            data: data
        }

        return obj;

    }

};

module.exports = new Message();