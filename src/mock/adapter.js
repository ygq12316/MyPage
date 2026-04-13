import {
  ok,
  blogInfo,
  articles,
  categories,
  tags,
  aboutContent,
  getArticleDetail
} from "./data";

const MESSAGE_STORAGE_KEY = "blog_messages_v2";
const VIEWS_STORAGE_KEY = "blog_views_count_v1";

function getStoredMessages() {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(MESSAGE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveStoredMessages(list) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // Ignore storage write errors in mock mode.
  }
}

function getNextViewsCount() {
  if (typeof window === "undefined" || !window.localStorage) {
    return blogInfo.viewsCount || 0;
  }

  try {
    const raw = window.localStorage.getItem(VIEWS_STORAGE_KEY);
    const current = raw == null ? (blogInfo.viewsCount || 0) : (parseInt(raw, 10) || 0);
    const next = current + 1;
    window.localStorage.setItem(VIEWS_STORAGE_KEY, String(next));
    return next;
  } catch (e) {
    return blogInfo.viewsCount || 0;
  }
}

function buildSearchResult(article) {
  const detail = getArticleDetail(article.id);
  const rawContent = detail?.articleContent || "";
  const summary = rawContent
    .replace(/[#>*`\\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);

  return {
    id: article.id,
    articleTitle: article.articleTitle,
    articleContent: summary
  };
}

function matchResponse(config) {
  const url = config.url || "";
  const params = config.params || {};
  const method = (config.method || "get").toLowerCase();

  if (/\/api\/messages/.test(url) && method === "post") {
    let payload = {};
    try {
      payload = typeof config.data === "string"
        ? JSON.parse(config.data)
        : (config.data || {});
    } catch (e) {
      payload = config.data || {};
    }

    const stored = getStoredMessages();
    const newMessage = {
      id: Date.now(),
      avatar: payload.avatar || "https://big-event20040810.oss-cn-beijing.aliyuncs.com/avatar/default.png",
      messageContent: String(payload.messageContent || "").trim(),
      nickname: payload.nickname || "游客",
      createTime: new Date().toISOString()
    };

    if (!newMessage.messageContent) {
      return { flag: false, code: 400, message: "Message content cannot be empty." };
    }

    stored.push(newMessage);
    saveStoredMessages(stored);
    return { flag: true, code: 200, message: "Message saved." };
  }

  if (method === "post") {
    return ok({ message: "Success (mock mode)." });
  }

  if (/^\/api\/?$/.test(url)) {
    return ok({
      ...blogInfo,
      viewsCount: getNextViewsCount()
    });
  }

  if (/\/api\/articles\/newest/.test(url)) {
    return ok(
      articles.slice(0, 5).map((a) => ({
        id: a.id,
        articleTitle: a.articleTitle
      }))
    );
  }

  if (/\/api\/articles\/search/.test(url)) {
    const keywords = String(params.keywords || "").trim().toLowerCase();
    if (!keywords) return ok([]);

    const result = articles
      .filter((article) => {
        const detail = getArticleDetail(article.id);
        const title = article.articleTitle.toLowerCase();
        const content = (detail?.articleContent || "").toLowerCase();
        return title.includes(keywords) || content.includes(keywords);
      })
      .slice(0, 20)
      .map(buildSearchResult);

    return ok(result);
  }

  if (/\/api\/articles\/archives/.test(url)) {
    const current = parseInt(params.current, 10) || 1;
    const pageSize = 10;
    const sorted = [...articles].sort(
      (a, b) => new Date(b.createTime) - new Date(a.createTime)
    );
    const start = (current - 1) * pageSize;
    const recordList = sorted.slice(start, start + pageSize).map((a) => ({
      id: a.id,
      articleTitle: a.articleTitle,
      createTime: a.createTime
    }));
    return ok({ recordList, count: articles.length });
  }

  const articleMatch = url.match(/\/api\/articles\/(\d+)$/);
  if (articleMatch) {
    const detail = getArticleDetail(articleMatch[1]);
    if (detail) return { flag: true, code: 200, data: detail };
    return { flag: false, code: 404, data: null };
  }

  if (/\/api\/tags$/.test(url)) {
    return ok({ recordList: tags, count: tags.length });
  }

  const tagMatch = url.match(/\/api\/tags\/(\d+)$/);
  if (tagMatch) {
    const tagId = parseInt(tagMatch[1], 10);
    const tag = tags.find((t) => t.id === tagId);
    const filtered = articles.filter((a) =>
      a.tagDTOList.some((t) => t.id === tagId)
    );
    const current = parseInt(params.current, 10) || 1;
    const pageSize = 10;
    const start = (current - 1) * pageSize;
    return ok({
      name: tag ? tag.tagName : "Unknown tag",
      articlePreviewDTOList: filtered.slice(start, start + pageSize)
    });
  }

  if (/\/api\/categories$/.test(url)) {
    return ok({ recordList: categories, count: categories.length });
  }

  const categoryMatch = url.match(/\/api\/categories\/(\d+)$/);
  if (categoryMatch) {
    const categoryId = parseInt(categoryMatch[1], 10);
    const category = categories.find((c) => c.id === categoryId);
    const filtered = articles.filter((a) => a.categoryId === categoryId);
    const current = parseInt(params.current, 10) || 1;
    const pageSize = 10;
    const start = (current - 1) * pageSize;
    return ok({
      name: category ? category.categoryName : "Unknown category",
      articlePreviewDTOList: filtered.slice(start, start + pageSize)
    });
  }

  if (/\/api\/about/.test(url)) {
    return ok(aboutContent);
  }

  if (/\/api\/comments/.test(url)) {
    return ok({ recordList: [], count: 0 });
  }

  if (/\/api\/messages/.test(url)) {
    return ok(getStoredMessages());
  }

  if (/\/api\/logout/.test(url)) {
    return { flag: true, code: 200, message: "Logout success." };
  }

  return {
    flag: false,
    code: 404,
    data: null,
    message: "Mock API route not implemented."
  };
}

export function installMockAdapter(axios) {
  axios.defaults.adapter = function mockAdapter(config) {
    return new Promise((resolve) => {
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
