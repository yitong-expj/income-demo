# UI 与技术方案

## UI
采用“月度财务手账”风格：暖米色背景、深墨绿色文字、橙色强调，细分隔线和衬线大标题。桌面左侧输入，右侧结余摘要和环形饼图；手机单列。顶部标明“本月收支”，底部说明本机保存。结余为主视觉，储蓄率与支出次之。超支使用红色并配文字，不能只靠颜色。图表提供完整文字图例；所有控件有焦点样式，尊重减少动态效果偏好。

## 技术
原生 HTML/CSS/ES Modules，无运行时第三方依赖，无外部字体与数据请求。核心计算独立到 finance.js，用整数分求和；UI 用 DOM API 和 textContent 创建可编辑行，CSS conic-gradient 生成环形饼图。localStorage 保存有版本的有效草稿，读取时验证；存储不可用时保持计算并提示。

## 测试与发布
Node 内置测试覆盖计算、边界、校验。Playwright 验证实际输入、增删、保存恢复、空态、超支、错误与手机布局，并保存截图。GitHub 新建公开仓库 income-demo，main 根目录经 GitHub Pages 发布，.nojekyll 跳过 Jekyll。检查构建状态、线上 HTTP 和线上交互。回退可使用 git revert 后推送 main。

发布依据：https://docs.github.com/en/rest/pages/pages

## 文件
index.html / style.css / app.js：页面；finance.js：计算；tests：测试；docs：PRD、设计与测试记录。不会发布旧项目或账本数据。
