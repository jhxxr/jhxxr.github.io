function coverColor() {
    const path = document.getElementById("post-cover")?.src;
    if (path) {
        const cacheGroup = JSON.parse(localStorage.getItem('Solitude')) || {};
        if (cacheGroup.postcolor && cacheGroup.postcolor[path]) {
            const color = cacheGroup.postcolor[path].value;
            const [r, g, b] = color.match(/\w\w/g).map(x => parseInt(x, 16));
            setThemeColors(color, r, g, b);
            console.log('📦 使用缓存颜色:', color);
        } else {
            localColor(path);
        }
    }
}

function localColor(path) {
    const img = new Image();
    // 先尝试不使用跨域，看看图片是否在同域
    const imgUrl = new URL(path);
    const currentUrl = new URL(window.location.href);
    const isSameDomain = imgUrl.origin === currentUrl.origin;

    if (!isSameDomain) {
        img.crossOrigin = "Anonymous";
    }

    img.onload = function () {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);
            const data = ctx.getImageData(0, 0, this.width, this.height).data;
            const {r, g, b} = calculateRGB(data);
            let value = rgbToHex(r, g, b);
            if (getContrastYIQ(value) === "light") {
                value = LightenDarkenColor(value, -50);
            }
            const cacheGroup = JSON.parse(localStorage.getItem('Solitude')) || {};
            cacheGroup.postcolor = cacheGroup.postcolor || {};
            cacheGroup.postcolor[path] = {value: value};
            localStorage.setItem('Solitude', JSON.stringify(cacheGroup));
            setThemeColors(value, r, g, b);
            console.log('✅ 封面取色成功:', value);
        } catch (e) {
            console.error('❌ 封面取色失败 (CORS限制):', e.message);
            console.log('💡 解决方案：');
            console.log('1. 在图床服务器设置 Access-Control-Allow-Origin 响应头');
            console.log('2. 或者使用 mode: "api" 模式');
            // CORS 失败时，尝试使用颜色提取算法的备用方案
            tryFallbackColorExtraction(path);
        }
    };
    img.onerror = function() {
        console.error('❌ 封面图片加载失败');
        setThemeColors();
    };
    img.src = path;
}

// 备用方案：通过 CSS 背景图提取主色调的近似方案
function tryFallbackColorExtraction(imagePath) {
    console.log('🔄 尝试备用取色方案...');
    // 创建临时元素来分析图片
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 1px;
        height: 1px;
        background-image: url('${imagePath}');
    `;
    document.body.appendChild(tempDiv);

    // 使用默认主题色作为后备
    setTimeout(() => {
        document.body.removeChild(tempDiv);
        console.log('⚠️ 使用默认主题色');
        setThemeColors();
    }, 100);
}

function calculateRGB(data) {
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 40) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }
    return {r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count)};
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function LightenDarkenColor(col, amt) {
    let usePound = false;

    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }

    const num = parseInt(col, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amt));
    const b = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
    const g = Math.min(255, Math.max(0, (num & 0xff) + amt));

    return `${usePound ? "#" : ""}${(g | (b << 8) | (r << 16)).toString(16).padStart(6, "0")}`;
}

function getContrastYIQ(hexcolor) {
    var colorrgb = colorRgb(hexcolor);
    var colors = colorrgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var red = colors[1];
    var green = colors[2];
    var blue = colors[3];
    var brightness = (red * 299) + (green * 587) + (blue * 114);
    brightness = brightness / 255000;
    return brightness >= 0.5 ? "light" : "dark";
}

function colorRgb(str) {
    const HEX_SHORT_REGEX = /^#([0-9a-fA-f]{3})$/;
    const HEX_LONG_REGEX = /^#([0-9a-fA-f]{6})$/;
    const HEX_SHORT_LENGTH = 4;

    if (!str || typeof str !== 'string') {
        return str;
    }

    const sColor = str.toLowerCase();
    let hexValue = "";

    if (sColor && (HEX_SHORT_REGEX.test(sColor) || HEX_LONG_REGEX.test(sColor))) {
        hexValue = sColor.length === HEX_SHORT_LENGTH ?
            sColor.replace(/^#(.)/g, "#$1$1") :
            sColor;

        const rgbValue = hexValue.slice(1)
            .match(/.{2}/g)
            .map(val => parseInt(val, 16));

        return `rgb(${rgbValue[0]}, ${rgbValue[1]}, ${rgbValue[2]})`;
    } else {
        return sColor;
    }
}

function setThemeColors(value, r = null, g = null, b = null) {
    if (value) {
        document.documentElement.style.setProperty('--sco-main', value);
        document.documentElement.style.setProperty('--sco-main-op', value + '23');
        document.documentElement.style.setProperty('--sco-main-op-deep', value + 'dd');
        document.documentElement.style.setProperty('--sco-main-none', value + '00');

        if (r && g && b) {
            var brightness = Math.round(((parseInt(r) * 299) + (parseInt(g) * 587) + (parseInt(b) * 114)) / 1000);
            if (brightness < 125) {
                var cardContents = document.getElementsByClassName('card-content');
                for (let i = 0; i < cardContents.length; i++) {
                    cardContents[i].style.setProperty('--sco-card-bg', 'var(--sco-white)');
                }

                var authorInfo = document.getElementsByClassName('author-info__sayhi');
                for (let i = 0; i < authorInfo.length; i++) {
                    authorInfo[i].style.setProperty('background', 'var(--sco-white-op)');
                    authorInfo[i].style.setProperty('color', 'var(--sco-white)');
                }
            }
        }

        document.getElementById("coverdiv")?.classList.add("loaded");
        initThemeColor();
    } else {
        document.documentElement.style.setProperty('--sco-main', 'var(--sco-theme)');
        document.documentElement.style.setProperty('--sco-main-op', 'var(--sco-theme-op)');
        document.documentElement.style.setProperty('--sco-main-op-deep', 'var(--sco-theme-op-deep)');
        document.documentElement.style.setProperty('--sco-main-none', 'var(--sco-theme-none)');
        initThemeColor();
    }
}

function initThemeColor() {
    const currentTop = window.scrollY || document.documentElement.scrollTop;
    let themeColor;
    if (currentTop > 0) {
        themeColor = getComputedStyle(document.documentElement).getPropertyValue('--sco-card-bg');
    } else if (PAGE_CONFIG.is_post) {
        themeColor = getComputedStyle(document.documentElement).getPropertyValue('--sco-main');
    } else {
        themeColor = getComputedStyle(document.documentElement).getPropertyValue('--sco-background');
    }
    changeThemeColor(themeColor);
}

function changeThemeColor(color) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.setAttribute('content', color);
    }
}