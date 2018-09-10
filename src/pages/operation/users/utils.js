// 这可能就是个坑吧

// 倍数
const multiple = 1000;

// 标准BMI
// 男女通用
export function verdictBMI(BMI) {
  if (typeof BMI !== 'number' && typeof BMI !== 'string') return false;
  const min = 18.5;
  const max = 24;
  return BMI < min ? '偏低' : BMI >= min && BMI < max ? '正常' : '偏高'
}

// 标准体重(对比身高)  标准体重±10%
// 男性：(身高cm－80)×70﹪=标准体重 
// 女性：(身高cm－70)×60﹪=标准体重
export function verdictWeight(height, weight, sex='男') {
  if (typeof height !== 'number' && typeof height !== 'string') return false;
  if (typeof weight !== 'number' && typeof weight !== 'string') return false;
  if (sex !== '男' && sex !== '女') return false; 
  if (parseFloat(height) < 50) return false;
  height = parseFloat(height);
  weight = parseFloat(weight);
  let standard,max,min;
  if (sex === '男') {
    standard =parseFloat((((height * multiple - 80 * multiple) / multiple) * 0.7).toFixed(1));
    max = (standard + (standard * 0.1)).toFixed(1);
    min = (standard - (standard * 0.1)).toFixed(1);
  }
  if (sex === '女') {
    standard = parseFloat((((height * multiple - 70 * multiple) / multiple) * 0.6).toFixed(1));
    max = (standard + (standard * 0.1)).toFixed(1);
    min = (standard - (standard * 0.1)).toFixed(1);
  }
  return weight < min ? '偏低' : weight >= min && weight <= max ? '正常' : '偏高'
}

// 标准体脂率 
// 男[10% , 20%]
// 女[15% , 25%]
export function verdictPercentBodyfat(percentBodyfat, sex='男') {
  if (typeof percentBodyfat !== 'number' && typeof height !== 'string') return false;
  if (sex !== '男' && sex !== '女') return false; 
  percentBodyfat = parseFloat(percentBodyfat);
  let min, max;
  if (sex === '男') {
    min = 10;
    max = 20;
  }
  if (sex === '女') {
    min = 15;
    max = 25;
  }
  return percentBodyfat < min ? '偏低' : percentBodyfat >= min && percentBodyfat <= max ? '正常' : '偏高'
}

// 水分率 对比体重
// 男[23.43/体重+0.206，24.884/体重+0.220]
// 女[20.16/体重+0.174，22.974/体重+0.199]
export function verdictFluid(fluid, weight, sex='男') {
  if (typeof fluid !== 'number' && typeof fluid !== 'string') return false;
  if (typeof weight !== 'number' && typeof weight !== 'string') return false;
  if (sex !== '男' && sex !== '女') return false;
  fluid = parseFloat(fluid);
  weight = parseFloat(weight);
  let min, max;
  if (sex === '男') {
    min = ( (23.43 / weight).toFixed(3) * multiple + 206 ) / multiple
    max = ( (24.884 / weight).toFixed(3) * multiple + 220 ) / multiple;
  }
  if (sex === '女') {
    min = ( (20.16 / weight).toFixed(3) * multiple + 174 ) / multiple
    max = ( (22.974 / weight).toFixed(3) * multiple + 199 ) / multiple;
  }
  return fluid < min ? '偏低' : fluid >= min && fluid <= max ? '正常' : '偏高'
}

// 腰臀比
// 男 小于0.9 
// 女 小于0.8
export function verdictWaistToHip(waistToHip, sex='男') {
  if (typeof waistToHip !== 'number' && typeof waistToHip !== 'string') return false;
  if (sex !== '男' && sex !== '女') return false;
  waistToHip = parseFloat(waistToHip);
  let max;
  if (sex === '男') {
    max = 0.9
  }
  if (sex === '女') {
    max = 0.8
  }
  return waistToHip < max ? '正常' : '偏高'
}

// 肌肉含量
// 男 [体重*73%，体重*81%]
// 女 [体重*69%，体重*78%]
export function verdictMuscle(muscle, weight, sex='男') {
  if (typeof muscle !== 'number' && typeof muscle !== 'string') return false;
  if (typeof weight !== 'number' && typeof weight !== 'string') return false;
  if (sex !== '男' && sex !== '女') return false;
  muscle = parseFloat(muscle);
  weight = parseFloat(weight);
  let min, max;
  if (sex === '男') {
    min = weight * 0.73;
    max = weight * 0.81;
  }
  if (sex === '女') {
    min = weight * 0.69;
    max = weight * 0.78;
  }
  return muscle < min ? '偏低' : muscle >= min && muscle <= max ? '正常' : '偏高'
}