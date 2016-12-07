module.exports = {
  attributes: {
    geneid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    goid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    source: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  },
  associations: function() {
    tilapia2annotation.belongsToMany(tilapia2term,{
      through: 'tilapia_2_term_annotation'
    });

    tilapia2annotation.belongsToMany(tilapia2inf,{
      through: 'tilapia_2_annotation_inf'
    });
  },
  options: {
    timestamps: false,
    tableName: 'go_annotation'
  }
};
