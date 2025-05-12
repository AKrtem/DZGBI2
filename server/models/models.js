const sequelize = require("../db");
const { DataTypes } = require("sequelize");

// Модель пользователя
const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: {
        msg: "Email must be a valid email address",
      },
    },
    set(value) {
      this.setDataValue("email", value.toLowerCase());
    },
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue("password", value);
    },
  },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

// Модель корзины
const Cart = sequelize.define("cart", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Модель для связи корзины и продуктов
const CartProduct = sequelize.define("cart_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Модель продукта
const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },

  // Параметры продукции
  length: { type: DataTypes.FLOAT, allowNull: true },
  width: { type: DataTypes.FLOAT, allowNull: true },
  height: { type: DataTypes.FLOAT, allowNull: true },
  load: { type: DataTypes.FLOAT, allowNull: true },
  weight: { type: DataTypes.FLOAT, allowNull: true },
  frostResistance: { type: DataTypes.STRING, allowNull: true },
  innerDiameter: { type: DataTypes.FLOAT, allowNull: true },
  outerDiameter: { type: DataTypes.FLOAT, allowNull: true },

  groupId: {
    type: DataTypes.INTEGER,
    references: { model: "Groups", key: "id" },
  },
  typeId: {
    type: DataTypes.INTEGER,
    references: { model: "Types", key: "id" },
  },
});

// Модель вида (например, плитка, кирпич и т.п.)
const View = sequelize.define("view", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// Модель группы
const Group = sequelize.define("group", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  viewId: {
    type: DataTypes.INTEGER,
    references: {
      model: View,
      key: "id",
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Модель типа
const Type = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  viewId: {
    type: DataTypes.INTEGER,
    references: {
      model: View,
      key: "id",
    },
  },
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
  },
});

// Модель рейтинга
const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

// Модель информации о продукте
const ProductInfo = sequelize.define("product_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

// Модель типа и бренда
const TypeBrand = sequelize.define("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Ассоциации между моделями
User.hasOne(Cart);
Cart.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Cart.hasMany(CartProduct);
CartProduct.belongsTo(Cart);

Group.belongsTo(View); // Группа принадлежит виду
View.hasMany(Group); // Вид может иметь несколько групп

Type.belongsTo(View); // Тип принадлежит виду
View.hasMany(Type); // Вид может иметь несколько типов

Type.belongsTo(Group); // Тип принадлежит группе
Group.hasMany(Type); // Группа может иметь несколько типов

Group.hasMany(Product);
Product.belongsTo(Group);

Product.hasMany(Rating);
Rating.belongsTo(Product);

Product.hasMany(CartProduct);
CartProduct.belongsTo(Product);

Product.hasMany(ProductInfo, {
  as: "info",
  foreignKey: "productId",
  onDelete: "CASCADE",
});
ProductInfo.belongsTo(Product, { foreignKey: "productId" });

View.hasMany(Group, { onDelete: "CASCADE" });
Group.belongsTo(View);

Group.hasMany(Type, { onDelete: "CASCADE" });
Type.belongsTo(Group);

Type.hasMany(Product, { onDelete: "CASCADE" });
Product.belongsTo(Type);

module.exports = {
  User,
  Cart,
  CartProduct,
  Product,
  Type,
  View,
  Group,
  Rating,
  TypeBrand,
  ProductInfo,
};
