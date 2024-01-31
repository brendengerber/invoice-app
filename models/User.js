module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id: {
         type: Sequelize.STRING,
         primaryKey: true
        },
        provider: {
         type: Sequelize.STRING(15)
        },
        remoteId: {
         type: Sequelize.INTEGER
        },
        photoUrl: {
         type: Sequelize.STRING(150)
        },
        email: {
         type: Sequelize.STRING(150)
        }
     },{
        //Automatically converts camel cased fields in sequelize to underscored columns in postgres table
        underscored: true
     });
     
     return User
};