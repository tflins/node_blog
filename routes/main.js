// 引入相关模块
const express = require("express");
const categoryModel = require("../models/category");
const contentModel = require("../models/content");
// 引入自定义的分页渲染模块
const pagination = require("../my_modules/pagination");

// 实例化Router对象
const router = express.Router();

// 定义一个变量用来存放传递给模板的其他信息
let other = {};
// 分类查询条件
let where = {};

// 处理通用数据
router.use("/", (req, res, next) => {
    // 接收前端传递过来的需要查询分类的id
    if (req.query.categoryId) {
        other.categoryId = req.query.categoryId;
        where.category = req.query.categoryId;
    } else {
        where = {};
        other.categoryId = null;
    }

    categoryModel.find({}, (err, categories) => {
        if (!err) {
            // 如果不出错
            other.categories = categories;
        } else {
            throw err;
        }
    });

    next();
});

// 首页路由配置
router.get("/", (req, res) => {

        // 调用分页渲染模块渲染内容
        pagination({
            // 每页显示的条数
            limit: 10,
            // 需要操作的数据库模型
            model: contentModel,
            // 需要控制分页的url
            url: "/",
            // 渲染的模板页面
            ejs: "main/index",
            // 查询的条件
            where: where,
            // 给模板绑定参数的名称
            res: res,
            req: req,
            populate: ["category", "author"],
            // 其他数据
            other: other
        });
});

// 内容页面
router.get("/views", (req, res) => {
    // 获取文章id
    let contentId = req.query.contentId;
    // 根据id从数据库中查询文章内容
    contentModel.findById(contentId).populate(["category", "author"]).then((content) => {
        // 渲染内容模板
        res.render("main/views", {
            userInfo: req.userInfo,
            other: other,
            content: content
        });
        // 阅读量增加
        content.views ++;
        content.save();
    });
});

// 将其暴露给外部使用
module.exports = router;
