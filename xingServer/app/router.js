'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/index', controller.home.index);// 管理面板获得新闻信息。index, pageSize
  router.post('/add', controller.home.add);// 编写面板提交信息,title,author,containers
  router.post('/addimg', controller.home.addimg);// img,id注意上传图片需要更改实际需求的域名地址：更改位置在service文件下的addFile
  router.post('/update', controller.home.update); // title,author,containerUP,id
  router.post('/detail', controller.home.detail); // id
  router.post('/delete', controller.home.delete); // id
  // 还需要实现更新图片上传，以及删除，这里图片上传可利用上面的，参数加id不加是
};
