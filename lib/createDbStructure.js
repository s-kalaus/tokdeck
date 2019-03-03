module.exports = async function createDbStructure() {
  const [tables] = await this.sequelize.query(`SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = "${this.config.get('db.database')}"`);
  tables.forEach(async table => this.sequelize.query(`DROP TABLE IF EXISTS ${table.TABLE_NAME}`));
  await this.dbSync(true);
  this.logger.info('Database structure created');
};
