import md5 from 'md5';

const KEY = '4AQMK7mGy';

/**
 * @method createSign 生成签名 sign
 * 
 * @param {Object} obj 
 * 
 * @return {String} mad5后的sign
 * 
 * {a:1, b:2} --> {a:1, b:2, sign: "xxx"}
 */
function createSign(obj) {
  if (!obj) {
    return {
      sign: md5(KEY)
    }
  }
  let keys = Object.keys(obj);
  let arr = keys.map((item, index) => {
    return item + '=' + obj[item]
  });
  const sign = arr.join("&") + KEY;
  obj.sign = md5(sign);
  return obj;
}

export {
  createSign
}