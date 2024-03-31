module.exports = (sequelize, Sequelize, DataType) => {
    const Invoice = sequelize.define('invoice', {
        id: {
         type: DataType.UUID,
         primaryKey: true,
         //Needed to allow postgres database to auto assign uuid
         defaultValue: Sequelize.literal( 'uuid_generate_v4()' )
        },
        userId: {
         type: DataType.UUID,
        },
        status: {
         type: DataType.STRING(15)
        },
        invoiceNumber: {
         type: DataType.STRING(150)
        },
        billFromStreetAddress: {
         type: DataType.STRING(150)
        },
        billFromCity: {
         type: DataType.STRING(150)
        },
        billFromState: {
         type: DataType.STRING(150)
        },
        billFromPostalCode: {
         type: DataType.STRING(15)
        },
        billFromCountry: {
         type: DataType.STRING(150)
        },
        billToName: {
         type: DataType.STRING(150)
        },
        billToEmail: {
         type: DataType.STRING(150)
        },
        billToStreetAddress: {
         type: DataType.STRING(150)
        },
        billToCity: {
         type: DataType.STRING(150)
        },
        billToState: {
         type: DataType.STRING(150)
        },
        billToPostalCode: {
         type: DataType.STRING(15)
        },
        billToCountry: {
         type: DataType.STRING(150)
        },
        date: {
         type: DataType.DATE
        },
        paymentTerms: {
         type: DataType.INTEGER
        },
        projectDescription: {
         type: DataType.STRING(15000)
        },
        amountDue: {
         type: DataType.DECIMAL(100, 2)
        },
        createdAt: {
         type: DataType.DATE
        },
        updatedAt: {
         type: DataType.DATE
        }
     },{
        //Automatically converts camel cased fields in sequelize to underscored columns in postgres table
        underscored: true
     });

     Invoice.associate = models => {
      Invoice.hasMany(models.invoiceItem), {
         foreignKey: "invoiceId",
         onDelete: 'cascade'
      }
      
      Invoice.belongsTo(models.user, {
         foreignKey: "userId"
      })
     };

     return Invoice
};
