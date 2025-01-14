/**
 * 更新日期：2024-04-05 15:30:15
 * 用法：Sub-Store 脚本操作添加
 * rename.js 以下是此脚本支持的参数...（省略注释）
 */

// const inArg = {'blkey':'iplc+GPT>GPTnewName+NF+IPLC', 'flag':true };
const inArg = $arguments;

const nx     = inArg.nx      || false,
      bl     = inArg.bl      || false,
      nf     = inArg.nf      || false,
      key    = inArg.key     || false,
      blgd   = inArg.blgd    || false,
      blpx   = inArg.blpx    || false,
      blnx   = inArg.blnx    || false,
      debug  = inArg.debug   || false,
      clear  = inArg.clear   || false,
      addflag= inArg.flag    || false,
      nm     = inArg.nm      || false;

const FGF       = inArg.fgf       == undefined ? " " : decodeURI(inArg.fgf),
      XHFGF     = inArg.sn        == undefined ? " " : decodeURI(inArg.sn),
      FNAME     = inArg.name      == undefined ? ""  : decodeURI(inArg.name),
      BLKEY     = inArg.blkey     == undefined ? ""  : decodeURI(inArg.blkey),
      blockquic = inArg.blockquic == undefined ? ""  : decodeURI(inArg.blockquic),
      nameMap   = {
        cn:   "cn",
        zh:   "cn",
        us:   "us",
        en:   "us",
        quan: "quan",
        gq:   "gq",
        flag: "gq",
      },
      inname    = nameMap[inArg.in]  || "",
      outputName= nameMap[inArg.out] || "";

/**
 * 用于输出国旗/英文缩写/中文...
 */
const FG = [ "🇭🇰","🇲🇴","🇹🇼","🇯🇵","🇰🇷","🇸🇬","🇺🇸","🇬🇧","🇫🇷","🇩🇪","🇦🇺","🇦🇪", /* 省略... */ ];
const EN = [ "HK","MO","TW","JP","KR","SG","US","GB","FR","DE","AU","AE", /* 省略... */ ];
const ZH = [ "香港","澳门","台湾","日本","韩国","新加坡","美国","英国","法国","德国","澳大利亚","阿联酋", /* 省略... */ ];
const QC = [ "Hong Kong","Macao","Taiwan","Japan","Korea","Singapore","United States","United Kingdom","France","Germany","Australia","Dubai", /* 省略... */ ];

// 分组排序标识
const specialRegex = [
  /(\d\.)?\d+×/,
  /IPLC|IEPL|Kern|Edge|Pro|Std|Exp|Biz|Home|Game|Buy|Zx|LB|Game/,
];
const nameclear =
  /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i;

// 保留固定格式/倍率
// prettier-ignore
const regexArray = [
  /ˣ²/, /ˣ³/, /ˣ⁴/, /ˣ⁵/, /ˣ⁶/, /ˣ⁷/, /ˣ⁸/, /ˣ⁹/, /ˣ¹⁰/, /ˣ²⁰/, /ˣ³⁰/, /ˣ⁴⁰/, /ˣ⁵⁰/,
  /IPLC/i, /IEPL/i, /核心/, /边缘/, /高级/, /标准/, /实验/, /商宽/, /家宽/, /游戏|game/i, /购物/, /专线/, /LB/, /cloudflare/i, /\budp\b/i, /\bgpt\b/i,/udpn\b/
];
// prettier-ignore
const valueArray = [
  "2×","3×","4×","5×","6×","7×","8×","9×","10×","20×","30×","40×","50×",
  "IPLC","IEPL","Kern","Edge","Pro","Std","Exp","Biz","Home","Game","Buy","Zx","LB","CF","UDP","GPT","UDPN"
];

// 只保留高倍率/排除...
const nameblnx = /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;
const namenx   = /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;

