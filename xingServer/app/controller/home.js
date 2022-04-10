/* eslint-disable */
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const { index, pageSize } = ctx.request.body;
    const result = await ctx.service.home.data(index, pageSize);
    ctx.body = result;
  }
  async delete() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      const result = await this.app.mysql.delete('data', {
        id,
      });
      const address1 = path.join(this.config.baseDir, `app/public/uploads/images/${id}/`);
      const address2 = path.join(this.config.baseDir, `app/public/uploads/files/${id}/`);
      const emptyDir = function (fileUrl) {
        const files = fs.readdirSync(fileUrl);// 读取该文件夹
        files.forEach(function (file) {
          undefined;
          const stats = fs.statSync(fileUrl + '/' + file);
          if (stats.isDirectory()) {
            undefined;
            emptyDir(fileUrl + '/' + file);
          } else {
            undefined;
            fs.unlinkSync(fileUrl + '/' + file);
            console.log('删除文件' + fileUrl + '/' + file + '成功');
          }
        });
      };

      // 删除所有的空文件夹
      const rmEmptyDir = function (fileUrl) {
        undefined;
        const files = fs.readdirSync(fileUrl);
        if (files.length > 0) {
          undefined;
          let tempFile = 0;
          files.forEach(function (fileName) {
            undefined;
            tempFile++;
            rmEmptyDir(fileUrl + '/' + fileName);
          });
          if (tempFile === files.length) { // 删除母文件夹下的所有字空文件夹后，将母文件夹也删除
            fs.rmdirSync(fileUrl);
            console.log('删除空文件夹' + fileUrl + '成功');
          }
        } else {
          undefined;
          fs.rmdirSync(fileUrl);
          console.log('删除空文件夹' + fileUrl + '成功');
        }
      };
      if (fs.existsSync(address1)) emptyDir(address1);
      if (fs.existsSync(address1)) rmEmptyDir(address1);
      if (fs.existsSync(address2)) emptyDir(address2);
      if (fs.existsSync(address2)) rmEmptyDir(address2);
      ctx.body = {
        address1,
        address2,
        result,
        code: 200,
        msg: '删除成功',
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
      };
    }
  }
  async add() {
    const { ctx } = this;
    const { containers } = ctx.request.body;
    const { title } = ctx.request.body;
    const { author } = ctx.request.body;
    try {
      // sql语句字段名和这里定义的变量名是对应的笑死
      // eslint-disable-next-line no-unused-vars
      const time = new Date();
      const ids = await this.app.mysql.select('data', { // 搜索 data 表
        columns: 'id', // 要查询的表字段
        orders: [['id', 'DESC']], // 排序方式
        limit: 1, // 返回数据量
        offset: 0, // 数据偏移量
      });
      let number;
      if (ids[0]) {
        number = ids[0].id;
      } else {
        number = 0;
      }
      const id = number + 1;
      const container = await ctx.service.addFile.htmlFile(containers, title, id);
      const result = await ctx.service.add.addC({
        id,
        title,
        author,
        time,
        container,
      });
      ctx.body = {
        result,
        id,
        container,
        code: 200,
        msg: '添加',
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '添加失败',
      };
    }
  }
  async addimg() {
    const { ctx } = this;
    const img = ctx.request.files[0];
    let { idd } = ctx.request.body;
    try {
      if (idd === 'undefined') {
        const ids = await this.app.mysql.select('data', { // 搜索 data 表
          columns: 'id', // 要查询的表字段
          orders: [['id', 'DESC']], // 排序方式
          limit: 1, // 返回数据量
          offset: 0, // 数据偏移量
        });
        let number;
        if (ids[0]) {
          number = ids[0].id;
        } else {
          number = 0;
        }
        const id = number + 1;
        idd = id;
      }
      const result = await ctx.service.addFile.image(img, idd);
      ctx.body = {
        idd,
        result,
        code: 200,
        msg: '添加',
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '添加失败',
      };
    }
  }
  async update() {
    const { ctx } = this;
    const { containerUP } = ctx.request.body;
    const { id } = ctx.request.body;
    const { title } = ctx.request.body;
    const { author } = ctx.request.body;
    try {
      const idC = id;
      // const containers = '<h2 style="text-align:center;">这里是标题</h2><p style="text-align:center;">作者：看</p><p>第一段：</p><figure class="image"><img src="https://tse4-mm.cn.bing.net/th/id/OIP-C.AaD0qlYDX-RTF_frh-ZhIQHaEo?pid=ImgDet&amp;rs=1"></figure>';
      // sql语句字段名和这里定义的变量名是对应的笑死
      const row = await this.app.mysql.get('data', { id: idC });
      const addr = path.join(this.config.baseDir, row.container);
      fs.writeFileSync(addr, containerUP, function (err) {
        if (err) {
          throw err;
        }
      });
      // const t = title;
      // const a = author;
      const options = {
        where: {
          id: idC,
        },
      };
      const result = await this.app.mysql.update('data', {
        title,
        author, // 要修改的参数体，直接通过 ... 扩展操作符展开
      }, options);
      ctx.body = {
        result,
        id,
        // container,
        code: 200,
        msg: '添加',
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        id,
        containerUP,
        code: 500,
        msg: '添加失败',
      };
    }
  }
  async detail() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      const idC = id;
      // const containers = '<h2 style="text-align:center;">这里是标题</h2><p style="text-align:center;">作者：看</p><p>第一段：</p><figure class="image"><img src="https://tse4-mm.cn.bing.net/th/id/OIP-C.AaD0qlYDX-RTF_frh-ZhIQHaEo?pid=ImgDet&amp;rs=1"></figure>';
      // sql语句字段名和这里定义的变量名是对应的笑死
      const row = await this.app.mysql.get('data', { id: idC });
      const addr = path.join(this.config.baseDir, row.container);
      const result = fs.readFileSync(addr, 'utf-8');
      ctx.body = {
        id,
        result,
        code: 200,
        msg: 'ok',
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        id,
        code: 500,
        msg: 'err',
      };
    }
  }
}

module.exports = HomeController;
