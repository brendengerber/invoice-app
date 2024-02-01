module.exports = (sequelize, DataType) => {
    const Invoice = sequelize.define('invoice', {
        id: {
         type: DataType.UUID,
         primaryKey: true
        },
        userId: {
         type: DataType.UUID,
         validate: {
            allowNull: false
         }
        },
        status: {
         type: DataType.STRING(15)
        },
        invoiceNumber: {
         type: DataType.INTEGER
        },
        billFromStreetAddress: {
         type: DataType.STRING(150)
        },
        billFromCity: {
         type: DataType.STRING(150)
        },
        billFromPostalCode: {
         type: DataType.INTEGER
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
        billToPostalCode: {
         type: DataType.INTEGER
        },
        billToCountry: {
         type: DataType.STRING(150)
        },
        date: {
         type: DataType.DATE
        },
        paymentTerms: {
         type: DataType.STRING(15000)
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
        UpdatedAt: {
         type: DataType.DATE
        }
     },{
        //Automatically converts camel cased fields in sequelize to underscored columns in postgres table
        underscored: true
     });

     Invoice.associate = models => {
      Invoice.hasMany(models.invoiceItem), {
         foreignKey: "invoiceId"
      }
      
      Invoice.belongsTo(models.user, {
         foreignKey: "userId"
      })
     };

     return Invoice
};
