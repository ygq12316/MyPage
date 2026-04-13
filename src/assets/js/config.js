export default {
  // QQ登录应用ID，请替换为您自己的应用ID
  QQ_APP_ID: "YOUR_QQ_APP_ID",
  // QQ登录回调地址
  QQ_REDIRECT_URI: "YOUR_QQ_REDIRECT_URI",
  // 微博登录应用ID，请替换为您自己的应用ID
  WEIBO_APP_ID: "YOUR_WEIBO_APP_ID",
  // 微博登录回调地址，根据环境区分开发和生产环境
  WEIBO_REDIRECT_URI: process.env.NODE_ENV === 'development' 
    ? "http://localhost:8080/oauth/login/weibo" 
    : "YOUR_PRODUCTION_WEIBO_REDIRECT_URI",
  // GitHub登录应用ID，请替换为您自己的应用ID
  GITHUB_APP_ID: "YOUR_GITHUB_APP_ID",
  // GitHub登录回调地址，根据环境区分开发和生产环境
  GITHUB_REDIRECT_URI: process.env.NODE_ENV === 'development' 
    ? "http://localhost:8080/oauth/login/github" 
    : "YOUR_PRODUCTION_GITHUB_REDIRECT_URI",
  // 腾讯验证码应用ID，请替换为您自己的应用ID
  TENCENT_CAPTCHA: "YOUR_TENCENT_CAPTCHA_ID",
  // 聊天室开关（默认关闭）
  CHAT_ROOM_ENABLED: false
};
