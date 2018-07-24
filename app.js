/*
引入相关模块
*/
// 引入express框架
const express = require("express");
// 引入路径模块
const path = require("path");
// 引入mongoose模块
const mongoose = require("mongoose");
// 引入body-parser模块
const bodyParser = require("body-parser");

// 实例化一个express对象
let app = express();

/*
配置模板引擎
*/
// 设置模板引擎的存放目录为当前被执行的js文件的相对目录views
app.set("views", path.join(__dirname, "/views"));
// 设置模板引擎为ejs
app.set("view engine", "ejs");

// 使用中间件设置静态资源库的目录
app.use("/public", express.static(path.join(__dirname, "/public")));
// body-parser配置
app.use(bodyParser.urlencoded({extended: true}));

/*
路由处理
*/
// 所有通过"/"的url，都由./routes/main.js文件进行处理
app.use("/", require("./routes/main.js"));
// 所有通过"/api"的url，都由./routes/api.js文件进行处理
app.use("/api", require("./routes/api.js"));

// 连接数据库
mongoose.connect("mongodb://localhost:27017/blog_db", (err) => {
    if (!err) {
        // 如果没出错，监听端口号
        console.log("数据库连接成功！");
        app.listen(8080);
    } else {
        // 出错则抛出异常
        throw err;
    }
});