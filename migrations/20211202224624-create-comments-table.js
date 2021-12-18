/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     *
     * ` */

    const table = await queryInterface.createTable("comments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: new Sequelize.UUIDV4(),
        unique: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      twitId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });

    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     */
    return queryInterface.dropTable("comments");
  }
};
