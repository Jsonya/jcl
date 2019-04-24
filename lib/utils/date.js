
/**
 * 将传入的时间解析成符合要求的字符
 * @param {*} time
 * @param {*} format
 * @returns
 */
function formatTime(time, format) {
  const dateObj = time ? new Date(time) : new Date();
  const origin = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'h+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    S: dateObj.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (const item in origin) {
    if (new RegExp("(" + item + ")").test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (origin[item]) : (("00" + origin[item]).substr(("" + origin[item]).length)));
    }
  }
  return format;
}
module.exports = {
  formatTime,
}