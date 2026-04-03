const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'kareem',
        email: 'kareem@user.com',
        password: '123456',
        isAdmin: false,
    },
    {
        name: 'ahmed',
        email: 'ahmed@user.com',
        password: '123456',
        isAdmin: false,
    },
];

module.exports = users;