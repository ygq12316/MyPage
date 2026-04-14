// ========================================================
// 静态 Mock 数据 —— GitHub Pages 纯前端演示用
// 修改此文件即可定制博客展示内容
// ========================================================

// ---------- 分类 ----------
export const categories = [
  { id: 1, categoryName: "前端开发", articleCount: 3 },
  { id: 2, categoryName: "后端开发", articleCount: 3 },
  { id: 3, categoryName: "运维部署", articleCount: 2 },
  { id: 4, categoryName: "算法与数据结构", articleCount: 1 },
  { id: 5, categoryName: "随笔", articleCount: 1 }
];

// ---------- 标签 ----------
export const tags = [
  { id: 1, tagName: "Vue.js" },
  { id: 2, tagName: "JavaScript" },
  { id: 3, tagName: "Java" },
  { id: 4, tagName: "Spring Boot" },
  { id: 5, tagName: "Docker" },
  { id: 6, tagName: "Redis" },
  { id: 7, tagName: "算法" },
  { id: 8, tagName: "随笔" }
];

// ---------- 文章列表（预览） ----------
export const articles = [
  {
    id: 1,
    articleTitle: "Vue 3 Composition API 实战指南",
    articleCover: "https://picsum.photos/seed/vue3/800/400",
    createTime: "2025-03-10T10:00:00.000+08:00",
    updateTime: "2025-03-15T08:00:00.000+08:00",
    categoryId: 1,
    categoryName: "前端开发",
    viewsCount: 3862,
    likeCount: 128,
    tagDTOList: [
      { id: 1, tagName: "Vue.js" },
      { id: 2, tagName: "JavaScript" }
    ]
  },
  {
    id: 2,
    articleTitle: "Spring Boot 3.x 整合 JWT 鉴权详解",
    articleCover: "https://picsum.photos/seed/spring/800/400",
    createTime: "2025-02-20T09:30:00.000+08:00",
    updateTime: "2025-02-25T14:00:00.000+08:00",
    categoryId: 2,
    categoryName: "后端开发",
    viewsCount: 5123,
    likeCount: 214,
    tagDTOList: [
      { id: 3, tagName: "Java" },
      { id: 4, tagName: "Spring Boot" }
    ]
  },
  {
    id: 3,
    articleTitle: "Docker + GitHub Actions 自动化部署实践",
    articleCover: "https://picsum.photos/seed/docker/800/400",
    createTime: "2025-01-15T15:00:00.000+08:00",
    updateTime: "2025-01-18T10:00:00.000+08:00",
    categoryId: 3,
    categoryName: "运维部署",
    viewsCount: 4401,
    likeCount: 176,
    tagDTOList: [
      { id: 5, tagName: "Docker" }
    ]
  },
  {
    id: 4,
    articleTitle: "JavaScript 异步编程：从回调地狱到 async/await",
    articleCover: "https://picsum.photos/seed/async/800/400",
    createTime: "2024-12-20T11:00:00.000+08:00",
    updateTime: null,
    categoryId: 1,
    categoryName: "前端开发",
    viewsCount: 6782,
    likeCount: 305,
    tagDTOList: [
      { id: 2, tagName: "JavaScript" }
    ]
  },
  {
    id: 5,
    articleTitle: "Redis 缓存穿透、击穿、雪崩解决方案",
    articleCover: "https://picsum.photos/seed/redis/800/400",
    createTime: "2024-11-08T16:30:00.000+08:00",
    updateTime: null,
    categoryId: 2,
    categoryName: "后端开发",
    viewsCount: 7294,
    likeCount: 389,
    tagDTOList: [
      { id: 6, tagName: "Redis" },
      { id: 3, tagName: "Java" }
    ]
  },
  {
    id: 6,
    articleTitle: "前端性能优化：Lighthouse 评分从 60 到 98",
    articleCover: "https://picsum.photos/seed/perf/800/400",
    createTime: "2024-10-05T13:00:00.000+08:00",
    updateTime: null,
    categoryId: 1,
    categoryName: "前端开发",
    viewsCount: 4918,
    likeCount: 241,
    tagDTOList: [
      { id: 2, tagName: "JavaScript" },
      { id: 1, tagName: "Vue.js" }
    ]
  },
  {
    id: 7,
    articleTitle: "LRU 缓存算法实现与分析",
    articleCover: "https://picsum.photos/seed/lru/800/400",
    createTime: "2024-09-12T10:00:00.000+08:00",
    updateTime: null,
    categoryId: 4,
    categoryName: "算法与数据结构",
    viewsCount: 3155,
    likeCount: 167,
    tagDTOList: [
      { id: 7, tagName: "算法" }
    ]
  },
  {
    id: 8,
    articleTitle: "MySQL 索引原理与 SQL 调优实战",
    articleCover: "https://picsum.photos/seed/mysql/800/400",
    createTime: "2024-08-28T09:00:00.000+08:00",
    updateTime: null,
    categoryId: 2,
    categoryName: "后端开发",
    viewsCount: 8834,
    likeCount: 472,
    tagDTOList: [
      { id: 3, tagName: "Java" }
    ]
  },
  {
    id: 9,
    articleTitle: "Nginx 反向代理与 HTTPS 配置全攻略",
    articleCover: "https://picsum.photos/seed/nginx/800/400",
    createTime: "2024-07-10T14:00:00.000+08:00",
    updateTime: null,
    categoryId: 3,
    categoryName: "运维部署",
    viewsCount: 5672,
    likeCount: 298,
    tagDTOList: [
      { id: 5, tagName: "Docker" }
    ]
  },
  {
    id: 10,
    articleTitle: "一个程序员的 2024 年终总结",
    articleCover: "https://picsum.photos/seed/year2024/800/400",
    createTime: "2024-12-31T23:00:00.000+08:00",
    updateTime: null,
    categoryId: 5,
    categoryName: "随笔",
    viewsCount: 2341,
    likeCount: 198,
    tagDTOList: [
      { id: 8, tagName: "随笔" }
    ]
  }
];

