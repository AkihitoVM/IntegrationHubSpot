module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        vid: {
            type: Sequelize.INTEGER
        },
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        createdate: {
            type: Sequelize.DATE
        }
    });

    return Contact;
};