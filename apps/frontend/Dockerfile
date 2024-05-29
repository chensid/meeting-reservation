# 第一阶段：构建前端应用
FROM node:22 as builder

WORKDIR /app

COPY package.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm build

# 第二阶段：准备轻量级的 nginx 镜像
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]