// ---------- 文章详情内容（Markdown） ----------
const articleContents = {
  1: `# Vue 3 Composition API 实战指南

Vue 3 带来了全新的 **Composition API**，彻底改变了逻辑复用和代码组织的方式。本文通过实际案例，深入讲解 Composition API 的核心概念与最佳实践。

## 为什么需要 Composition API？

在 Vue 2 中，Options API 将代码按选项类型（data、methods、computed）组织，当组件逻辑变得复杂时，相关代码会被分散在不同区域，难以维护。

\`\`\`javascript
// Vue 2 Options API 的痛点
export default {
  data() {
    return {
      userList: [],
      searchKeyword: '',
      currentPage: 1,
      // ... 更多数据
    }
  },
  methods: {
    fetchUsers() { /* ... */ },
    handleSearch() { /* ... */ },
    // ... 与 userList 无关的方法也混在这里
  }
}
\`\`\`

## 核心 API 详解

### ref 与 reactive

\`\`\`javascript
import { ref, reactive } from 'vue'

// ref：适合基础类型
const count = ref(0)
console.log(count.value) // 访问需要 .value

// reactive：适合对象
const state = reactive({
  name: '',
  age: 0
})
console.log(state.name) // 直接访问
\`\`\`

### computed 计算属性

\`\`\`javascript
import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(3)

const total = computed(() => price.value * quantity.value)
// total.value === 300
\`\`\`

### watchEffect 与 watch

\`\`\`javascript
import { ref, watchEffect, watch } from 'vue'

const userId = ref(1)

// watchEffect：自动追踪依赖
watchEffect(async () => {
  const user = await fetchUser(userId.value)
  console.log(user)
})

// watch：精确监听
watch(userId, (newId, oldId) => {
  console.log(\`从 \${oldId} 切换到 \${newId}\`)
})
\`\`\`

## 自定义 Composable

Composition API 真正的威力在于**逻辑复用**：

\`\`\`javascript
// useUserList.js
import { ref, onMounted } from 'vue'
import axios from 'axios'

export function useUserList() {
  const list = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchList() {
    loading.value = true
    try {
      const { data } = await axios.get('/api/users')
      list.value = data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchList)

  return { list, loading, error, fetchList }
}
\`\`\`

在组件中使用：

\`\`\`vue
<script setup>
import { useUserList } from '@/composables/useUserList'

const { list, loading, fetchList } = useUserList()
</script>

<template>
  <div v-if="loading">加载中...</div>
  <ul v-else>
    <li v-for="user in list" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
\`\`\`

## 总结

Composition API 不是对 Options API 的否定，而是一种补充。对于简单组件，Options API 依然简洁直观；对于复杂业务逻辑，Composition API 提供了更好的组织和复用能力。
`,

  2: `# Spring Boot 3.x 整合 JWT 鉴权详解

JWT（JSON Web Token）是目前最流行的无状态认证方案。本文带你从零开始，在 Spring Boot 3.x 项目中完整实现 JWT 鉴权。

## JWT 工作原理

\`\`\`
用户登录 → 服务端验证 → 签发 Token → 客户端存储
         ← 返回 Token  ←           ← 请求携带 Token
\`\`\`

JWT 由三部分组成：**Header.Payload.Signature**

## 添加依赖

\`\`\`xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
\`\`\`

## JWT 工具类

\`\`\`java
@Component
public class JwtUtils {

    @Value("\${jwt.secret}")
    private String secret;

    @Value("\${jwt.expiration:86400000}")
    private long expiration;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSecretKey())
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
\`\`\`

## 配置 Spring Security 过滤链

\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/login", "/api/register").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
\`\`\`

## 结语

JWT 方案的核心优势在于**无状态**，服务端无需存储 Session，天然支持水平扩展。但要注意 Token 的过期策略和刷新机制，避免安全漏洞。
`,

  3: `# Docker + GitHub Actions 自动化部署实践

手动部署既耗时又容易出错。本文教你用 Docker 容器化应用，再用 GitHub Actions 实现推送代码后自动构建、测试、部署的完整 CI/CD 流程。

## 准备工作

- 一台有公网 IP 的服务器（Ubuntu 22.04）
- Docker & Docker Compose 已安装
- GitHub 仓库

## 编写 Dockerfile

\`\`\`dockerfile
# 多阶段构建：构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
\`\`\`

## 编写 GitHub Actions Workflow

\`\`\`yaml
name: Deploy to Server

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: 构建 Docker 镜像
        run: docker build -t myapp:latest .

      - name: 推送到 Docker Hub
        env:
          DOCKER_TOKEN: \${{ secrets.DOCKER_TOKEN }}
        run: |
          echo "\$DOCKER_TOKEN" | docker login -u myuser --password-stdin
          docker tag myapp:latest myuser/myapp:latest
          docker push myuser/myapp:latest

      - name: SSH 到服务器部署
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: deploy
          key: \${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull myuser/myapp:latest
            docker stop myapp || true
            docker rm myapp || true
            docker run -d --name myapp -p 80:80 myuser/myapp:latest
\`\`\`

## 配置 Secrets

在 GitHub 仓库 Settings → Secrets 中添加：

| Key | Value |
|-----|-------|
| DOCKER_TOKEN | Docker Hub Access Token |
| SERVER_HOST | 服务器 IP |
| SSH_PRIVATE_KEY | SSH 私钥内容 |

## 验证

推送代码后，进入 Actions 页面即可查看部署进度，整个流程通常在 **2-3 分钟**内完成。

> **提示**：建议为部署用户单独创建受限账号，遵循最小权限原则。
`,

  4: `# JavaScript 异步编程：从回调地狱到 async/await

异步是 JavaScript 的核心特性之一，理解它的演进对于写出优雅、可维护的代码至关重要。

## 回调时代（Callback）

\`\`\`javascript
getUserById(1, function(user) {
  getPostsByUser(user.id, function(posts) {
    getCommentsByPost(posts[0].id, function(comments) {
      // 深度嵌套，难以阅读和错误处理
      console.log(comments)
    })
  })
})
\`\`\`

## Promise 的出现

\`\`\`javascript
getUserById(1)
  .then(user => getPostsByUser(user.id))
  .then(posts => getCommentsByPost(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error('出错了:', err))
\`\`\`

链式调用大大改善了可读性，并提供了统一的错误处理机制。

## Promise 并发控制

\`\`\`javascript
// 并行执行，等待所有完成
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
])

// 竞速：哪个先完成用哪个
const result = await Promise.race([
  fetchFromServer1(),
  fetchFromServer2()
])

// 无论成功失败都收集
const results = await Promise.allSettled([
  fetchA(),
  fetchB(),
  fetchC()
])
\`\`\`

## async/await：同步写法，异步执行

\`\`\`javascript
async function loadUserDashboard(userId) {
  try {
    const user = await getUserById(userId)
    const [posts, followers] = await Promise.all([
      getPostsByUser(user.id),
      getFollowers(user.id)
    ])
    return { user, posts, followers }
  } catch (err) {
    console.error('加载失败:', err)
    throw err
  }
}
\`\`\`

## 常见陷阱

\`\`\`javascript
// ❌ 错误：在循环中顺序等待，性能差
for (const id of ids) {
  const item = await fetchItem(id) // 串行执行
}

// ✅ 正确：并行执行
const items = await Promise.all(ids.map(id => fetchItem(id)))
\`\`\`

## 总结

| 方案 | 优点 | 缺点 |
|------|------|------|
| Callback | 简单直接 | 回调地狱，错误处理困难 |
| Promise | 链式调用，统一错误处理 | 调试堆栈不直观 |
| async/await | 同步风格，最易读 | 需要理解 Promise |

现代 JavaScript 开发推荐使用 **async/await**，配合 \`Promise.all\` 处理并发场景。
`,

  5: `# Redis 缓存穿透、击穿、雪崩解决方案

Redis 作为高性能缓存层，在高并发场景下保护数据库至关重要。但不当的使用会带来三大经典问题：**穿透、击穿、雪崩**。

## 缓存穿透

**现象**：查询一个**不存在的数据**，缓存和数据库都没有，每次都打到数据库。

**危害**：恶意攻击可以利用大量不存在的 Key 打垮数据库。

### 解决方案1：缓存空值

\`\`\`java
public Product getProduct(Long id) {
    String cacheKey = "product:" + id;
    String cached = redis.get(cacheKey);

    if (cached != null) {
        return "NULL".equals(cached) ? null : JSON.parse(cached, Product.class);
    }

    Product product = db.findById(id);
    if (product == null) {
        // 缓存空值，TTL 设短一些
        redis.setex(cacheKey, 60, "NULL");
    } else {
        redis.setex(cacheKey, 3600, JSON.toJson(product));
    }
    return product;
}
\`\`\`

### 解决方案2：布隆过滤器

\`\`\`java
// 项目启动时将所有合法 ID 加入布隆过滤器
bloomFilter.putAll(db.findAllIds());

public Product getProduct(Long id) {
    // 布隆过滤器判断不存在 → 直接返回
    if (!bloomFilter.mightContain(id)) {
        return null;
    }
    // 继续走缓存 → 数据库流程
    ...
}
\`\`\`

## 缓存击穿

**现象**：某个**热点 Key 过期**的瞬间，大量并发请求同时打到数据库。

### 解决方案：互斥锁

\`\`\`java
public Product getProduct(Long id) {
    String cacheKey = "product:" + id;
    Product product = redis.get(cacheKey);

    if (product == null) {
        String lockKey = "lock:product:" + id;
        // 尝试获取分布式锁
        boolean locked = redis.setnx(lockKey, "1", 10);
        if (locked) {
            try {
                product = db.findById(id);
                redis.setex(cacheKey, 3600, product);
            } finally {
                redis.del(lockKey);
            }
        } else {
            // 未抢到锁，短暂等待后重试
            Thread.sleep(50);
            return getProduct(id);
        }
    }
    return product;
}
\`\`\`

## 缓存雪崩

**现象**：大量缓存**同时过期**，或 Redis 宕机，导致请求全部打到数据库。

### 解决方案

\`\`\`java
// 1. TTL 加随机抖动，避免同时过期
int ttl = 3600 + RandomUtils.nextInt(0, 300);
redis.setex(key, ttl, value);

// 2. Redis 高可用：哨兵模式 / 集群
// 3. 熔断降级：使用 Hystrix 或 Resilience4j
\`\`\`

## 三者对比

| 问题 | 触发条件 | 核心方案 |
|------|---------|---------|
| 穿透 | 查询不存在的数据 | 布隆过滤器 / 缓存空值 |
| 击穿 | 热点 Key 过期瞬间 | 互斥锁 / 逻辑过期 |
| 雪崩 | 大量 Key 同时过期 | 随机 TTL / 高可用 |
`,

  6: `# 前端性能优化：Lighthouse 评分从 60 到 98

一次真实项目的性能优化之旅，记录分析方法和具体手段。

## 初始状态诊断

用 Chrome DevTools 的 Lighthouse 对项目首页进行审计，得到如下分数：

- Performance: **62**
- Accessibility: **74**
- Best Practices: **83**
- SEO: **79**

主要问题：

1. 首屏加载时间 **4.8s**（目标：<2.5s）
2. JavaScript bundle 体积 **2.3MB**
3. 图片未压缩，总计 **8.4MB**
4. 无 HTTP/2 推送，无 CDN

## 优化措施

### 1. 代码分割与懒加载

\`\`\`javascript
// 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue') // 按需加载
  }
]

// 组件懒加载
const HeavyChart = defineAsyncComponent({
  loader: () => import('@/components/HeavyChart.vue'),
  loadingComponent: LoadingSpinner
})
\`\`\`

### 2. 图片优化

\`\`\`html
<!-- 现代格式 + 懒加载 -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" loading="lazy" width="800" height="400" alt="...">
</picture>
\`\`\`

使用 \`sharp\` 批量转换图片格式：

\`\`\`javascript
const sharp = require('sharp')
// JPG → WebP，质量 80，体积减少约 60%
await sharp('input.jpg').webp({ quality: 80 }).toFile('output.webp')
\`\`\`

### 3. 关键 CSS 内联

\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite'
import { critters } from 'vite-plugin-critters'

export default defineConfig({
  plugins: [critters()] // 自动提取关键 CSS 并内联
})
\`\`\`

### 4. 缓存策略

\`\`\`nginx
# Nginx 缓存配置
location ~* \\.(js|css|png|jpg|webp|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
location /index.html {
    add_header Cache-Control "no-cache";
}
\`\`\`

## 优化结果

| 指标 | 优化前 | 优化后 |
|------|--------|--------|
| Performance | 62 | **98** |
| FCP | 3.2s | **0.8s** |
| LCP | 4.8s | **1.4s** |
| JS 体积 | 2.3MB | **340KB** |
| 图片总计 | 8.4MB | **1.2MB** |

> **核心原则**：不要过早优化，先测量找瓶颈，再针对性解决。
`,

  7: `# LRU 缓存算法实现与分析

LRU（Least Recently Used，最近最少使用）是最常见的缓存淘汰策略，也是面试高频考题。

## 什么是 LRU？

当缓存满时，淘汰**最久未被访问**的数据。

核心操作：
- **get(key)**：O(1) 时间复杂度查询
- **put(key, value)**：O(1) 时间复杂度插入/更新

## 实现思路：HashMap + 双向链表

\`\`\`
head <-> [最近使用] <-> ... <-> [最久未用] <-> tail
\`\`\`

- HashMap 保证 O(1) 查询
- 双向链表维护使用顺序
- 每次访问将节点移到链表头部
- 缓存满时删除链表尾部节点

## JavaScript 实现

\`\`\`javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map() // key → node
    // 哨兵节点，避免边界判断
    this.head = { prev: null, next: null }
    this.tail = { prev: null, next: null }
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  get(key) {
    if (!this.map.has(key)) return -1
    const node = this.map.get(key)
    this._moveToFront(node)
    return node.val
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key)
      node.val = value
      this._moveToFront(node)
    } else {
      const node = { key, val: value, prev: null, next: null }
      this.map.set(key, node)
      this._addToFront(node)
      if (this.map.size > this.capacity) {
        const lru = this.tail.prev
        this._remove(lru)
        this.map.delete(lru.key)
      }
    }
  }

  _addToFront(node) {
    node.prev = this.head
    node.next = this.head.next
    this.head.next.prev = node
    this.head.next = node
  }

  _remove(node) {
    node.prev.next = node.next
    node.next.prev = node.prev
  }

  _moveToFront(node) {
    this._remove(node)
    this._addToFront(node)
  }
}
\`\`\`

## 使用示例

\`\`\`javascript
const cache = new LRUCache(3)
cache.put(1, 'A')  // [1]
cache.put(2, 'B')  // [2, 1]
cache.put(3, 'C')  // [3, 2, 1]
cache.get(1)       // 'A'，顺序变为 [1, 3, 2]
cache.put(4, 'D')  // 淘汰2，[4, 1, 3]
cache.get(2)       // -1（已被淘汰）
\`\`\`

## Java 版本（LinkedHashMap 一行实现）

\`\`\`java
class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true); // accessOrder=true
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}
\`\`\`

LeetCode 146 题的标准解法，时间复杂度 O(1)。
`,

  8: `# MySQL 索引原理与 SQL 调优实战

数据库性能问题是后端开发中最常见的性能瓶颈，理解索引原理是解决这类问题的基础。

## B+ 树索引结构

MySQL InnoDB 引擎使用 **B+ 树**作为索引结构：

- 所有数据存储在**叶子节点**
- 叶子节点通过**双向链表**连接（支持范围查询）
- 非叶子节点只存储**键值和指针**（减少 IO 次数）

## 聚簇索引 vs 二级索引

\`\`\`sql
-- 聚簇索引（主键索引）：叶子节点存完整行数据
-- 二级索引：叶子节点存主键值 → 需要"回表"查询完整数据
CREATE INDEX idx_name ON users(name);

-- 覆盖索引：查询的列全在索引里，无需回表
SELECT id, name FROM users WHERE name = '张三'; -- 用了覆盖索引
SELECT * FROM users WHERE name = '张三';        -- 需要回表
\`\`\`

## 最左前缀原则

\`\`\`sql
-- 联合索引 (a, b, c)
SELECT * FROM t WHERE a = 1 AND b = 2;        -- ✅ 命中索引
SELECT * FROM t WHERE a = 1;                   -- ✅ 命中索引（部分）
SELECT * FROM t WHERE b = 2;                   -- ❌ 未命中（跳过了a）
SELECT * FROM t WHERE a = 1 AND c = 3;        -- ✅ 只用到a部分
\`\`\`

## EXPLAIN 分析执行计划

\`\`\`sql
EXPLAIN SELECT * FROM orders
WHERE user_id = 1001
ORDER BY create_time DESC
LIMIT 10;
\`\`\`

关注字段：
- **type**：ALL（全表扫描）→ 需优化；ref/eq_ref/const → 良好
- **key**：实际使用的索引
- **rows**：预估扫描行数
- **Extra**：Using filesort / Using temporary → 需优化

## 慢查询优化案例

\`\`\`sql
-- ❌ 优化前：3.2s
SELECT * FROM orders
WHERE DATE(create_time) = '2025-01-01'; -- 函数导致索引失效

-- ✅ 优化后：0.01s
SELECT * FROM orders
WHERE create_time >= '2025-01-01 00:00:00'
  AND create_time < '2025-01-02 00:00:00'; -- 范围查询，命中索引
\`\`\`

## 索引失效场景

| 场景 | 示例 |
|------|------|
| 列上使用函数 | \`WHERE YEAR(date) = 2025\` |
| 隐式类型转换 | \`WHERE phone = 13800138000\`（phone 是字符串）|
| LIKE 前缀通配 | \`WHERE name LIKE '%张'\` |
| OR 条件（无索引列）| \`WHERE id = 1 OR name = '张'\` |
| IS NOT NULL | 取决于数据分布 |
`,

  9: `# Nginx 反向代理与 HTTPS 配置全攻略

Nginx 是最流行的 Web 服务器和反向代理，本文涵盖常见的生产环境配置。

## 基础反向代理

\`\`\`nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

## Let's Encrypt 免费 HTTPS

\`\`\`bash
# 安装 Certbot
apt install certbot python3-certbot-nginx

# 申请证书（自动修改 Nginx 配置）
certbot --nginx -d example.com -d www.example.com

# 自动续期（添加到 crontab）
0 0 * * * certbot renew --quiet
\`\`\`

## 完整 HTTPS 配置

\`\`\`nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # 现代 TLS 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;
    gzip_min_length 1024;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        root /var/www;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# HTTP 强制跳转 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
\`\`\`

## 负载均衡配置

\`\`\`nginx
upstream backend {
    least_conn;  # 最少连接算法
    server 10.0.0.1:8080 weight=3;
    server 10.0.0.2:8080 weight=2;
    server 10.0.0.3:8080 backup; # 备用节点
}

server {
    location /api/ {
        proxy_pass http://backend;
    }
}
\`\`\`

> **提示**：生产环境务必配置 \`proxy_read_timeout\` 和 \`proxy_connect_timeout\`，避免长时间等待拖垮服务器。
`,

  10: `# 一个程序员的 2024 年终总结

2024 年就这样过去了，坐在工位上回望这一年，感慨颇多。

## 技术成长

今年最大的转变是从"写能跑的代码"到"写好维护的代码"的思维转变。

读了几本影响很深的书：
- 《代码整洁之道》—— 重新审视了自己写代码的习惯
- 《系统设计面试》—— 对分布式系统有了更系统的认知
- 《深入理解 Java 虚拟机》—— 终于搞懂了 GC 调优

今年上线了几个有意思的项目：
1. 公司内部的 **API 网关**，日均流量峰值 50w+，稳定运行
2. 这个**个人博客**，用来记录学习笔记
3. 一个小工具，帮团队节省了每天约 2 小时的重复工作

## 一些感悟

\`\`\`
好的代码 = 正确 + 可读 + 可维护
而不仅仅是 = 能跑
\`\`\`

写代码这件事，越深入越觉得敬畏。之前以为学完某个框架就算会了，现在明白框架只是工具，真正重要的是**理解背后的原理**和**解决问题的能力**。

## 2025 年计划

- 深入学习 **Rust**，探索系统编程
- 贡献一个开源项目（哪怕是文档修复）
- 坚持写博客，至少每月两篇
- 多做一些能帮助别人的小工具

生活不只有代码，但代码让生活更有趣。感谢看到这里的你，新的一年，共勉。🎉
`
};

