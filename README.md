# 便签云 - 部署指南

## 方式一：部署到 Railway（推荐，最简单）

1. 打开 https://railway.app/new
2. 选择 **Deploy from GitHub repo**
3. 把 `server/` 目录下的所有文件推送到一个 GitHub 仓库
4. 在 Railway 连接该仓库
5. Railway 会自动检测 Node.js 并部署
6. 部署完成后你会得到一个 `xxx.railway.app` 的网址
7. 在任何设备打开该网址即可使用

## 方式二：部署到 Render

1. 把 `server/` 目录推送到 GitHub
2. 在 https://render.com 注册
3. 点击 **New +** → **Web Service**
4. 连接你的 GitHub 仓库
5. 填写：
   - Name: `notes-app`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. 选择 **Free** 套餐
7. 点击 **Create Web Service**
8. 等待部署完成，得到 `https://notes-app.onrender.com` 类似的网址

## 方式三：本地运行

```bash
cd server
npm install
npm start
```

然后打开 http://localhost:3000

## 数据安全

- 所有数据存储在服务器的 `data/notes.json` 文件中
- 免费平台可能在一段时间不活跃后休眠，唤醒后会继续工作
- 支持手动同步和自动同步
