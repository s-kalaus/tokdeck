module.exports = (sequelize, DataTypes) => {
  const Auctions = sequelize.define('Auctions', {
    auctionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  });

  Auctions.associate = (models) => {
    Auctions.belongsTo(models.Customers, {
      foreignKey: 'customerId',
    });
  };

  return Auctions;
};
