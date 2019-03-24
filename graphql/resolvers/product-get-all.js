const productGetAll = async (_, __, { dataSources }) => dataSources.productDS.getAll();

module.exports = productGetAll;
