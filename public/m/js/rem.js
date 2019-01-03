HtmlFontSize();
function HtmlFontSize (){
// 假设设计稿为750
var designWidth = 750 ;
// 假设设计稿根元素大小 200
var desiginFontSize = 200;
// 获取当前屏幕宽度
var windowWidth = document.documentElement.offsetWidth;
// 计算当前屏幕的根元素大小
var nowFontSize = windowWidth / (designWidth/desiginFontSize);
// 设置根元素
document.documentElement.style.fontSize = nowFontSize+'px';

}
window.addEventListener('resize',HtmlFontSize);