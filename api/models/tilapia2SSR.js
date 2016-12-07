module.exports = {
  attributes: {
    contig: {
      type: Sequelize.STRING,
      allowNull: false
    },
    SSRPattern1: {
      type: Sequelize.STRING,
      allowNull: false
    },
    SSRPattern2: {
      type: Sequelize.STRING,
      allowNull: false
    },
    "5'frinkinSequence": {
      type: Sequelize.STRING,
      allowNull: false
    },
    "3'frinkinSequence": {
      type: Sequelize.STRING,
      allowNull: false
    },
    start: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    end: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  associations: function() {
    tilapia2SSR.belongsToMany(tilapia2VAR,{
      through: 'tilapia_2_SSR_VAR'
    });

    tilapia2SSR.belongsToMany(tilapia2inf,{
      through: 'tilapia_2_SSR_INFORMATION'
    });
  },
  options: {
    timestamps: false,
    tableName: 'tilapia_2_ssr'
  }
};
