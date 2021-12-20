'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async addC(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('data', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = HomeService;