// key 关键字筛选
const keya = /港|Hong|HK|新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR|🇸🇬|🇭🇰|🇯🇵|🇺🇸|🇰🇷|🇹🇷/i;
const keyb = /(((1|2|3|4)\d)|(香港|Hong|HK) 0[5-9]|((新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR) 0[3-9]))/i;

/**
 * 严格匹配表(示例)
 */
const strictRurekey = {
  GB: /UK/g,
  "B-G-P": /BGP/g,
  "Russia Moscow": /Moscow/g,
  "Korea Chuncheon": /Chuncheon|Seoul/g,
  "Hong Kong": /Hongkong|HONG KONG/gi,
  "United Kingdom London": /London|Great Britain/g,
  "Dubai United Arab Emirates": /United Arab Emirates/g,
  "Taiwan TW 台湾 🇹🇼": /(台|Tai\s?wan|TW).*?🇨🇳|🇨🇳.*?(台|Tai\s?wan|TW)/g,
  "United States": /USA|Los Angeles|San Jose|Silicon Valley|Michigan/g,
  澳大利亚: /澳洲|墨尔本|悉尼|土澳|(深|沪|呼|京|广|杭)澳/g,
  德国: /(深|沪|呼|京|广|杭)德(?!.*(I|线))|法兰克福|滬德/g,
  香港: /(深|沪|呼|京|广|杭)港(?!.*(I|线))/g,
  日本: /(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))|东京|大坂/g,
  新加坡: /狮城|(深|沪|呼|京|广|杭)新/g,
  美国: /(深|沪|呼|京|广|杭)美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图|芝加哥/g,
  波斯尼亚和黑塞哥维那: /波黑共和国/g,
  印尼: /印度尼西亚|雅加达/g,
  印度: /孟买/g,
  阿联酋: /迪拜|阿拉伯联合酋长国/g,
  孟加拉国: /孟加拉/g,
  捷克: /捷克共和国/g,
  台湾: /新台|新北|台(?!.*线)/g,
  Taiwan: /Taipei/g,
  韩国: /春川|韩|首尔/g,
  Japan: /Tokyo|Osaka/g,
  英国: /伦敦/g,
  India: /Mumbai/g,
  Germany: /Frankfurt/g,
  Switzerland: /Zurich/g,
  俄罗斯: /莫斯科/g,
  土耳其: /伊斯坦布尔/g,
  泰国: /泰國|曼谷/g,
  法国: /巴黎/g,
  G: /\d\s?GB/gi,
  Esnc: /esnc/gi
};

/**
 * 宽松匹配表(示例)
 */
const fallbackRurekey = {
  澳大利亚: /澳|墨尔本|悉尼/g,
  德国: /德|法兰克福/g,
  香港: /港/g,
  日本: /日|东京|大坂/g,
  新加坡: /新|狮城/g,
  美国: /美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图|芝加哥/g,
  台湾: /台|新北/g,
  韩国: /韩|春川|首尔/g,
  俄罗斯: /俄|莫斯科/g,
  泰国: /泰|曼谷/g,
  法国: /法|巴黎/g
};

/**
 * 合并所有规则(原逻辑还要执行一次替换)
 */
const allRurekey = { ...strictRurekey, ...fallbackRurekey };

// 是否已生成映射表
let GetK = false, AMK = [];
function ObjKA(i) {
  GetK = true;
  AMK = Object.entries(i); // 形如 [ [ '日本','JP' ], ['香港','HK'], ...]
}

/**
 * 核心 operator
 */
