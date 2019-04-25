
/**
 * 将传入的时间解析成符合要求的字符
 * @param {*} time
 * @param {*} format
 * @returns
 */
function formatTime(time, format) {
  let formatStr = format;
  const dateObj = time ? new Date(time) : new Date();
  const origin = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'h+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    S: dateObj.getMilliseconds(),
  };
  if (/(y+)/.test(formatStr)) {
    const year = String(dateObj.getFullYear());
    formatStr = format.replace(RegExp.$1, year.substr(4 - RegExp.$1.length));
  }
  for (const item of Object.keys(origin)) {
    const value = String(origin[item]);
    const replaceValue = RegExp.$1.length === 1 ? value : `00${value}`.substr(value.length);
    if (new RegExp(`(${item})`).test(formatStr)) {
      formatStr = formatStr.replace(RegExp.$1, replaceValue);
    }
  }
  return formatStr;
}
module.exports = {
  formatTime,
};
