const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Tag = sequelize.define("tags", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
}, {
  timestamps: false,
});


module.exports = Tag;
const User = sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  }, {
    timestamps: false,
  });

  const Template = sequelize.define("templates", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    category: Sequelize.STRING,
    image_url: Sequelize.STRING,
    is_public: Sequelize.BOOLEAN,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
  }, {
    timestamps: false,
  });
const Question = sequelize.define("questions", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  type: Sequelize.STRING,
  order: Sequelize.INTEGER,
  show_in_results: Sequelize.BOOLEAN,
});

const Form = sequelize.define("forms", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  submitted_at: Sequelize.DATE,
});

const Answer = sequelize.define("answers", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  answer: Sequelize.STRING,
});

const Comment = sequelize.define("comments", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  content: Sequelize.TEXT,
  created_at: Sequelize.DATE,
});

const Like = sequelize.define("likes", {});


Template.belongsTo(User, { foreignKey: 'users_id' });
Template.hasMany(Tag);
Template.hasMany(Question, { foreignKey: 'templates_id' });
Question.hasMany(Answer, { foreignKey: 'questions_id' });
User.hasMany(Template, { foreignKey: 'users_id' });
Tag.belongsToMany(Template, { through: 'TemplateTag' });
Question.belongsTo(Template, { foreignKey: "templates_id" });
Form.belongsTo(Template, { foreignKey: "templates_id" });
Form.belongsTo(User, { foreignKey: "users_id" });
Answer.belongsTo(Form, { foreignKey: "forms_id" });
Answer.belongsTo(Question, { foreignKey: "questions_id" });
Comment.belongsTo(Template, { foreignKey: "templates_id" });
Comment.belongsTo(User, { foreignKey: "users_id" });
Like.belongsTo(Template, { foreignKey: "templates_id" });
Like.belongsTo(User, { foreignKey: "users_id" });

// Экспорт моделей
module.exports = {
  sequelize,
  User,
  Template,
  Question,
  Form,
  Answer,
  Comment,
  Like,
};
