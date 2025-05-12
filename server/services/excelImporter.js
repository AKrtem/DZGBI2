const { View, Group, Type, Product } = require("../models/models.js");
const XLSX = require("xlsx");

// Удалено: verifyCaptcha и dotenv

const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet);
  return jsonData;
};

const findOrCreateView = async (viewName) => {
  let view = await View.findOne({ where: { name: viewName } });
  if (!view) {
    view = await View.create({ name: viewName });
  }
  return view;
};

const findOrCreateGroup = async (groupName, viewId) => {
  let group = await Group.findOne({ where: { name: groupName, viewId } });
  if (!group) {
    group = await Group.create({ name: groupName, viewId });
  }
  return group;
};

const findOrCreateType = async (typeName, groupId, viewId) => {
  let type = await Type.findOne({
    where: { name: typeName, groupId, viewId },
  });
  if (!type) {
    type = await Type.create({ name: typeName, groupId, viewId });
  }
  return type;
};

const saveProducts = async (products) => {
  for (let productData of products) {
    const {
      Название: name,
      Вид,
      Группа,
      Тип,
      Длина,
      Ширина,
      Высота,
      Масса,
      Нагрузка,
      Морозостойкость,
      "d, внут": dInner,
      "d, внеш": dOuter,
    } = productData;

    if (!name || !Вид || !Группа || !Тип) {
      console.warn(`Пропущена строка — отсутствуют обязательные поля`);
      continue;
    }

    const view = await findOrCreateView(Вид);
    const group = await findOrCreateGroup(Группа, view.id);
    const type = await findOrCreateType(Тип, group.id, view.id);

    const numericOrNull = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? null : n;
    };

    const payload = {
      name,
      groupId: group.id,
      typeId: type.id,
      length: numericOrNull(Длина),
      width: numericOrNull(Ширина),
      height: numericOrNull(Высота),
      load: numericOrNull(Нагрузка),
      weight: numericOrNull(Масса),
      frostResistance: Морозостойкость || null,
      innerDiameter: numericOrNull(dInner),
      outerDiameter: numericOrNull(dOuter),
    };

    const existingProduct = await Product.findOne({ where: { name } });

    if (existingProduct) {
      await existingProduct.update(payload);
      console.log(`Продукт "${name}" обновлён.`);
    } else {
      await Product.create(payload);
      console.log(`Продукт "${name}" создан.`);
    }
  }
};

module.exports = {
  parseExcel,
  saveProducts,
};
