// ========================================================
// Mock Axios Adapter 鈥斺€?鎷︽埅鎵€鏈?HTTP 璇锋眰锛岃繑鍥為潤鎬佹暟鎹?// 浠呭湪 GitHub Pages 闈欐€佹ā寮忎笅鍚敤
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
 * 鏍规嵁 URL 鍖归厤骞惰繑鍥炲搴旂殑 mock 鏁版嵁
 */
function matchResponse(config) {
  const url = config.url || "";
  const params = config.params || {};
  const method = (config.method || "get").toLowerCase();

  // POST 璇锋眰锛堢偣璧炪€佺暀瑷€绛夛級鈥?缁熶竴杩斿洖鎴愬姛
  if (method === "post") {
    return ok({ message: "鎿嶄綔鎴愬姛锛堥潤鎬佹紨绀烘ā寮忥級" });
  }

  // GET /api/ 鎴?/api  鈥斺€?鍗氬鍏ㄥ眬淇℃伅
  if (/^\/api\/?$/.test(url)) {
    return ok(blogInfo);
  }

  // GET /api/articles/newest  鈥斺€?鏈€鏂版枃绔狅紙鍓?绡囷級
  if (/\/api\/articles\/newest/.test(url)) {
    return ok(articles.slice(0, 5).map(a => ({ id: a.id, articleTitle: a.articleTitle })));
  }

  if (/\/api\/articles\/search/.test(url)) {
    const keywords = String(params.keywords || "").trim().toLowerCase();
    if (!keywords) {
      return ok([]);
    }

    const result = articles
      .map(article => {
        const detail = getArticleDetail(article.id);
        const content = (detail?.articleContent || "").toLowerCase();
        const title = article.articleTitle.toLowerCase();
        const hit = title.includes(keywords) || content.includes(keywords);
        if (!hit) return null;

        const summary = (detail?.articleContent || "")
          .replace(/[#>*`\\-]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 180);

        return {
          id: article.id,
          articleTitle: article.articleTitle,
          articleContent: summary
        };
      })
      .filter(Boolean)
      .slice(0, 20);

    return ok(result);
  }

  // GET /api/articles/archives  鈥斺€?褰掓。鍒楄〃锛堝垎椤碉級
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

  // GET /api/articles/:id  鈥斺€?鏂囩珷璇︽儏锛堢敱璺敱璺緞鎷兼垚 /api/articles/1锛?  const articleMatch = url.match(/\/api\/articles\/(\d+)$/);
  if (articleMatch) {
    const detail = getArticleDetail(articleMatch[1]);
    if (detail) return { flag: true, code: 200, data: detail };
    return { flag: false, code: 404, data: null };
  }

  // GET /api/tags  鈥斺€?鏍囩鍒楄〃
  if (/\/api\/tags$/.test(url)) {
    return ok({ recordList: tags, count: tags.length });
  }

  // GET /api/tags/:id  鈥斺€?鏍囩涓嬬殑鏂囩珷鍒楄〃锛堝垎椤碉級
  const tagMatch = url.match(/\/api\/tags\/(\d+)$/);
  if (tagMatch) {
    const tagId = parseInt(tagMatch[1]);
    const tag = tags.find(t => t.id === tagId);
    const filtered = articles.filter(a => a.tagDTOList.some(t => t.id === tagId));
    const current = parseInt(params.current) || 1;
    const pageSize = 10;
    const start = (current - 1) * pageSize;
    return ok({
      name: tag ? tag.tagName : "鏈煡鏍囩",
      articlePreviewDTOList: filtered.slice(start, start + pageSize)
    });
  }

  // GET /api/categories  鈥斺€?鍒嗙被鍒楄〃
  if (/\/api\/categories$/.test(url)) {
    return ok({ recordList: categories, count: categories.length });
  }

  // GET /api/categories/:id  鈥斺€?鍒嗙被涓嬬殑鏂囩珷鍒楄〃锛堝垎椤碉級
  const categoryMatch = url.match(/\/api\/categories\/(\d+)$/);
  if (categoryMatch) {
    const categoryId = parseInt(categoryMatch[1]);
    const category = categories.find(c => c.id === categoryId);
    const filtered = articles.filter(a => a.categoryId === categoryId);
    const current = parseInt(params.current) || 1;
    const pageSize = 10;
    const start = (current - 1) * pageSize;
    return ok({
      name: category ? category.categoryName : "鏈煡鍒嗙被",
      articlePreviewDTOList: filtered.slice(start, start + pageSize)
    });
  }

  // GET /api/about  鈥斺€?鍏充簬鎴?  if (/\/api\/about/.test(url)) {
    return ok(aboutContent);
  }

  // GET /api/comments  鈥斺€?璇勮鍒楄〃锛堣繑鍥炵┖锛?  if (/\/api\/comments/.test(url)) {
    return ok({ recordList: [], count: 0 });
  }

  // GET /api/messages  鈥斺€?鐣欒█寮瑰箷
  if (/\/api\/messages/.test(url)) {
    return ok(messages);
  }

  // GET /api/logout  鈥斺€?娉ㄩ攢
  if (/\/api\/logout/.test(url)) {
    return { flag: true, code: 200, message: "娉ㄩ攢鎴愬姛" };
  }

  // 鍏滃簳锛氳繑鍥炵┖鏁版嵁
  return { flag: false, code: 404, data: null, message: "闈欐€佹ā寮忥細鎺ュ彛鏈疄鐜? };
}

/**
 * 瀹夎 Mock Adapter
 * 鏇挎崲 axios 榛樿鐨?XHR/HTTP adapter锛屼娇鎵€鏈夎姹傝蛋鏈湴鏁版嵁
 */
export function installMockAdapter(axios) {
  axios.defaults.adapter = function mockAdapter(config) {
    return new Promise(resolve => {
      // 妯℃嫙缃戠粶寤惰繜锛?0-150ms锛夛紝璁╁姞杞藉姩鐢绘湁鏈轰細鏄剧ず
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

