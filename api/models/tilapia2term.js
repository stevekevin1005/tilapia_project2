module.exports = {
  attributes: {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    term_type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    acc: {
      type: Sequelize.STRING,
      allowNull: false
    },
    is_obsolete: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    is_root: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    is_relation: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  associations: function() {
    tilapia2term.belongsToMany(tilapia2annotation,{
      through: 'tilapia_2_term_annotation'
    });
  },
  options: {
    timestamps: false,
    tableName: 'term'
  }
};
