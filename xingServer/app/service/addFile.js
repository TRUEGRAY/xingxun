'use strict';
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const mkdirp = require('mkdirp');
// 需要更改的图片上传域名
const netAdd = 'http://127.0.0.1:7001';

class addFile extends Controller {
  async image(img, id) {
    const date = Date.now();
    let name = img.filename.split('.');
    const len = name.length;
    name = name.slice(0, len - 1).join('');
    name = date + name;
    name = name.replace(/\s*/g, '');
    const resPath = netAdd + path.join(`/public/uploads/images/${id}/`, name + path.extname(img.filename));
    let address = path.join(this.config.baseDir, `app/public/uploads/images/${id}/`);
    const f = fs.readFileSync(img.filepath);
    if (!fs.existsSync(address)) { // 文件不存在
      await mkdirp(address);
      address = path.join(address, name + path.extname(img.filename));
      fs.writeFileSync(address, f, function(err) {
        if (err) {
          throw err;
        }
      });
    } else {
      address = path.join(address, name + path.extname(img.filename));
      fs.writeFileSync(address, f, function(err) {
        if (err) {
          throw err;
        }
      });
    }
    return resPath;
  }
  async htmlFile(a, b, c) {
    const container = a;
    const id = c;
    let title = b;
    title = id + title;
    // const resPath = `../../public/uploads/files/${id}/${title}.txt`;
    let address = path.join(this.config.baseDir, `app/public/uploads/files/${id}/`);
    if (!fs.existsSync(address)) { // 文件不存在
      await mkdirp(address);
      address = path.join(address, title + path.extname(`${title}.txt`));
      fs.writeFileSync(address, container, function(err) {
        if (err) {
          throw err;
        }
      });
    } else {
      address = path.join(address, title + path.extname(`${title}.txt`));
      fs.writeFileSync(address, container, function(err) {
        if (err) {
          throw err;
        }
      });
    }
    address = `app/public/uploads/files/${id}/${title}.txt`;
    return address;
  }
}

module.exports = addFile;
