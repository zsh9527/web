/**
 * 将js的时间类型转化为字符串形式
 * @param {any} date Date类型参数
 */
Date.format = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].join("-") + " " + [hour, minute, second].join(":");
};

/**
 * 将js的时间类型转化为后端可以接受的LocalDateTime字符串形式
 */
Date.formatToLocalDateTime = date => {
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  let second = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + "T" + h + ":" + minute + ":" + second;
};

/**
 * 将js的时间类型转化为前端展示的LocalDateTime字符串形式
 */
Date.formatDate = date => {
  return Date.formatToLocalDateTime(date).replace("T", " ")
};
