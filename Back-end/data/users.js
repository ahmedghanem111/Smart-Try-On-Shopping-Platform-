const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'kareem',
        email: 'kareem@admin.com',
        password: 'password123',
        isAdmin: false,
    },
    {
        name: 'ahmed',
        email: 'ahmed@user.com',
        password: 'password123123',
        isAdmin: true,
    },
];

module.exports = users;