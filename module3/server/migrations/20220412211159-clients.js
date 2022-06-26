module.exports = {
  async up(db) {
    await db.createCollection('Record');
    await db.createCollection('Record_infinity');
  },

  async down(db) {
    await db.collection('Record').drop();
    await db.collection('Record_infinity').drop();
  }
};
