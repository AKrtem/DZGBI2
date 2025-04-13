const { Group } = require("../models/models");
const ApiError = require("../error/ApiError");

class GroupController {
  async create(req, res) {
    const { name } = req.body;
    const group = await Group.create({ name });
    return res.json(brand);
  }

  async getAll(req, res) {
    const groups = await Group.findAll();
    return res.json(groups);
  }
}

module.exports = new GroupController();