function operator(pro) {
  const Allmap  = {};
  const outList = getList(outputName);
  let inputList, retainKey = "";

  if (inname !== "") {
    inputList = [ getList(inname) ];
  } else {
    // 无 in= 参数时，尝试中文/国旗/英文全称/英文缩写
    inputList = [ ZH, FG, QC, EN ];
  }

  // 构建 地区=>输出名 的映射(如“日本->JP or 🇯🇵”，看 out=什么)
  inputList.forEach((arr) => {
    arr.forEach((value, valueIndex) => {
      Allmap[value] = outList[valueIndex];
    });
  });

  // 过滤节点
  if (clear || nx || blnx || key) {
    pro = pro.filter((res) => {
      const rN = res.name;
      const shouldKeep =
        !(clear && nameclear.test(rN)) &&
        !(nx && namenx.test(rN)) &&
        !(blnx && !nameblnx.test(rN)) &&
        !(key && !(keya.test(rN) && /2|4|6|7/i.test(rN)));
      return shouldKeep;
    });
  }

  const BLKEYS = BLKEY ? BLKEY.split("+") : "";

  pro.forEach((e) => {
    let bktf = false, ens = e.name;
    let matchedStrict   = false;
    let matchedFallback = false;

    // ========== 1) 先尝试“严格匹配” ==========
    for (const region in strictRurekey) {
      if (strictRurekey[region].test(e.name)) {
        // 严格匹配：直接替换 e.name
        e.name = e.name.replace(strictRurekey[region], region);
        matchedStrict = true;
        break;
      }
    }

    // ========== 2) 若严格失败，再宽松匹配(并同样替换 e.name) ==========
    if (!matchedStrict) {
      for (const region in fallbackRurekey) {
        if (fallbackRurekey[region].test(e.name)) {
          e.name = e.name.replace(fallbackRurekey[region], region);
          matchedFallback = true;
          break;
        }
      }
    }

    // ========== 3) 后续：保留关键词 / 倍数 等通用处理 (不区分严格 or 宽松) ==========

    Object.keys(allRurekey).forEach((ikey) => {
      if (allRurekey[ikey].test(e.name)) {
        e.name = e.name.replace(allRurekey[ikey], ikey);
        if (BLKEY) {
          bktf = true;
          let BLKEY_REPLACE = "",
              re            = false;
          BLKEYS.forEach((i) => {
            if (i.includes(">") && ens.includes(i.split(">")[0])) {
              if (allRurekey[ikey].test(i.split(">")[0])) {
                e.name += " " + i.split(">")[0];
              }
              if (i.split(">")[1]) {
                BLKEY_REPLACE = i.split(">")[1];
                re = true;
              }
            } else {
              if (ens.includes(i)) {
                e.name += " " + i;
              }
            }
            retainKey = re
              ? BLKEY_REPLACE
              : BLKEYS.filter((items) => e.name.includes(items));
          });
        }
      }
    });

    // block-quic
    if (blockquic == "on") {
      e["block-quic"] = "on";
    } else if (blockquic == "off") {
      e["block-quic"] = "off";
    } else {
      delete e["block-quic"];
    }

    // 如果还没保留字段 && 存在 BLKEY
    if (!bktf && BLKEY) {
      let BLKEY_REPLACE = "", re = false;
      BLKEYS.forEach((i) => {
        if (i.includes(">") && e.name.includes(i.split(">")[0])) {
          if (i.split(">")[1]) {
            BLKEY_REPLACE = i.split(">")[1];
            re = true;
          }
        }
      });
      retainKey = re
        ? BLKEY_REPLACE
        : BLKEYS.filter((items) => e.name.includes(items));
    }

    // 保留固定格式
    let ikey = "", ikeys = "";
    if (blgd) {
      regexArray.forEach((regex, index) => {
        if (regex.test(e.name)) {
          ikeys = valueArray[index];
        }
      });
    }

    // 匹配倍率
    if (bl) {
      const match = e.name.match(
        /((倍率|X|x|×)\D?((\d{1,3}\.)?\d+)\D?)|((\d{1,3}\.)?\d+)(倍|X|x|×)/
      );
      if (match) {
        const rev = match[0].match(/(\d[\d.]*)/)[0];
        if (rev !== "1") {
          ikey = rev + "×";
        }
      }
    }

    // ========== 4) 最终，根据映射表拼接国旗 / 前缀 / 倍数 等 ==========

    !GetK && ObjKA(Allmap);
    const findKey = AMK.find(([k]) => e.name.includes(k));

    let firstName = "", nNames = "";
    if (nf) { 
      firstName = FNAME;
    } else { 
      nNames = FNAME;
    }

    if (findKey?.[1]) {
      const findKeyValue = findKey[1]; // 可能是国旗/中文/英文，视 out= 而定
      let keyover = [], usflag = "";

      // 若指定输出国旗
      if (addflag) {
        const index = outList.indexOf(findKeyValue);
        if (index !== -1) {
          usflag = FG[index];
          usflag = usflag === "🇹🇼" ? "🇨🇳" : usflag; // 台湾国旗特殊处理
        }
      }

      keyover = keyover
        .concat(firstName, usflag, nNames, findKeyValue, retainKey, ikey, ikeys)
        .filter((k) => k !== "");
      e.name = keyover.join(FGF);

    } else {
      // 如果既没严格/宽松成功替换到地区，或者替换后仍无法在 AMK 找到对应
      // => 是否保留原节点？
      // （注：因为 e.name 已经做过几轮 .replace() 了，所以未必是原始名字）
      if (!matchedStrict && !matchedFallback) {
        // 这里表示完全没匹配到任何地区
        if (nm) {
          // 如果用户要保留
          e.name = [FNAME, e.name].filter(Boolean).join(FGF);
        } else {
          // 否则清空此节点
          e.name = null;
        }
      } else {
        // matched，但 e.name 在 AMK 里找不到对应键(极少见情况)
        // 依然可以选择保留 e.name
        if (nm) {
          e.name = [FNAME, e.name].filter(Boolean).join(FGF);
        } else {
          e.name = null;
        }
      }
    }
  });

  // 过滤 name=null
  pro = pro.filter((e) => e.name !== null);

  // 去重 / 计数
  pro = jxh(pro);

  // 分组排序
  if (blpx) {
    pro = fampx(pro);
  }

  // 关键字二次过滤
  if (key) {
    pro = pro.filter((e) => !keyb.test(e.name));
  }

  return pro;
}