// ---------- 博客信息 ----------
export const blogInfo = {
  viewsCount: 0,
  websiteName: "AllureBlog",
  github: "https://github.com/ygq12316",
  qq: "",
  weixin: "",
  email: "blog@example.com",
  intro: "分享技术，记录生活",
  createTime: "2024-01-01T00:00:00.000+08:00"
};

// ---------- 关于我（Markdown） ----------
export const aboutContent = `# 关于我

## 👋 你好，我是 AllureBlog 的作者

一名热爱技术的全栈开发者，专注于 **Java 后端** 和 **Vue 前端** 方向。

## 🛠 技术栈

**后端**
- Java / Spring Boot / Spring Cloud
- MySQL / Redis / Elasticsearch
- Docker / Kubernetes

**前端**
- Vue 2 / Vue 3 / TypeScript
- Webpack / Vite
- Vuetify / Element UI

## 📝 关于这个博客

这个博客使用 **Vue 2 + Spring Boot** 搭建，开源在 GitHub。

主要记录：
- 技术学习笔记
- 项目实战总结
- 生活随想

## 📮 联系我

- GitHub: [github.com/ygq12316](https://github.com/ygq12316)
- Email: blog@example.com

> *"Talk is cheap, show me the code."* — Linus Torvalds
`;

// ---------- 留言板弹幕 ----------
export const messages = [
  { id: 1, avatar: "https://i.pravatar.cc/40?img=1", msg: "博主写得很好，受益匪浅！", time: 1710000000000, type: 1 },
  { id: 2, avatar: "https://i.pravatar.cc/40?img=2", msg: "Vue3 那篇文章收藏了，讲得超详细", time: 1710086400000, type: 1 },
];

