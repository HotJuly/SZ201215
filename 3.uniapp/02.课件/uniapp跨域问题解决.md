# uniapp-H5跨域问题解决

1. 由于uniapp可以打包编译成H5的Vue项目,其中很可能出现跨域问题
2. 解决方案:
   1. 使用HBuilderX内置浏览器
   2. 添加vue.config.js文件配置proxy代理
      1. 详细配置参考vue-cli官网
   3. 在manifest.json中配置h5->devServer即可
      1. 详细配置参考webpack官网