// 根据 in= / out= 获取对应数组
function getList(arg) {
  switch (arg) {
    case 'us':
      return EN;
    case 'gq':
      return FG;
    case 'quan':
      return QC;
    default:
      return ZH;
  }
}

// jxh - 去重并计数
function jxh(e) {
  const n = e.reduce((acc, cur) => {
    const found = acc.find((item) => item.name === cur.name);
    if (found) {
      found.count++;
      found.items.push({ ...cur, name: `${cur.name}` });
    } else {
      acc.push({
        name: cur.name,
        count: 1,
        items: [{ ...cur, name: `${cur.name}` }],
      });
    }
    return acc;
  }, []);
  const t = Array.prototype.flatMap
    ? n.flatMap((x) => x.items)
    : n.reduce((acc, x) => acc.concat(x.items), []);
  e.splice(0, e.length, ...t);
  return e;
}

// fampx - 分组排序(保留标识节点放后面或分组)
function fampx(pro) {
  const wis = [];
  const wnout = [];
  for (const proxy of pro) {
    const fan = specialRegex.some((regex) => regex.test(proxy.name));
    if (fan) {
      wis.push(proxy);
    } else {
      wnout.push(proxy);
    }
  }
  const sps = wis.map((proxy) =>
    specialRegex.findIndex((regex) => regex.test(proxy.name))
  );
  wis.sort(
    (a, b) =>
      sps[wis.indexOf(a)] -
      sps[wis.indexOf(b)] ||
      a.name.localeCompare(b.name)
  );
  wnout.sort((a, b) => pro.indexOf(a) - pro.indexOf(b));
  return wnout.concat(wis);
}

// 最后导出 operator