module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    title: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    oid: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
  });

  Products.associate = (models) => {
    Products.belongsTo(models.Auctions, {
      foreignKey: 'auctionId',
    });
    Products.belongsTo(models.Customers, {
      foreignKey: 'customerId',
    });
    Products.belongsTo(models.CustomerShopAccounts, {
      foreignKey: 'customerShopAccountId',
    });
  };

  return Products;
};
