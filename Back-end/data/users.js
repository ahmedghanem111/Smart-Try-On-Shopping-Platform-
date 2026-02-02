const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'kareem',
        email: 'kareem@admin.com',
        password: '123',
        isAdmin: false,
    },
    {
        name: 'ahmed',
        email: 'ahmed@user.com',
        password: '123',
        isAdmin: true,
    },
];

module.exports = users;