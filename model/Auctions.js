module.exports = (sequelize, DataTypes) => {
  const Auctions = sequelize.define('Auctions', {
    auctionId: {
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
      allowNull: false,
      defaultValue: false,
    },
    path: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: false,
    },
  });

  Auctions.associate = (models) => {
    Auctions.belongsTo(models.Customers, {
      foreignKey: 'customerId',
    });
    Auctions.belongsTo(models.CustomerShopAccounts, {
      foreignKey: 'customerShopAccountId',
    });
  };

  return Auctions;
};
