module.exports = {
  attributes: {
    contig: {
      type: Sequelize.STRING,
      allowNull: false
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false
    },
    ref: {
      type: Sequelize.STRING,
      allowNull: false
    },
    alt: {
      type: Sequelize.STRING,
      allowNull: false
    },
    quality: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  },
  associations: function() {
    tilapia2VAR.belongsToMany(tilapia2SSR,{
      through: 'tilapia_2_SSR_VAR'
    });
  },
  options: {
    timestamps: false,
    tableName: 'tilapia_2_variation'
  }
};
