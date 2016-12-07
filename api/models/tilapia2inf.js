module.exports = {
  attributes: {
    geneId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    contig: {
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
    },
    region: {
      type: Sequelize.STRING,
      allowNull: false
    },
    parent: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  associations: function() {
    tilapia2inf.belongsToMany(tilapia2SSR,{
      through: 'tilapia_2_SSR_INFORMATION'
    });

    tilapia2inf.belongsToMany(tilapia2annotation,{
      through: 'tilapia_2_annotation_inf'
    });
  },
  options: {
    timestamps: false,
    tableName: 'tilapia_2_information'
  }
};
