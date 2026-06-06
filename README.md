# 金融求职在线简历制作器

面向金融类求职者的 MVP 级网页端简历制作项目，包含模块化编辑器、点击式 A4 预览、目标页数/自动分页、头像上传、模块与组件排序、自我评价、英文简历一键导出、金融关键词诊断和 PDF 导出接口。

## 在线使用

项目已上线，可直接访问：[https://online-resume-five.vercel.app](https://online-resume-five.vercel.app)。

## 运行

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

当前仓库也提供了无需 npm 的静态可运行版本：

```bash
node server.mjs
```

访问 `http://127.0.0.1:3000`。

## 测试

```bash
npm test
```

当前核心测试覆盖：

- 金融简历默认模块顺序
- 模块上移、下移、拖拽排序
- 模块内条目排序，以及字段顺序调整/忽略
- 目标页数分页与自动页数估算
- 个人照片字段与预览/PDF 头像呈现
- 恢复金融推荐顺序
- 目标页数溢出与压缩建议
- 中英字段翻译与人工校对状态
- 金融关键词和量化成果诊断

## PDF 导出

PDF 导出接口使用 Playwright 渲染 A4 页面。首次运行前安装 Chromium：

```bash
npx playwright install chromium
```

接口路径：

```txt
POST /api/resumes/:id/export/pdf
```
