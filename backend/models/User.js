const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

// Hook to hash password before saving
User.beforeCreate(async (user) => {
    if (user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
});

User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;
