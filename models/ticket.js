module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define("ticket", {
        objectId: {
            type: DataTypes.INTEGER
        },
        value: {
            type: DataTypes.STRING
        },
        timestamp: {
            type: DataTypes.DATE
        },
        source: {
            type: DataTypes.STRING
        },
        sourceId: {
            type: DataTypes.STRING
        },
        updatedByUserId: {
            type: DataTypes.INTEGER
        }
    });
    return Ticket

}