# 鸭货计算器（zhouheiya）换新电脑操作文档

本文档用于你更换新电脑后，快速恢复本项目的开发、推送到【码云 + GitHub】以及部署到【CloudBase / Cloudflare Pages】的完整流程。

---

## 1. 项目信息

- **项目目录（旧电脑示例）**：`d:\Project\zhouheiya`
- **构建产物目录**：`dist/`
- **技术栈**：Vue 3 + Vite + TypeScript + Vant

### 1.1 远程仓库

- **码云（Gitee）**：`https://gitee.com/li-jia-bao/zhouhei-duck.git`
- **GitHub（SSH）**：`git@github.com:2523472604/zhouhei-durk.git`

---

## 2. 新电脑环境准备

### 2.1 安装软件

- **Git**（建议安装 Git for Windows）
- **Node.js**
  - 建议安装 **Node 20.19+ 或 22.12+**
  - 本项目依赖 Vite 7（对 Node 版本有要求）

### 2.2 克隆项目

> 推荐从 GitHub 克隆（后续部署到 Cloudflare Pages 也依赖 GitHub）。

```bash
git clone git@github.com:2523472604/zhouhei-durk.git
```

如果你还没有配置 SSH（见下面 3.1），也可以先用 HTTPS（需要 Token）：

```bash
git clone https://github.com/2523472604/zhouhei-durk.git
```

进入项目目录后安装依赖：

```bash
npm i
```

本地开发：

```bash
npm run dev
```

本地构建：

```bash
npm run build
```

---

## 3. Git 配置（重要）

### 3.1 GitHub 推送使用 SSH + 443（解决国内网络不稳定/10054）

#### 3.1.1 生成 SSH Key

```bash
ssh-keygen -t ed25519 -C "2523472604"
```
一路回车（默认保存到 `~/.ssh/id_ed25519`）。

#### 3.1.2 添加公钥到 GitHub

打印公钥：

```bash
cat ~/.ssh/id_ed25519.pub
```

复制输出内容到：

- GitHub → Settings → SSH and GPG keys → New SSH key

#### 3.1.3 强制走 443 端口

编辑（没有就新建）：

```bash
notepad ~/.ssh/config
```

写入：

```sshconfig
Host github.com
  HostName ssh.github.com
  User git
  Port 443
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
```

测试：

```bash
ssh -T git@github.com
```

出现 `Hi 2523472604! You've successfully authenticated...` 即成功。

---

### 3.2 两个 remote：码云（origin）+ GitHub（github）

查看远程：

```bash
git remote -v
```

推荐配置：

- `github` 指向 GitHub（SSH）
- `origin` 指向码云（HTTPS）

如果新电脑克隆后只看到一个 remote，可按下面补齐：

```bash
# GitHub remote（SSH）
git remote add github git@github.com:2523472604/zhouhei-durk.git

# 码云 remote（HTTPS）
git remote add origin https://gitee.com/li-jia-bao/zhouhei-duck.git
```

> 注意：`origin` 如果已经存在（例如你从码云克隆），就不要重复 add；改用 `git remote set-url origin <url>`。

---

## 4. 日常开发与推送（新电脑最常用）

改完代码后，提交并推送到两端：

```bash
git add .
git commit -m "update: xxx"

# 推送 GitHub（触发 Cloudflare Pages 自动部署）
git push github main

# 推送码云（用于 CloudBase 拉码/或你同步备份）
git push origin main
```

---

## 5. 部署：腾讯云 CloudBase（国内稳定）

### 5.1 使用 Git 仓库方式部署

CloudBase 控制台 → 选择环境 → 创建 Web/静态应用 → 选择 Gitee 仓库 → 配置：

- **安装命令**：`npm install`（或 `npm ci`）
- **构建命令**：`npm run build`
- **构建产物目录**：`dist`
- **部署路径**：`/` 或你指定的子路径

### 5.2 子路径部署白屏（资源 404）的修复

本项目已在 `vite.config.ts` 配置：

- `base: './'`

作用：无论部署在 `/` 还是 `/xxx/` 子路径下，静态资源都使用相对路径加载，避免 `/assets/...` 404 导致白屏。

### 5.3 SPA 刷新 404（路由重写）

如果你将来用到前端路由（例如 `/a`、`/b`），需要在 CloudBase 设置重写：

- `/*` → `/index.html`（200）

（具体入口在 CloudBase 应用的“路由/重写规则”里）

---

## 6. 部署：Cloudflare Pages（海外/部分国内可能不稳定）

### 6.1 Pages 项目配置

Cloudflare 控制台 → Workers & Pages → Pages → Create project → 连接 GitHub 仓库：

- **Build command**：`npm run build`
- **Build output directory**：`dist`

### 6.2 SPA 刷新不 404（Cloudflare Pages）

本项目已新增文件：

- `public/_redirects`

内容：

```txt
/*    /index.html   200
```

这会被打包进 `dist/_redirects`，用于 Pages 的 SPA 重写。

### 6.3 Cloudflare Pages 在中国大陆“打不开”的说明

`*.pages.dev` 在中国大陆存在较大概率不可达（DNS/线路/重置等原因）。

如果你要求 **“国内 100% 可访问”**：

- 以 **CloudBase** 为主站（国内线路）
- 如需自定义域名，建议配合 **ICP备案**

---

## 7. 常见报错与处理

### 7.1 Cloudflare Pages 构建失败：TS6133（未使用导入）

现象：

- `error TS6133: 'xxx' is declared but its value is never read.`

原因：

- `vue-tsc` 会把未使用 import 当成错误（导致构建失败）。

处理：

- 删除未使用的 import
- 或实际使用该变量

### 7.2 本地 Node 版本警告（EBADENGINE）

现象：

- Vite 提示需要 Node 20.19+，本地 Node 版本过低。

处理：

- 升级 Node 到 20.19+ 或 22.12+

---

## 8. 今日关键改动记录（方便回忆）

- **Vite 子路径部署修复**：`vite.config.ts` 增加 `base: './'`
- **Cloudflare Pages SPA 重写**：新增 `public/_redirects`
- **Git 双远程**：
  - `origin` → Gitee
  - `github` → GitHub（SSH）
- **GitHub 推送网络问题解决**：SSH 改走 `ssh.github.com:443`

---

## 9. 最简操作速记（换电脑后常用）

```bash
# 1) 克隆
git clone git@github.com:2523472604/zhouhei-durk.git

# 2) 安装依赖
npm i

# 3) 本地开发
npm run dev

# 4) 改完提交并推送
git add .
git commit -m "update: xxx"
git push github main
git push origin main
```
