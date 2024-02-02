module.exports = (sequelize, Sequelize, DataType) => {
    const InvoiceItem = sequelize.define('invoiceItem', {
        id: {
         type: DataType.UUID,
         primaryKey: true
        },
        invoiceId: {
         type: DataType.UUID,
         validate: {
            allowNull: false
         }
        },
        userId: {
         type: DataType.UUID,
         validate: {
            allowNull: false
         }
        },
        name: {
         type: DataType.STRING(150)
        },
        quantity: {
         type: DataType.INTEGER
        },
        price: {
         type: DataType.DECIMAL(100, 2)
        },
        total: {
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


     InvoiceItem.associate = models => {
      InvoiceItem.belongsTo(models.invoice, {
         foreignKey: "invoiceId"
      })
      InvoiceItem.belongsTo(models.user), {
         foreignKey: "userId"
      }};

     return InvoiceItem
};
