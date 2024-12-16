const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const TokenSchema = require("./token-model.js");
const Tag = sequelize.define("tags", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
}, {
  timestamps: false,
});


module.exports = Tag;
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING },
  theme: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'templates',
      key: 'id'
    }
  },
  correct_answer: Sequelize.STRING(255)
}, {
  timestamps: false,
});

const Form = sequelize.define("forms", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  submitted_at: Sequelize.DATE,
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'templates',
      key: 'id'
    }
  },
  users_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: false,
});


const Answer = sequelize.define("answers", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  answer: Sequelize.STRING,
  forms_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'forms',
      key: 'id'
    }
  },
 questions_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'questions ',
      key: 'id'
    }
  },
  is_correct: Sequelize.BOOLEAN,
  users_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: false,
});

const Comment = sequelize.define("comments", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  content: Sequelize.TEXT,
  created_at: Sequelize.DATE,
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'templates',
      key: 'id'
    }
  },
  users_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: false,
});

const Like = sequelize.define("likes", {});

User.hasMany(TokenSchema, { foreignKey: 'user_id' });
TokenSchema.belongsTo(User, { foreignKey: 'user_id' });
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
