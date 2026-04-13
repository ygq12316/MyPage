// ========================================================
// Mock Axios Adapter —— 拦截所有 HTTP 请求，返回静态数据
// 仅在 GitHub Pages 静态模式下启用
// ========================================================

import {
  ok,
  blogInfo,
  articles,
  categories,
  tags,
  messages,
  aboutContent,
  getArticleDetail
} from "./data";

/**
 * 根据 URL 匹配并返回对应的 mock 数据
 */
function matchResponse(config) {
  const url = config.url || "";
  const params = config.params || {};
  const method = (config.method || "get").toLowerCase();

  // POST 请求（点赞、留言等）— 统一返回成功
  if (method === "post") {
    return ok({ message: "操作成功（静态演示模式）" });
  }

  // GET /api/ 或 /api  —— 博客全局信息
  if (/^\/api\/?$/.test(url)) {
    return ok(blogInfo);
  }

  // GET /api/articles/newest  —— 最新文章（前5篇）
  if (/\/api\/articles\/newest/.test(url)) {
    return ok(articles.slice(0, 5).map(a => ({ id: a.id, articleTitle: a.articleTitle })));
  }

  // GET /api/articles/archives  —— 归档列表（分页）
  if (/\/api\/articles\/archives/.test(url)) {
    const current = parseInt(params.current) || 1;
    const pageSize = 10;
    const sorted = [...articles].sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    const start = (current - 1) * pageSize;
    const recordList = sorted.slice(start, start + pageSize).map(a => ({
      id: a.id,
      articleTitle: a.articleTitle,
      createTime: a.createTime
    }));
    return ok({ recordList, count: articles.length });
  }

  // GET /api/articles/:id  —— 文章详情（由路由路径拼成 /api/articles/1）
  const articleMatch = url.match(/\/api\/articles\/(\d+)$/);
  if (articleMatch) {
    const detail = getArticleDetail(articleMatch[1]);
    if (detail) return { flag: true, code: 200, data: detail };
    return { flag: false, code: 404, data: null };
  }

  // GET /api/tags  —— 标签列表
  if (/\/api\/tags$/.test(url)) {
    return ok({ recordList: tags, count: tags.length });
  }

  // GET /api/tags/:id  —— 标签下的文章列表（分页）
  const tagMatch = url.match(/\/api\/tags\/(\d+)$/);
  if (tagMatch) {
    const tagId = parseInt(tagMatch[1]);
    const tag = tags.find(t => t.id === tagId);
    const filtered = articles.filter(a => a.tagDTOList.some(t => t.id === tagId));
    const current = parseInt(params.current) || 1;
    const pageSize = 10;
    const start = (current - 1) * pageSize;
    return ok({
      name: tag ? tag.tagName : "未知标签",
      articlePreviewDTOList: filtered.slice(start, start + pageSize)
    });
  }

  // GET /api/categories  —— 分类列表
  if (/\/api\/categories$/.test(url)) {
    return ok({ recordList: categories, count: categories.length });
  }

  // GET /api/categories/:id  —— 分类下的文章列表（分页）
  const categoryMatch = url.match(/\/api\/categories\/(\d+)$/);
  if (categoryMatch) {
    const categoryId = parseInt(categoryMatch[1]);
    const category = categories.find(c => c.id === categoryId);
    const filtered = articles.filter(a => a.categoryId === categoryId);
    const current = parseInt(params.current) || 1;
    const pageSize = 10;
    const start = (current - 1) * pageSize;
    return ok({
      name: category ? category.categoryName : "未知分类",
      articlePreviewDTOList: filtered.slice(start, start + pageSize)
    });
  }

  // GET /api/about  —— 关于我
  if (/\/api\/about/.test(url)) {
    return ok(aboutContent);
  }

  // GET /api/comments  —— 评论列表（返回空）
  if (/\/api\/comments/.test(url)) {
    return ok({ recordList: [], count: 0 });
  }

  // GET /api/messages  —— 留言弹幕
  if (/\/api\/messages/.test(url)) {
    return ok(messages);
  }

  // GET /api/logout  —— 注销
  if (/\/api\/logout/.test(url)) {
    return { flag: true, code: 200, message: "注销成功" };
  }

  // 兜底：返回空数据
  return { flag: false, code: 404, data: null, message: "静态模式：接口未实现" };
}

/**
 * 安装 Mock Adapter
 * 替换 axios 默认的 XHR/HTTP adapter，使所有请求走本地数据
 */
export function installMockAdapter(axios) {
  axios.defaults.adapter = function mockAdapter(config) {
    return new Promise(resolve => {
      // 模拟网络延迟（50-150ms），让加载动画有机会显示
      const delay = 50 + Math.random() * 100;
      setTimeout(() => {
        const responseData = matchResponse(config);
        resolve({
          data: responseData,
          status: 200,
          statusText: "OK",
          headers: { "content-type": "application/json" },
          config,
          request: {}
        });
      }, delay);
    });
  };
}
