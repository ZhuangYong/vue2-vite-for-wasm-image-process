/**
 * 处理图层
 * @param lowerData
 * @param upperData
 * @param method
 * @param alpha
 * @param dx
 * @param dy
 * @param isFast isFast用于快速，适用于中间处理
 * @param channel
 * @returns {*}
 */
export function add(lowerData, upperData, method, alpha, dx, dy, isFast, channel){
  const l = lowerData.data
  const u = upperData.data

    dx = dx || 0
    dy = dy || 0
    alpha = alpha || 1//alpha 范围为0 - 100
    isFast = isFast || false
    channel = channel || "RGB"

  if(!(/[RGB]+/.test(channel))){
    channel = "RGB";
  }

  let channelString = channel.replace("R","0").replace("G","1").replace("B","2"),
    jump = 1,
    result,
    width = lowerData.width,
    height = lowerData.height,
    upperLength = u.length,
    upperWidth = upperData.width,
    upperHeight = upperData.height,

    indexOfArr = [
      channelString.indexOf("0") > -1,
      channelString.indexOf("1") > -1,
      channelString.indexOf("2") > -1
    ],
    everyJump = 4 * jump;

  /*
if(isFast){
jump = 1;
}
*/

  let ii, row, col, uRow, uCol, uIi, uI;

  //计算重叠部分x ,y范围
  let xMin, yMin, xMax, yMax;

  let uXMin = dx;
  let uXMax = dx + upperWidth;
  let uYMin = dy;
  let uYMax = dy + upperHeight;

  if(uXMin > width){
    return;
  }else if(uXMin < 0){
    uXMin = 0;
  }

  if(uXMax < 0){
    return;
  }else if(uXMax > width){
    uXMax = width;
  }

  if(uYMin > height){
    return;
  }else if(uYMin < 0){
    uYMin = 0;
  }

  if(uYMax < 0){
    return;
  }else if(uYMax > height){
    uYMax = height;
  }


  let currRow, upperY, upperRow;
  for(let y = uYMin; y < uYMax; y ++){
    currRow = y * width;
    upperY = y - dy;
    upperRow = upperY * upperWidth;

    for(let x = uXMin; x < uXMax; x ++){
      //计算此时对应的upperX,Y
      const upperX = x - dx;

      //计算此时的i
      const i = (currRow + x) * 4;

      //计算此时的upperI
      const uI = (upperRow + upperX) * 4;

      //for(var i = 0, n = l.length; i < n; i += everyJump){

      //ii = i / 4;

      //得到当前点的坐标 y分量
      //row = ~~(ii / width);
      //col = ii % width;

      //uRow = row - dy;
      //uCol = col - dx;

      //uIi = uRow * upperWidth + uCol;
      //uI = uIi * 4;

      //if(uI >= 0 && uI < (upperLength - 4) && uCol < upperWidth && uCol >= 0){

      //l[i + 3] = u[uI + 3];//透明度
      for(let j = 0; j < 3; j ++){

        //若此点透明则不计算
        if(u[uI + 3] === 0) break;
        else l[i + 3] = u[uI + 3];

        switch(method){
          case "颜色减淡" :
            if(indexOfArr[j]){
              result = l[i + j] + (l[i + j] * u[uI + j]) / (255 - u[uI + j]);
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "变暗":
            if(indexOfArr[j]){
              result = l[i + j] < u[uI + j] ? l[i + j] : u[uI + j];
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "变亮":
            if(indexOfArr[j]){
              result = l[i + j] > u[uI + j] ? l[i + j] : u[uI + j];
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "正片叠底":
            if(indexOfArr[j]){
              result = ~~((l[i + j] * u[uI + j]) / 255);
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "滤色" :
            if(indexOfArr[j]){
              result = ~~(255 - (255 - l[i + j]) * (255 - u[uI + j]) / 255);
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "叠加":
            if(indexOfArr[j]){
              if(l[i + j] <= 127.5){
                result = l[i + j] * u[uI + j] / 127.5;
              }else{
                result = 255 - (255 - l[i + j]) * (255 - u[uI + j]) / 127.5;
              }
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "强光":
            if(indexOfArr[j]){
              if(u[uI + j] <= 127.5){
                result = l[i + j] * u[uI + j] / 127.5;
              }else{
                result = l[i + j] + (255 - l[i + j]) * (u[uI + j] - 127.5) / 127.5;
              }
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "差值":
            if(indexOfArr[j]){
              result = l[i + j] > u[uI + j] ? l[i + j] - u[uI + j] : u[uI + j] - l[i + j];
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "排除":
            if(indexOfArr[j]){
              result = l[i + j] + u[uI + j] - (l[i + j] * u[uI + j]) / 127.5;
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "点光":
            if(indexOfArr[j]){
              if(l[i + j] < (2 * u[uI + j] - 255)){
                result = 2 * u[uI + j] - 255;
              }else if(l[i + j] < 2 * u[uI + j]){
                result = l[i + j];
              }else{
                result = 2 * u[uI + j];
              }
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "颜色加深":
            if(indexOfArr[j]){
              result = 255 - 255 * (255 - l[i + j]) / u[uI + j];
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "线性加深":
            if(indexOfArr[j]){
              var tempR = l[i + j] + u[uI + j];
              result = tempR > 255 ? tempR - 255 : 0;
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "线性减淡":
            if(indexOfArr[j]){
              const tempR = l[i + j] + u[uI + j];
              result = tempR > 255 ? 255 : tempR;
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "柔光":
            if(indexOfArr[j]){
              if(u[uI + j] < 127.5){
                result = ((2 * u[uI + j] - 255) * (255 - l[i + j]) / (255 * 255) + 1) * l[i + j];
              }else{
                result = (2 * u[uI + j] - 255) * (Math.sqrt(l[i + j] / 255) - l[i + j] / 255) + l[i + j];
              }
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "亮光":
            if(indexOfArr[j]){
              if(u[uI + j] < 127.5){
                result = (1 - (255 - l[i + j]) / (2 * u[uI + j])) * 255;
              }else{
                result = l[i + j] / (2 * (1 - u[uI + j] / 255));
              }
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "线性光":
            if(indexOfArr[j]){
              const tempR = l[i + j] + 2 * u[uI + j] - 255;
              result = tempR > 255 ? 255 : tempR;
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          case "实色混合":
            if(indexOfArr[j]){
              if(u[uI + j] < (255 - l[i + j])){
                result = 0;
              }else{
                result = 255;
              }
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
            break;

          default:
            if(indexOfArr[j]){
              result = u[uI + j];
              l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
            }
        }//end switch
      }//end for
    }//end y

  }//end x

  return lowerData;
}
const M = {
  FFT1: function(dataArr){
    /*
     * @description:快速傅里叶变换
     * @按时间抽取
     * */
    const size = dataArr.length;
    let count = 0;

    //------计算权重W------------
    const W = [];
    for(let i = 0; i < size; i ++){
      W[i] = this.exp(-2 * Math.PI * i / size);
    }


    butterflyCal();
    return dataArr;

    //蝶形运算单元
    function butterflyCal(){
      count ++;

      //蝶形单元个数
      const singleLength = size / Math.pow(2,count);
      const everyLength = size / singleLength;

      for(let i = 0; i < singleLength; i ++){

        //逐次计算蝶形单元
        singleButterflyCal(i * everyLength, (i + 1) * everyLength - 1, count);
      }

      //如果单元个数大于1继续运算
      if(singleLength > 1){

        //递归
        butterflyCal();
      }else{
      }

    }

    //一个蝶形单元 n运算次数 蝶形单元的成对间隔
    function singleButterflyCal(start, end, n) {

      const delta =  Math.pow(2,n - 1);

      for(let i = start, j = 0; i <= (end - delta); i ++){

        //i 的运算对
        const pairI = i + delta;

        //计算i运算时的权重下标
        const currWeightForI = j * size / Math.pow(2,n);

        //计算i的运算对时候的权重
        const currWeightForPairI = currWeightForI + size / 4;

        if(!(dataArr[i] instanceof M.C)) dataArr[i] = new M.C(dataArr[i]);

        if(!(dataArr[pairI] instanceof M.C)) dataArr[pairI] = new M.C(dataArr[pairI]);

        const currResultForI = dataArr[i].plus(dataArr[pairI].mutiply(W[currWeightForI]));
        const currResultForPairI = dataArr[i].plus(dataArr[pairI].mutiply(W[currWeightForPairI]));

        dataArr[i] = currResultForI;
        dataArr[pairI] = currResultForPairI;

        j++;
      }
    }

  },

  DFT: function(){
    /*
     * @description:离散傅里叶变换
     * */

  },

  Matrix: function(arr,arg,arg2){
    /*
     * @descriptiont:矩阵类
     * 构造一个矩阵,当然从原始的数据构造,但具有矩阵的所有基本运算方法
     * arr参数可以为矩阵,附加字符串参数为构造的行列如 ([0,0],"3*4")    或("构造3*4的1矩阵")  ("构造3*4的0矩阵")
     * */
    const resultArr = [];

    if(arg){
      let m,n
      if(isNaN(arg)) {
        m = /(\d+)\s*\*/.exec(arg)[1];
        n = /\*\s*(\d+)/.exec(arg)[1];
      }else{
        m = arg;
        n = arg2;
      }

      //本身二维的
      if(arr[0] && arr[0][0]){
        for(let i = 0;i < m;i ++){
          resultArr[i] = [];
          for(let j = 0;j < n;j ++){
            resultArr[i][j] = arr[i][j] || 0;
          }
        }

        //一维的
      }else{

        for(let i = 0;i < m;i ++){
          resultArr[i] = [];
          for(let j = 0;j < n;j ++){
            const t = i * n + j;
            resultArr[i][j] = arr[i * n + j] || 0;
          }
        }

      }

      this.m = m;
      this.n = n;

    }else{
      this.m = arr.length;
      this.n = arr[0].length;
    }

    this.data = resultArr;
  },

  C: function(r,i){
    /*
     * @description:复数对象
     *
     * */
    this.r = r || 0;//实部
    this.i = i || 0;//虚部
  },

  exp: function(theta,r){//  r e^(i * theta) = r cos theta + r i * sin theta

    theta = theta || 0;
    r = r || 1;

    const tempC = new M.C();
    tempC.r = r * Math.cos(theta);
    tempC.i = r * Math.sin(theta);

    return tempC;
  },

  lagrange: function(xArr,yArr){
    /*
     * Lagrange插值
     * @usage   M.lagrange([1,2],[2,4])(3);
     * */
    const num = xArr.length;
    function getLk(x,k){//计算lk
      let omigaXk = 1;
      let omigaX = 1;
      for(let i = 0;i < num;i ++){
        if(i != k){
          omigaXk *= xArr[k] - xArr[i];
          omigaX *= x - xArr[i];
        }
      }
      const lk = omigaX / omigaXk;
      return lk;
    }
    const getY = function(x){
      let L = 0;
      for(let k = 0;k < num;k ++){
        var lk = getLk(x,k);
        L += yArr[k] * lk;

      }
      return L;
    };
    return getY;

  },

  applyMatrix: function(imgData,matrixArr,low){//对图象信号实行掩模算子变换 low为阈值,滤波运算

    low = low || 0;
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;
    const matrixSize = matrixArr.length;
    const template = new M.Matrix(matrixArr,matrixSize,1);
    const tempData = [];
    const start = -(Math.sqrt(matrixSize) - 1) / 2;

    for(let i = 0,n = data.length;i < n;i += 4){
      const ii = i / 4;
      const row = parseInt(ii / width);
      const col = ii % width;
      if(row === 0 || col === 0) continue;

      const pixelArr = [[],[],[]];
      for(let k = start;k <= -start;k ++){
        const currRow = row + k;

        for(let kk = start;kk <= -start;kk ++){

          const currCol = col + kk;
          const currI = (currRow * width + currCol) * 4;

          for(let j = 0;j < 3;j ++){
            const tempI = currI + j;
            pixelArr[j].push(data[tempI]);
          }

        }

      }

      const pixelMatrix = new M.Matrix(pixelArr,3,matrixSize);
      const resultMatrix = pixelMatrix.mutiply(template);

      for(let j = 0;j < 3;j ++){
        tempData[i + j] = resultMatrix.data[j];
      }
      tempData[i + 4] = data[i + 4];
    }

    for(let i = 0,n = data.length;i < n;i ++){
      if(tempData[i]){
        data[i] = tempData[i] < low ? tempData[i] : data[i];
      }
    }

    return imgData;
  },

  RGBToHSI: function(R,G,B){
    let theta = ((R - G + R - B) / 2) / Math.sqrt((R - G) * (R - G) + (R - B) * (G - B)) || 0;
    theta = Math.acos(theta);
    let H = B > G ? (2 * Math.PI - theta) : theta;
    let S
    if(R + G + B > 0){
      S = 1 - 3 * Math.min(R,G,B) / (R + G + B);
    }else{
      S = 0;
    }

    let I = (R + G + B) / 3;

    if(H > 2 * Math.PI) H = 2 * Math.PI;
    if(H < 0) H = 0;

    return {
      H: H,
      S: S,
      I: I
    };

  },

  HSIToRGB: function(H,S,I){//H为弧度值
    //H (-Math.PI , Math.PI)  S (-1,1) I (-255,255)
    if(H < 0){
      H %= 2 * Math.PI;
      H += 2 * Math.PI
    }else{
      H %= 2 * Math.PI;
    }
    let R,G,B
    if(H <= Math.PI * 2 / 3){
      B = I * (1 - S);
      R = I * (1 + S * Math.cos(H) / Math.cos(Math.PI / 3 - H));
      G = 3 * I - (R + B);

    }else if(H <= Math.PI * 4 / 3){
      H = H - Math.PI * 2 / 3;

      R = I * (1 - S);
      G = I * (1 + S * Math.cos(H) / Math.cos(Math.PI / 3 - H));
      B = 3 * I - (G + R);

    }else{
      H = H - Math.PI * 4 / 3;

      G = I * (1 - S);
      B = I * (1 + S * Math.cos(H) / Math.cos(Math.PI / 3 - H));
      R = 3 * I - (G + B);

    }

    return {
      R: R,
      G: G,
      B: B
    };
  },

  applyInHSI: function(imgData, func){//在hsi空间上应用func
    /*
     * function(i){
     *      i.H += 3;
     * }
     * H (-2*Math.PI , 2 * Math.PI)  S (-1,1) I (-255,255)
     * */
    const colorMap = ["R", "Y", "G", "C", "B", "M"];
    const data = imgData.data;

    const d30 = Math.PI / 6;
    const d60 = Math.PI / 3;
    for(let i = 0, n = data.length; i < n; i += 4){
      const hsiObj = this.RGBToHSI(data[i], data[i + 1], data[i + 2]);

      //得到颜色属性
      const h = hsiObj.H + d30;
      const color = ~~ (h / d60);
      const rColor = colorMap[color % 6];

      func(hsiObj, rColor, data[i + 3]);

      if(hsiObj.S > 1) hsiObj.S = 1;
      if(hsiObj.S < 0) hsiObj.S = 0;

      const rgbObj = this.HSIToRGB(hsiObj.H,hsiObj.S,hsiObj.I);
      data[i] = rgbObj.R;
      data[i + 1] = rgbObj.G;
      data[i + 2] = rgbObj.B;
    }

  },

  applyInCoordinate: function(imgData,func){//在坐标空间上应用func
    /*
     * function(dot){
     *
     * }
     * */
  },

  //计算两个点之间的距离
  //p1   array
  //p2   array
  distance: function(p1, p2){
    p2 = p2 || [0, 0];

    p1 = new M.C(p1[0], p1[1]);
    p2 = new M.C(p2[0], p2[1]);

    const p3 = p1.minus(p2);
    return p3.distance();
  },

  //将(x,y)的坐标转为单维的i
  xyToIFun: function(width){
    return function(x, y, z){
      z = z || 0;
      return (y * width + x) * 4 + z;
    };
  },

  //在(x,y)进行运算
  //rgbfun 在rgb三个上进行的操作 aFun在alpha进行的操作
  //rgbFun:   function(r, g, b){
  //      return [r, g, b]
  //
  //}
  xyCal: function(imgData, x, y, rgbFun, aFun){
    const xyToIFun  = this.xyToIFun(imgData.width);
    const j  = xyToIFun(x, y, 0);
    const data = imgData.data;
    const processedData = rgbFun(data[j], data[j + 1], data[j + 2]);

    if(processedData){
      data[j] = processedData[0];
      data[j + 1] = processedData[1];
      data[j + 2] = processedData[2];
    }

    if(aFun){
      data[j + 3] = aFun(data[j + 3]);
    }

  }

}
const dorsyMath = M
/*
var t = M.RGBToHSI(255,5,25);
var f = M.HSIToRGB(t.H+2 * Math.PI,t.S,t.I);
alert(f.R + "|" + f.G + "|" + f.B);
*/

M.Matrix.prototype = {
  /*m: 0,//数学上传统的m*n矩阵
  n: 0,
*/
  plus: function(matrix){
    if(this.m !== matrix.m || this.n !== matrix.n){
      throw new Error("矩阵加法行列不匹配");
    }


    const tempM = new M.Matrix([],this.m,this.n);
    for(let i = 0;i < this.m;i ++){
      for(let j = 0;j < this.n;j ++){
        tempM.data[i][j] = this.data[i][j] + matrix.data[i][j];
      }
    }
    return tempM;
  },

  minus: function(matrix){
    if(this.m !== matrix.m || this.n !== matrix.n){
      throw new Error("矩阵减法法行列不匹配");
    }


    const tempM = new M.Matrix([],this.m,this.n);
    for(let i = 0;i < this.m;i ++){
      for(let j = 0;j < this.n;j ++){
        tempM.data[i][j] = this.data[i][j] - matrix.data[i][j];
      }
    }
    return tempM;
  },

  mutiply: function(matrix){//左乘另一矩阵
    if(this.n !== matrix.m){
      throw new Error("矩阵乘法行列不匹配");
    }


    const tempM = new M.Matrix([],this.m,matrix.n);
    for(let i = 0;i < this.m;i ++){
      for(let j = 0;j < matrix.n;j ++){

        let sum = 0;
        for(let ii = 0;ii < this.n;ii ++){
          sum += this.data[i][ii] * matrix.data[ii][j];
        }
        tempM.data[i][j] = sum;
      }
    }
    return tempM;

  }
};

M.C.prototype = {
  plus: function(c){
    const tempC = new M.C();
    tempC.r = this.r + c.r;
    tempC.i = this.i + c.i;

    return tempC;
  },
  minus:function(c){
    const tempC = new M.C();
    tempC.r = this.r - c.r;
    tempC.i = this.i - c.i;

    return tempC;
  },
  mutiply: function(c){
    const tempC = new M.C();
    tempC.r = this.r * c.r - this.i * c.i;
    tempC.i = this.r * c.i + this.i * c.r;

    return tempC;
  },
  divide: function(c){

    const tempC = new M.C();

    const m = c.mutiply(c.conjugated());
    const f = this.mutiply(c.conjugated());
    tempC.r = f.r / m.r;
    tempC.i = f.i / m.r;

    return tempC;
  },
  conjugated: function(){//取共轭
    const tempC = new M.C(this.r,-this.i);
    return tempC;
  },

  //取模
  distance: function(){
    return Math.sqrt(this.r * this.r + this.i * this.i);
  }
}

/**
 * 高斯模糊
 * @param  {Array} pixes  pix array
 * @param  {Number} width 图片的宽度
 * @param  {Number} height 图片的高度
 * @param  {Number} radius 取样区域半径, 正数, 可选, 默认为 3.0
 * @param  {Number} sigma 标准方差, 可选, 默认取值为 radius / 3
 * @return {Array}
 */
export function gaussBlur(imgData, args) {
  const pixes = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  let gaussMatrix = [],
    gaussSum = 0,
    x, y,
    r, g, b, a,
    i, j, k, len;

  let radius = args[0];
  let sigma = args[1];


  radius = Math.floor(radius) || 3;
  sigma = sigma || radius / 3;

  a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  b = -1 / (2 * sigma * sigma);
  //生成高斯矩阵
  for (i = 0, x = -radius; x <= radius; x++, i++){
    g = a * Math.exp(b * x * x);
    gaussMatrix[i] = g;
    gaussSum += g;

  }
  //归一化, 保证高斯矩阵的值在[0,1]之间
  for (i = 0, len = gaussMatrix.length; i < len; i++) {
    gaussMatrix[i] /= gaussSum;
  }
  //x 方向一维高斯运算
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      r = g = b = a = 0;
      gaussSum = 0;
      for(j = -radius; j <= radius; j++){
        k = x + j;
        if(k >= 0 && k < width){//确保 k 没超出 x 的范围
          //r,g,b,a 四个一组
          i = (y * width + k) * 4;
          r += pixes[i] * gaussMatrix[j + radius];
          g += pixes[i + 1] * gaussMatrix[j + radius];
          b += pixes[i + 2] * gaussMatrix[j + radius];
          // a += pixes[i + 3] * gaussMatrix[j];
          gaussSum += gaussMatrix[j + radius];
        }
      }
      i = (y * width + x) * 4;
      // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
      // console.log(gaussSum)
      pixes[i] = r / gaussSum;
      pixes[i + 1] = g / gaussSum;
      pixes[i + 2] = b / gaussSum;
      // pixes[i + 3] = a ;
    }
  }
  //y 方向一维高斯运算
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      r = g = b = a = 0;
      gaussSum = 0;
      for(j = -radius; j <= radius; j++){
        k = y + j;
        if(k >= 0 && k < height){//确保 k 没超出 y 的范围
          i = (k * width + x) * 4;
          r += pixes[i] * gaussMatrix[j + radius];
          g += pixes[i + 1] * gaussMatrix[j + radius];
          b += pixes[i + 2] * gaussMatrix[j + radius];
          // a += pixes[i + 3] * gaussMatrix[j];
          gaussSum += gaussMatrix[j + radius];
        }
      }
      i = (y * width + x) * 4;
      pixes[i] = r / gaussSum;
      pixes[i + 1] = g / gaussSum;
      pixes[i + 2] = b / gaussSum;
      // pixes[i] = r ;
      // pixes[i + 1] = g ;
      // pixes[i + 2] = b ;
      // pixes[i + 3] = a ;
    }
  }
  //end
  // imgData.data = pixes;
  return imgData;
}

/**
 * @description: 腐蚀
 */
function corrode(imgData, arg) {
  const R = parseInt(arg[0]) || 3;
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  const xLength = R * 2 + 1;

  //区块
  for(let x = 0; x < width; x ++){

    for(let y = 0; y < height; y ++){

      const randomI = parseInt(Math.random() * R * 2) - R ;//区块随机代表
      const randomJ = parseInt(Math.random() * R * 2) - R;//区块随机代表
      const realI = y * width + x;
      const realJ = (y + randomI) * width + x + randomJ;

      for(let j = 0; j < 3; j ++){
        data[realI * 4 + j] = data[realJ * 4 + j];
      }

    }

  }

  return imgData;
}

/**
 * 暗角
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function darkCorner(imgData,arg) {
  //暗角级别 分1-10级吧
  const R = parseInt(arg[0]) || 3;

  //暗角的形状
  const type = arg[2] || "round";

  //暗角最终的级别 0 - 255
  const lastLevel = arg[1] || 30;

  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  const xLength = R * 2 + 1;

  //计算中心点
  const middleX = width * 2 / 3;
  const middleY = height * 1/ 2;

  //计算距中心点最长距离
  const maxDistance = dorsyMath.distance([middleX ,middleY]);
  //开始产生暗角的距离
  const startDistance = maxDistance * (1 - R / 10);

  const f = function(x, p0, p1, p2, p3){

    //基于三次贝塞尔曲线
    return p0 * Math.pow((1 - x), 3) + 3 * p1 * x * Math.pow((1 - x), 2) + 3 * p2 * x * x * (1 - x) + p3 * Math.pow(x, 3);
  }

  //计算当前点应增加的暗度
  function calDark(x, y, p){
    //计算距中心点距离
    const distance = dorsyMath.distance([x, y], [middleX, middleY]);
    let currBilv = (distance - startDistance) / (maxDistance - startDistance);
    if(currBilv < 0) currBilv = 0;

    //应该增加暗度
    return  f(currBilv, 0, 0.02, 0.3, 1) * p * lastLevel / 255;
  }

  //区块
  for(let x = 0; x < width; x ++){

    for(let y = 0; y < height; y ++){

      const realI = y * width + x;
      for(let j = 0;j < 3;j ++){
        const dDarkness = calDark(x, y, data[realI * 4 + j]);
        data[realI * 4 + j] -= dDarkness;
      }

    }

  }


  return imgData;
}

/**
 * 喷点
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function dotted(imgData,arg) {//调节亮度对比度
  //矩形半径
  const R = parseInt(arg[0]) || 1;

  //内小圆半径
  const r = parseInt(arg[1]) || 1;

  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  const xLength = R * 2 + 1;

  //构造距离模板
  const disTmlMatrix = [
  ];

  const r2 = r * r;
  for(let x = -R; x < R; x ++){

    for(let y = -R; y < R; y ++){
      if((x * x + y * y) > r2){
        disTmlMatrix.push([x, y]);
      }
    }

  }

  const xyToIFun = dorsyMath.xyToIFun(width);

  //将大于距离外面的透明度置为0
  for(let x = 0, n = parseInt(width / xLength); x < n; x ++){

    for(let y = 0, m = parseInt(height / xLength); y < m;y ++){
      const middleX = parseInt((x + 0.5) * xLength);
      const middleY = parseInt((y + 0.5) * xLength);

      for(let i = 0; i < disTmlMatrix.length; i ++){
        const dotX = middleX + disTmlMatrix[i][0];
        const dotY = middleY + disTmlMatrix[i][1];

        //data[(dotY * width + dotX) * 4 + 3] = 0;
        data[xyToIFun(dotX, dotY, 3)] = 225;
        data[xyToIFun(dotX, dotY, 2)] = 225;
        data[xyToIFun(dotX, dotY, 0)] = 225;
        data[xyToIFun(dotX, dotY, 1)] = 225;
      }
    }

  }

  /*
  for(var x = 0; x < width; x ++){
      for(var y = 0; y < height; y ++){
          data[(y * width + x) * 4 + 3] = 0;
      }
  }
  */


  return imgData;
}

/**
 * 浮雕效果
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function embossment(imgData,arg) {//调节亮度对比度
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;

  const outData = [];
  for(let i = 0,n = data.length;i < n;i += 4){

    const ii = i / 4;
    const row = parseInt(ii / width);
    const col = ii % width;
    const A = ((row - 1) *  width + (col - 1)) * 4;
    const G = (row + 1) * width * 4 + (col + 1) * 4;

    if(row === 0 || col === 0) continue;
    for(let j = 0;j < 3;j ++){
      outData[i + j] = data[A + j] - data[G + j] + 127.5;
    }
    outData[i + 4] = data[i + 4];
  }

  for(let i = 0,n = data.length;i < n;i ++){
    data[i] = outData[i] || data[i];
  }


  return imgData;
}

/**
 * 灰度扩展
 * @param imgData
 * @param arg1
 * @param arg2
 * @returns {*}
 * @constructor
 */
export function ImageEnhance(imgData,arg1,arg2) {
  const lamta = arg || 0.5;
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  const p1 = arg1 || {x: 10,y: 10};
  const p2 = arg2 || {x: 50,y: 40};

  function transfer(d){
  }

  for(let i = 0,n = data.length;i < n;i += 4){

  }

  // imgData.data = data;

  return imgData;
}

/**
 * 查找边缘
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function borderline(imgData,arg) {
  const template1 = [
    -2,-4,-4,-4,-2,
    -4,0,8,0,-4,
    -4,8,24,8,-4,
    -4,0,8,0,-4,
    -2,-4,-4,-4,-2
  ];
  const template2 = [
    0,		1,		0,
    1,		-4,		1,
    0,		1,		0
  ];
  const template3 = [
  ];
  return dorsyMath.applyMatrix(imgData,template2,250);
}

/**
 * 马赛克
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function mosaic(imgData,arg) {//调节亮度对比度
  const R = parseInt(arg[0]) || 3;
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  const xLength = R * 2 + 1;

  for(let x = 0,n = parseInt(width / xLength);x < n;x ++){

    for(let y = 0,m = parseInt(height / xLength);y < m;y ++){

      const average = [],sum = [0,0,0];
      for(let i = 0;i < xLength;i ++){

        for(let j = 0;j < xLength;j ++){
          const realI = (y * xLength + i) * width + x * xLength + j;
          sum[0] += data[realI * 4];
          sum[1] += data[realI * 4 + 1];
          sum[2] += data[realI * 4 + 2];
        }
      }
      average[0] = sum[0] / (xLength * xLength);
      average[1] = sum[1] / (xLength * xLength);
      average[2] = sum[2] / (xLength * xLength);

      for(let i = 0;i < xLength;i ++){

        for(let j = 0;j < xLength;j ++){
          const realI = (y * xLength + i) * width + x * xLength + j;
          data[realI * 4] = average[0];
          data[realI * 4 + 1] = average[1];
          data[realI * 4 + 2] = average[2];

        }
      }

    }

  }


  return imgData;
}

/**
 * 添加杂色
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function noise(imgData,arg) {
  const R = parseInt(arg[0]) || 100;
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  const xLength = R * 2 + 1;

  //区块
  for(let x = 0;x < width;x ++){

    for(let y = 0;y < height;y ++){

      const realI = y * width + x;
      for(let j = 0;j < 3;j ++){
        const rand = parseInt(Math.random() * R * 2) - R;
        data[realI * 4 + j] += rand;
      }

    }

  }


  return imgData;
}

/**
 * 油画
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function oilPainting(imgData,arg) {
  const R = parseInt(arg[0]) || 16;
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  const xLength = R * 2 + 1;

  //区块
  for(let x = 0;x < width;x ++){

    for(let y = 0;y < height;y ++){

      const realI = y * width + x;
      let gray = 0;
      for(let j = 0;j < 3;j ++){
        gray += data[realI * 4 + j];
      }
      gray = gray / 3;
      const every = parseInt(gray / R) * R;
      for(let j = 0;j < 3;j ++){
        data[realI * 4 + j] = every;
      }
    }

  }


  return imgData;
}

/**
 * 色调分离
 * @param imgData
 * @param args
 * @returns {*}
 */
export function posterize(imgData, args) {
  const dM = dorsyMath;
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;

  //灰度阶数
  //由原来的255阶映射为现在的阶数
  let step = args[0] || 20;

  step = step < 1 ? 1 : (step > 255 ? 255 : step);
  const level = Math.floor(255 / step);

  for(let x = 0; x < width; x ++){
    for(let y = 0; y < height; y ++){
      dM.xyCal(imgData, x, y, function(r, g, b){
        return [
          Math.floor(r / level) * level,
          Math.floor(g / level) * level,
          Math.floor(b / level) * level
        ];
      });
    }
  }
  return imgData;
}

/**
 * 棕褐色
 * @param imgData
 * @returns {*}
 */
export function sepia(imgData) {
  const dM = dorsyMath;
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;

  for(let x = 0; x < width; x ++){
    for(let y = 0; y < height; y ++){
      dM.xyCal(imgData, x, y, function(r, g, b){
        return [
          r * 0.393 + g * 0.769 + b * 0.189,
          r * 0.349 + g * 0.686 + b * 0.168,
          r * 0.272 + g * 0.534 + b * 0.131
        ];
      });
    }
  }
  return imgData;
}

/**
 * 锐化
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function sharp(imgData,arg) {
  const lamta = arg[0] || 0.6;
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;

  for(let i = 0,n = data.length;i < n;i += 4){
    const ii = i / 4;
    const row = parseInt(ii / width);
    const col = ii % width;
    if(row === 0 || col === 0) continue;

    const A = ((row - 1) *  width + (col - 1)) * 4;
    const B = ((row - 1) * width + col) * 4;
    const E = (ii - 1) * 4;

    for(let j = 0;j < 3;j ++){
      const delta = data[i + j] - (data[B + j] + data[E + j] + data[A + j]) / 3;
      data[i + j] += delta * lamta;
    }
  }

  return imgData;
}

/**
 * 灰度处理
 * @param imgData
 * @modify: 灰度算法改成加权平均值 (0.299, 0.578, 0.114)
 */
export function toGray(imgData) {
  const data = imgData.data;

  for(let i = 0,n = data.length;i < n;i += 4){
    const gray = parseInt((0.299 * data[i] + 0.578 * data[i + 1] + 0.114 * data[i + 2]))
    data[i + 2] = data[i + 1] = data[i] = gray;
  }

  // imgData.data = data;

  return imgData;
}

/**
 * 反色
 * @param imgData
 * @returns {*}
 */
export function toReverse(imgData) {
  const data = imgData.data;

  for(let i = 0,n = data.length;i < n;i += 4){
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  // imgData.data = data;

  return imgData;
}

/**
 * 灰度阈值,做只有2级灰度图像处理
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function toThresh(imgData,arg) {
  imgData = toGray(imgData)
  const data = imgData.data;

  arg = arg[0] || 128;
  for(let i = 0,n = data.length;i < n;i ++){
    if((i + 1) % 4){
      data[i] = data[i] > arg ? 255 : 0;
    }
  }

  // imgData.data = data;

  return imgData;
}

/**
 * 调节亮度对比度
 * @param imgData
 * @param args
 * @returns {*}
 */
export function brightness(imgData, args) {
  const data = imgData.data;
  const brightness = args[0] / 50;// -1,1
  const arg2 = args[1] || 0;
  const c = arg2 / 50;// -1,1
  const k = Math.tan((45 + 44 * c) * Math.PI / 180);

  for(let i = 0,n = data.length;i < n;i += 4){
    for(let j = 0;j < 3;j ++){
      data[i + j] = (data[i + j] - 127.5 * (1 - brightness)) * k + 127.5 * (1 + brightness);
    }
  }

  return imgData;
}

/**
 * 曲线
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function curve(imgData, arg) {
  /*
   * arg   arg[0] = [3,3] ,arg[1]  = [2,2]
   * */

  //获得插值函数
  var f = dorsyMath.lagrange(arg[0], arg[1]);
  var data = imgData.data;
  var width = imgData.width;
  var height = imgData.height;

  //调节通道
  var channel = arg[2];
  if(!(/[RGB]+/.test(channel))){
    channel = "RGB";
  }

  var channelString = channel.replace("R","0").replace("G","1").replace("B","2");

  var indexOfArr = [
    channelString.indexOf("0") > -1,
    channelString.indexOf("1") > -1,
    channelString.indexOf("2") > -1
  ];

  //区块
  for(var x = 0; x < width; x ++){

    for(var y = 0; y < height; y ++){

      var realI = y * width + x;

      for(var j = 0; j < 3; j ++){
        if(! indexOfArr[j]) continue;
        data[realI * 4 + j] = f(data[realI * 4 + j]);
      }

    }

  }

  return imgData;
}

/**
 * gamma调节
 * @param imgData
 * @param args
 * @returns {*}
 */
export function gamma(imgData, args) {
  var dM = P.lib.dorsyMath;
  var data = imgData.data;
  var width = imgData.width;
  var height = imgData.height;

  //gamma阶-100， 100
  var gamma;

  if(args[0] == undefined) gamma = 10;
  else gamma = args[0];

  var normalizedArg = ((gamma + 100) / 200) * 2;

  for(var x = 0; x < width; x ++){
    for(var y = 0; y < height; y ++){
      dM.xyCal(imgData, x, y, function(r, g, b){
        return [
          Math.pow(r, normalizedArg),
          Math.pow(g, normalizedArg),
          Math.pow(b, normalizedArg)
        ];
      });
    }
  }
  return imgData;
}

/**
 * 可选颜色,调节亮度对比度
 * @param imgData
 * @param arg
 * @returns {*}
 */
export function selectiveColor(imgData, arg) {
  //选择的颜色
  var color = arg[0];

  //百分数
  var C = arg[1];
  var M = arg[2];
  var Y = arg[3];
  var K = arg[4];

  //是否相对
  var isRelative = arg[5] || 0;

  var maxColorMap = {
    red: "R",
    green: "G",
    blue: "B",
    "红色": "R",
    "绿色": "G",
    "蓝色": "B"
  };

  var minColorMap = {
    cyan: "R",
    magenta: "G",
    yellow: "B",
    "青色": "R",
    "洋红": "G",
    "黄色": "B"
  };

  //检查是否是被选中的颜色
  var checkSelectedColor = function(colorObj){
    if(maxColorMap[color]){
      return Math.max(colorObj.R, colorObj.G, colorObj.B) == colorObj[maxColorMap[color]];
    }else if(minColorMap[color]){
      return Math.min(colorObj.R, colorObj.G, colorObj.B) == colorObj[minColorMap[color]];
    }else if(color == "black" || color == "黑色"){
      return Math.min(colorObj.R, colorObj.G, colorObj.B) < 128;
    }else if(color == "white" || color == "白色"){
      return Math.max(colorObj.R, colorObj.G, colorObj.B) > 128;
    }else if(color == "中性色"){
      return ! ((Math.max(colorObj.R, colorObj.G, colorObj.B) < 1) || (Math.min(colorObj.R, colorObj.G, colorObj.B) > 224));
    }
  };

  var upLimit = 0;
  var lowLimit = 0;
  var limit = 0;

  var alterNum = [C, M, Y, K];
  for(var x = 0, w = imgData.width; x < w; x ++){
    for(var y = 0, h = imgData.height; y < h; y ++){
      P.lib.dorsyMath.xyCal(imgData, x, y, function(R, G, B){
        var colorObj = {
          R: R,
          G: G,
          B: B
        };

        var colorArr = [R, G, B];
        var resultArr =[];

        if(checkSelectedColor(colorObj)){
          if(maxColorMap[color]){
            var maxColor = maxColorMap[color];

            var middleValue = R + G + B - Math.max(R, G, B) - Math.min(R, G, B);
            limit = colorObj[maxColor] - middleValue;
          }else if(minColorMap[color]){
            var minColor = minColorMap[color];

            var middleValue = R + G + B - Math.max(R, G, B) - Math.min(R, G, B);
            limit = middleValue - colorObj[minColor]  ;
          }else if(color == "black" || color == "黑色"){
            limit = parseInt(127.5 - Math.max(R, G, B)) * 2;
          }else if(color == "white" || color == "白色"){
            limit = parseInt(Math.min(R, G, B) - 127.5) * 2;
          }else if(color == "中性色"){
            limit = 255 - (Math.abs(Math.max(R, G, B) - 127.5) + Math.abs(Math.min(R, G, B) - 127.5));
          }else{
            return;
          }

          for(var i = 0; i < 3; i ++){
            //可减少到的量
            var lowLimitDelta = parseInt(limit * (colorArr[i] / 255));
            var lowLimit = colorArr[i] - lowLimitDelta;

            //可增加到的量
            var upLimitDelta =  parseInt(limit * (1 - colorArr[i] / 255));
            var upLimit = colorArr[i] + upLimitDelta;

            //将黑色算进去 得到影响百分比因子
            var factor = (alterNum[i] + K + alterNum[i] * K);

            //相对调节
            if(isRelative){
              //如果分量大于128  减少量=增加量
              if(colorArr[i] > 128){
                lowLimitDelta = upLimitDelta;
              }

              //先算出黑色导致的原始增量
              if(K > 0){
                var realUpLimit = colorArr[i] - K * lowLimitDelta;
              }else{
                var realUpLimit = colorArr[i] - K * upLimitDelta;
              }

              //标准化
              if(realUpLimit > upLimit) realUpLimit = upLimit;
              if(realUpLimit < lowLimit) realUpLimit = lowLimit;

              upLimitDelta = upLimit - realUpLimit;
              lowLimitDelta = realUpLimit - lowLimit;

              if(K < 0){
                lowLimitDelta = upLimitDelta;
              }else{
              }

              //> 0表明在减少
              if(alterNum[i] > 0){
                realUpLimit -= alterNum[i] * lowLimitDelta;
              }else{
                realUpLimit -= alterNum[i] * upLimitDelta;
              }


            }else{

              //现在量
              var realUpLimit = limit * - factor + colorArr[i];

            }

            if(realUpLimit > upLimit) realUpLimit = upLimit;
            if(realUpLimit < lowLimit) realUpLimit = lowLimit;

            resultArr[i] = realUpLimit;
          }

          return resultArr;
        }
      });//end xyCal
    }//end forY
  }//end forX

  return imgData;

}

/**
 * 调整RGB 色相/饱和和度
 * @param imgData
 * @param arg
 * @returns {*}
 * H (-2*Math.PI , 2 * Math.PI)  S (-100,100) I (-100,100)
 * 着色原理  勾选着色后，所有的像素不管之前是什么色相，都变成当前设置的色相，
 * 然后饱和度变成现在设置的饱和度，但保持明度为原来的基础上加上设置的明度
 */
export function setHSI(imgData,arg) {//调节亮度对比度
  arg[0] = arg[0] / 180 * Math.PI;
  arg[1] = arg[1] / 100 || 0;
  arg[2] = arg[2] / 100 * 255 || 0;
  arg[3] = arg[3] || false;//着色

  //调节通道
  let channel = arg[4];
  if(!(/[RGBCMY]+/.test(channel))){
    channel = "RGBCMY";
  }

  const letters = channel.split("");
  const indexOf = {};

  for(let i = 0; i < letters.length; i ++){
    indexOf[letters[i]] = 1;
  }

  dorsyMath.applyInHSI(imgData,function(i, color){
    if(! indexOf[color]) return;

    if(arg[3]){
      i.H = arg[0];
      i.S = arg[1];
      i.I += arg[2];
    }else{
      i.H += arg[0];
      i.S += arg[1];
      i.I += arg[2];
    }

  });

  return imgData;
}

export const AddLayerFilter = function ({lowerData, upperData, method, alpha, dx, dy, isFast, channel}) {
  return add(lowerData, upperData, method, alpha, dx, dy, isFast, channel)
}
