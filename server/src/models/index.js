const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const TokenSchema = require("./token-model.js");

const Tag = sequelize.define("tags", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  value: { type: Sequelize.STRING, allowNull: false },
}, {
  timestamps: false,
  tableName: 'tags',
});
const Results = sequelize.define('results', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  score: { type: Sequelize.STRING, allowNull: false },
  created_at: { type: Sequelize.DATE, allowNull: false },
  forms_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'forms', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
  },
  users_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
  },
}, {
    timestamps: false,
});
const User = sequelize.define('users', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
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
    },
    onDelete: 'CASCADE',
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

const TemplatesTag = sequelize.define("template_tags", {
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "templates",
      key: "id",
    },
  },
  tags_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "tags",
      key: "id",
    },
  },
}, {
  timestamps: false,
});


const Like = sequelize.define("likes", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
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
const TemplatesAccess = sequelize.define("template_access", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "templates",
      key: "id",
    },
  },
  users_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
}, {
  timestamps: false,
  tableName: "template_access",
});

Template.hasMany(Like, { foreignKey: 'templates_id', onDelete: 'CASCADE' });
Template.hasMany(Question, { foreignKey: 'templates_id', onDelete: 'CASCADE' });
Template.hasMany(Comment, { foreignKey: 'templates_id', onDelete: 'CASCADE' });
Template.hasMany(Form, { foreignKey: 'templates_id', onDelete: 'CASCADE' });
Form.hasMany(Results, { foreignKey: 'forms_id', onDelete: 'CASCADE' });
User.hasMany(Results, { foreignKey: 'users_id' });
Template.belongsToMany(Tag, {
  through: TemplatesTag,
  foreignKey: "templates_id",
  otherKey: "tags_id",
  onDelete: "CASCADE"
});
User.hasMany(TokenSchema, { foreignKey: 'user_id' });
Question.hasMany(Answer, { foreignKey: 'questions_id' });
Template.belongsToMany(Tag, {
  through: TemplatesTag,
  foreignKey: "templates_id",
  otherKey: "tags_id",
});

Tag.belongsToMany(Template, {
  through: TemplatesTag,
  foreignKey: "tags_id",
  otherKey: "templates_id",
});
Question.belongsTo(Template, { foreignKey: "templates_id" });
Form.belongsTo(Template, { foreignKey: "templates_id" });
Form.belongsTo(User, { foreignKey: "users_id" });
Answer.belongsTo(Form, { foreignKey: "forms_id" });
Answer.belongsTo(Question, { foreignKey: "questions_id" });
Comment.belongsTo(Template, { foreignKey: "templates_id" });
Comment.belongsTo(User, { foreignKey: "users_id" });
Like.belongsTo(Template, { foreignKey: "templates_id" });
Like.belongsTo(User, { foreignKey: "users_id" });
Template.hasMany(TemplatesAccess, {
  foreignKey: "templates_id",
  as: "templateAccesses",
});
TemplatesAccess.belongsTo(Template, {
  foreignKey: "templates_id",
  as: "template",
});
User.hasMany(TemplatesAccess, {
  foreignKey: "users_id",
  as: "userTemplateAccesses",
});
TemplatesAccess.belongsTo(User, {
  foreignKey: "users_id",
  as: "user",
});
Results.belongsTo(User, { foreignKey: 'users_id' });
Results.belongsTo(Form, { foreignKey: 'forms_id' });
Answer.belongsTo(Form, { foreignKey: 'forms_id' });
Form.hasMany(Answer, { foreignKey: 'forms_id' });
User.hasMany(Answer, { foreignKey: "users_id", onDelete: "CASCADE" });
Answer.belongsTo(User, { foreignKey: "users_id" });
User.hasMany(Comment, { foreignKey: "users_id", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "users_id" });

User.hasMany(Like, { foreignKey: "users_id", onDelete: "CASCADE" });
Like.belongsTo(User, { foreignKey: "users_id" });

User.hasMany(TemplatesTag, { foreignKey: "users_id", onDelete: "CASCADE" });
TemplatesTag.belongsTo(User, { foreignKey: "users_id" });

User.hasMany(Results, { foreignKey: "users_id", onDelete: "CASCADE" });
Results.belongsTo(User, { foreignKey: "users_id" });

User.hasMany(Form, { foreignKey: "users_id", onDelete: "CASCADE" });
Form.belongsTo(User, { foreignKey: "users_id" });

module.exports = {
  sequelize,
  User,
  Template,
  Question,
  Results,
  Form,
  Answer,
  Comment,
  Like,
  TemplatesTag,
  TemplatesAccess,
  Tag
};