// ---------- 工具函数：构造通用响应 ----------
export function ok(data) {
  return { flag: true, code: 200, data };
}

// ---------- 工具函数：获取文章详情 ----------
export function getArticleDetail(articleId) {
  const id = parseInt(articleId);
  const article = articles.find(a => a.id === id);
  if (!article) return null;

  const allIds = articles.map(a => a.id).sort((a, b) => a - b);
  const idx = allIds.indexOf(id);
  const lastArticle = idx > 0
    ? { id: allIds[idx - 1], articleTitle: articles.find(a => a.id === allIds[idx - 1]).articleTitle }
    : null;
  const nextArticle = idx < allIds.length - 1
    ? { id: allIds[idx + 1], articleTitle: articles.find(a => a.id === allIds[idx + 1]).articleTitle }
    : null;
  const recommendIds = allIds.filter(i => i !== id).slice(0, 3);
  const articleRecommendList = recommendIds.map(i => {
    const a = articles.find(x => x.id === i);
    return { id: a.id, articleTitle: a.articleTitle, articleCover: a.articleCover };
  });

  return {
    ...article,
    articleContent: articleContents[id] || `# ${article.articleTitle}\n\n文章内容正在撰写中...`,
    lastArticle,
    nextArticle,
    articleRecommendList
  };
}
