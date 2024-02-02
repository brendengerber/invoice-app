
module.exports = (sequelize, Sequelize, DataType) => {
    const User = sequelize.define('user', {
        id: {
         type: DataType.UUID,
         primaryKey: true,
         //Needed to allow postgres database to auto assign uuid
         defaultValue: Sequelize.literal( 'uuid_generate_v4()' )
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