// live2d_path 参数建议使用绝对路径
const live2d_path =
  "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/";

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;

    if (type === "css") {
      tag = document.createElement("link");
      tag.rel = "stylesheet";
      tag.href = url;
    } else if (type === "js") {
      tag = document.createElement("script");
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

// 加载 waifu.css live2d.min.js waifu-tips.js
if (screen.width >= 768) {
  Promise.all([
    loadExternalResource(live2d_path + "waifu.css", "css"),
    loadExternalResource(live2d_path + "live2d.min.js", "js"),
    loadExternalResource(live2d_path + "waifu-tips.js", "js")
  ]).then(() => {
    // 配置看板娘
    initWidget({
      waifuPath: live2d_path + "waifu-tips.json",
      apiPath: "https://live2d.fghrsh.net/api/",
      cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/",
      tools: [
        "hitokoto",
        "switch-model",
        "switch-texture",
        "photo",
        "info",
        "quit"
      ],
      display: {
        position: "right",
        width: 280,
        height: 250,
        hOffset: 0,
        vOffset: -50 // 使用负值将位置向上移动到中间
      },
      model: {
        scale: 1,
        hHeadPos: 0.5,
        vHeadPos: 0.618
      },
      react: {
        opacity: 0.8
      },
      mobile: {
        show: true,
        scale: 0.8
      }
    });

    // 强制设置位置
    setTimeout(() => {
      const waifu = document.querySelector("#waifu");
      if (waifu) {
        waifu.style.right = "20px";
        waifu.style.left = "auto";
        waifu.style.top = "50%";
        waifu.style.bottom = "auto";
        waifu.style.transform = "translateY(-50%)";
      }
    }, 100);
  });
}

console.log("Live2D 看板娘已启动");
