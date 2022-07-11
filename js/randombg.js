//随机背景图片数组,图片可以换成图床链接，注意最后一条后面不要有逗号
var backimg = [
  "url(https://cdn1.tianli0.top/npm/jhxxr-cdn/tu/bj26.jpg)",
  "url(https://cdn1.tianli0.top/npm/jhxxr-cdn/tu/bj25.jpg)",
  "url(https://cdn1.tianli0.top/npm/jhxxr-cdn/tu/bj24.jpg)",
  "url(https://cdn1.tianli0.top/npm/jhxxr-cdn/tu/bj23.jpg)",
  "url(https://cdn1.tianli0.top/npm/jhxxr-cdn/tu/bj22.jpg)",
  "url(https://npm.elemecdn.com/jhxxr-cdn/tu/bj7.jpg)",
  "url(https://npm.elemecdn.com/jhxxr-cdn/tu/bj8.jpg)",
  "url(https://npm.elemecdn.com/jhxxr-cdn/tu/bj5.jpg)",
  "url(https://npm.elemecdn.com/jhxxr-cdn/tu/b1.jpg)",
  "url(https://npm.elemecdn.com/jhxxr-cdn/tu/b2.jpg)",
  "url(https://npm.elemecdn.com/jhxxr-cdn/tu/b3.jpg)",
  "url(https://npm.elemecdn.com/jhxxr-cdn/tu/b4.jpg)",
  "url(https://npm.elemecdn.com/jhxxr-cdn/tu/b5.jpg)"
];
//获取背景图片总数，生成随机数
var bgindex = Math.floor(Math.random() * backimg.length);
//重设背景图片
document.getElementById("web_bg").style.backgroundImage = backimg[bgindex];
//我坚持一图流！
document.getElementById("page-header").style.backgroundImage = backimg[bgindex];

/*
   //随机banner数组,图片可以换成图床链接，注意最后一条后面不要有逗号
  var bannerimg =[
    "url(https://npm.elemecdn.com/jhxxr-cdn@latest/tu/b1.jpg)",
    "url(https://npm.elemecdn.com/jhxxr-cdn@latest/tu/b2.jpg)",
    "url(https://npm.elemecdn.com/jhxxr-cdn@latest/tu/b3.jpg)",
    "url(https://npm.elemecdn.com/jhxxr-cdn@latest/tu/b4.jpg)",
    "url(https://npm.elemecdn.com/jhxxr-cdn@latest/tu/b5.jpg)",
    "url(https://npm.elemecdn.com/jhxxr-cdn@latest/tu/b6.jpg)"
  ];
  //获取banner图片总数，生成随机数
  var bannerindex =Math.floor(Math.random() * bannerimg.length);
  //重设banner图片
  document.getElementById("page-header").style.backgroundImage = bannerimg[bannerindex];

 */
