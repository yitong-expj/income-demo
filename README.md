# 月有余 · income-demo

输入每月收入与各项支出，即时计算结余、储蓄率，并以环形饼图展示支出分布。橙色纸感界面，适配手机，数据只保存到当前浏览器。

- [在线使用](https://yitong-expj.github.io/income-demo/)
- [PRD](docs/PRD.md)
- [UI 与技术方案](docs/DESIGN.md)
- [测试记录](docs/TESTING.md)

## 本地运行

使用 `python3 -m http.server 4173`，打开 http://localhost:4173 。无需安装运行依赖。

## 测试

Node.js 22 或以上：`npm ci`，`npm test`。浏览器测试：`npx playwright install chromium`，`npm run test:e2e`。

线上测试：`BASE_URL=https://yitong-expj.github.io/income-demo/ npm run test:e2e`。

## 规则

人民币，最多两位小数，最多 30 项支出；空金额按零，负数和非法输入暂停计算。储蓄率 =（收入－支出）/收入，收入为零显示 —。饼图只显示支出比例。清除浏览器数据会丢失草稿，不支持跨设备同步。

## 发布

GitHub Pages 从 main 根目录发布；纯静态文件，无密钥和后端。部署方式参见 https://docs.github.com/en/rest/pages/pages 。
