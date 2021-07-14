class Message {

    error(message) {

        const obj = {
            status: 'Error',
            message: message
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