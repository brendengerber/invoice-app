module.exports = (sequelize, DataType) => {
    const User = sequelize.define('user', {
        id: {
         type: DataType.UUID,
         primaryKey: true
        },
        provider: {
         type: DataType.STRING(15)
        },
        remoteId: {
         type: DataType.INTEGER
        },
        photoUrl: {
         type: DataType.STRING(150)
        },
        email: {
         type: DataType.STRING(150)
        }
     },{
        //Automatically converts camel cased fields in sequelize to underscored columns in postgres table
        underscored: true
     });

     User.associate = models => {
      User.hasMany(models.invoice, {
         foreignKey: "userId"
      })
      User.hasMany(models.invoiceItem), {
         foreignKey: "userId"
      }};

     return User
};