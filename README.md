# 多图片转PDF工具

在线批量图片转pdf，托管平台https://vercel.com/

一个基于React的前端应用程序，可以将多张图片合并为一个PDF文件。

## 功能特性

- ✨ 支持多种图片格式（JPG, PNG, GIF等）
- 🎯 拖拽式图片上传界面
- 🔄 图片预览和排序功能
- 📏 自动调整图片尺寸以适应PDF页面
- 💻 客户端PDF生成，无需服务器
- ⬇️ 一键下载生成的PDF文件

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

## 使用说明

1. 点击上传区域选择图片文件
2. 在预览区域查看已选择的图片
3. 使用上下箭头调整图片顺序
4. 点击"生成PDF"按钮下载PDF文件

## 技术栈

- React 19.1.0
- Vite 6.3.5
- Tailwind CSS 4.1.7
- jsPDF 3.0.2
- shadcn/ui
- Lucide React

## 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 许可证

MIT License

