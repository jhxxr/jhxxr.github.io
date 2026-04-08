/**
 * @name ScoAI Local
 * @description 本地模式的文章摘要显示（从 Front Matter 读取）
 * @version 2.0.0
 * @author Modified for local mode
 * @license GNU General Public License v3.0
 */

var ScoAI = {
  aiTalkMode: false,
  aiPostExplanation: "",
  config: GLOBAL_CONFIG.ai,

  init() {
    this.scoGPTIsRunning = false;
    this.generate();
    this.AIEngine();
  },

  /**
   * 从页面配置中获取摘要（由 Hexo 模板注入）
   */
  getLocalSummary() {
    // 摘要会通过 Pug 模板注入到 GLOBAL_CONFIG.ai.summary 中
    if (this.config && this.config.summary) {
      return Promise.resolve(this.config.summary);
    }
    return Promise.resolve("暂无摘要");
  },

  /**
   * 生成摘要显示
   */
  generate() {
    this.aiShowAnimation(this.getLocalSummary());
  },

  /**
   * AI 动画显示
   * @param {Promise} summaryPromise - 返回摘要文本的 Promise
   * @param {boolean} showSuggestions - 是否显示建议按钮
   */
  aiShowAnimation(summaryPromise, showSuggestions = false) {
    const explanationElement = document.querySelector(".ai-explanation");
    const tagElement = document.querySelector(".ai-tag");

    if (!explanationElement || this.scoGPTIsRunning) {
      return;
    }

    this.scoGPTIsRunning = true;
    this.cleanSuggestions();

    // 添加加载动画
    tagElement.classList.add("loadingAI");
    explanationElement.style.display = "block";
    explanationElement.innerHTML = '加载中...<span class="blinking-cursor"></span>';

    let lastFrameTime;
    let animationFrame;
    let isVisible = true;
    let charIndex = 0;
    let initialDelay = true;

    // 使用 IntersectionObserver 监听元素可见性
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) {
        requestAnimationFrame(animationFrame);
      }
    }, { threshold: 0 });

    summaryPromise.then((text) => {
      this.aiPostExplanation = text;
      lastFrameTime = performance.now();

      // 打字机效果动画帧
      animationFrame = () => {
        if (charIndex < text.length && isVisible) {
          const currentTime = performance.now();
          const elapsed = currentTime - lastFrameTime;

          const currentChar = text.slice(charIndex, charIndex + 1);
          const isPunctuation = /[，。！、？,.!?]/.test(currentChar);
          const isAlphaNumeric = /[a-zA-Z0-9]/.test(currentChar);

          // 计算延迟时间
          const delay = isPunctuation
            ? Math.random() * 100 + 100 // 标点符号：100-200ms
            : isAlphaNumeric
              ? 10  // 字母数字：10ms
              : 25; // 其他字符：25ms

          if (elapsed >= delay) {
            explanationElement.innerText = text.slice(0, charIndex + 1);
            lastFrameTime = currentTime;
            charIndex++;

            // 添加闪烁光标
            if (charIndex < text.length) {
              explanationElement.innerHTML = text.slice(0, charIndex) + '<span class="blinking-cursor"></span>';
            } else {
              // 动画完成
              explanationElement.innerHTML = text;
              explanationElement.style.display = "block";
              this.scoGPTIsRunning = false;
              tagElement.classList.remove("loadingAI");
              observer.disconnect();

              // 如果需要，创建建议按钮
              if (showSuggestions) {
                this.createSuggestions();
              }
            }
          }

          if (isVisible) {
            requestAnimationFrame(animationFrame);
          }
        }
      };

      // 初始延迟后开始动画
      if (isVisible && initialDelay) {
        setTimeout(() => {
          requestAnimationFrame(animationFrame);
          initialDelay = false;
        }, 3000); // 3秒初始延迟
      }

      observer.observe(explanationElement);
    }).catch((error) => {
      console.error("获取摘要失败：", error);
      explanationElement.innerHTML = "暂无摘要";
      explanationElement.style.display = "block";
      this.scoGPTIsRunning = false;
      tagElement.classList.remove("loadingAI");
      observer.disconnect();
    });
  },

  /**
   * AI 标签点击事件处理
   */
  AIEngine() {
    const aiTag = document.querySelector(".ai-tag");
    if (aiTag) {
      aiTag.addEventListener("click", () => {
        if (!this.scoGPTIsRunning) {
          this.aiTalkMode = true;
          this.aiShowAnimation(Promise.resolve(this.config.talk), true);
        }
      });
    }
  },

  /**
   * 清除建议按钮
   */
  cleanSuggestions() {
    const suggestionsElement = document.querySelector(".ai-suggestions");
    if (suggestionsElement) {
      suggestionsElement.innerHTML = "";
    } else {
      console.error("没有找到 .ai-suggestions 元素");
    }
  },

  /**
   * 创建建议按钮
   */
  createSuggestions() {
    if (this.aiTalkMode) {
      this.cleanSuggestions();
    }

    // 添加"这篇文章讲了什么？"按钮
    this.createSuggestionItemWithAction("这篇文章讲了什么？", () => {
      this.aiShowAnimation(Promise.resolve(this.aiPostExplanation), true);
    });

    // 如果启用了随机文章，添加按钮
    if (this.config.randomPost) {
      this.createSuggestionItemWithAction("带我去看看其他文章", () => {
        toRandomPost();
      });
    }

    this.aiTalkMode = true;
  },

  /**
   * 创建单个建议按钮
   * @param {string} text - 按钮文本
   * @param {Function} action - 点击回调
   */
  createSuggestionItemWithAction(text, action) {
    const suggestionsElement = document.querySelector(".ai-suggestions");
    if (!suggestionsElement) {
      console.error("无法找到具有 class 为 ai-suggestions 的元素");
      return;
    }

    const item = document.createElement("div");
    item.classList.add("ai-suggestions-item");
    item.textContent = text;
    item.addEventListener("click", action);
    suggestionsElement.appendChild(item);
  }
};

console.log(
  "%c🤖 ScoAI Local Mode | Solitude 主题 - 本地摘要模式",
  "color: #fff; background: linear-gradient(-25deg, #a8edea, #fed6e3); padding: 8px 15px; border-radius: 8px; text-shadow: 2px 2px 4px white; color: black;"
);

// 页面加载完成后自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ScoAI.init();
  });
} else {
  // DOM 已经加载完成
  ScoAI.init();
}
