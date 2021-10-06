import { DATE_DISPLAY_TOKEN, DATE_VALUE_TOKEN, DECIMAL_SEPARATOR, THOUSANDS_SEPARATOR } from "./config";
import { DATE_CONST } from "./constant";
export class CommonFunction {

  /**
   * Định dạng dữ liệu lấy từ loadData, nếu null hoặc undefined thì trả về ""
   * @param {*} data 
   * @returns {*} data hoặc ""
   * @author pthieu (06-07-2021)
   */
  static formatData(data) {
    if (data == null || data == undefined) {
      return "";
    }
    return data;
  }

  /** 
   * Format dữ liệu ngày tháng theo định dạng
   * @param {string} date dữ liệu thời gian lấy từ API
   * @param {string} dateToken xâu định dạng
   * @returns {string} ngày tháng đã định dạng theo dateToken
   * @author pthieu (05-07-2021)
   */
  static formatDate(date, dateToken = DATE_DISPLAY_TOKEN) {
    if (!date) {
      return '';
    }
    let dateOrigin = new Date(date);

    // lấy ra ngày và format để luôn có 2 chữ số
    let day = dateOrigin.getDate();
    day = day > 9 ? day : `0${day}`;

    // lấy ra tháng và format để luôn có 2 chữ số
    // chú ý: getMonth() thì tháng bắt đầu từ 0
    let month = dateOrigin.getMonth() + 1; 
    month = month > 9 ? month : `0${month}`;

    // lấy ra năm
    let year = dateOrigin.getFullYear();

    // trả về kết quả dạng DD/MM/YYYY
    // return `${day}/${month}/${year}`;
    dateToken = dateToken.toUpperCase();
    return dateToken.replace("DD", day).replace("MM", month).replace("YYYY", year);
  }

  /** 
   * Phân tách xâu thời gian thành mảng ngày, tháng, năm
   * @param {String} date xâu thời gian theo định dạng
   * @param {String} dateToken xâu định dạng 
   * @returns {Array} mảng ngày, tháng, năm
   * @author pthieu (13-09-2021)
   */
  static splitDateStr(date, dateToken) {
    if (!date) {
      return [];
    }
    dateToken = dateToken.toUpperCase();

    // oldDateToken = oldDateToken.replace("DD", "(\\d{2})").replace("MM", "(\\d{2})").replace("YYYY", "(\\d{4})");
    var strPattern = dateToken.replace(/[DMY]/g,"[0-9]");
    var pattern = new RegExp(strPattern);
    if(!pattern.test(date)) {
      return [];
    }

    var day = date.substr(dateToken.search("DD"), 2);
    var month = date.substr(dateToken.search("MM"), 2);
    var year = date.substr(dateToken.search("YYYY"), 4);
    return [day, month, year];
  }
  /** 
   * Format dữ liệu ngày tháng theo định dạng
   * @param {string} date xâu thời gian theo định dạng cũ
   * @param {string} oldDateToken xâu định dạng cũ
   * @param {string} newDateToken xâu định dạng mới
   * @returns {string} xâu thời gian theo định dạng mới
   * @author pthieu (13-09-2021)
   */
   static changeFormatDate(date, oldDateToken, newDateToken) {
    // if (!date) {
    //   return '';
    // }
    // oldDateToken = oldDateToken.toUpperCase();
    // newDateToken = newDateToken.toUpperCase();

    // var strPattern = oldDateToken.replace(/[DMY]/g,"[0-9]");
    // var pattern = new RegExp(strPattern);
    // if(!pattern.test(date)) {
    //   return '';
    // }

    // var day = date.substr(oldDateToken.search("DD"), 2);
    // var month = date.substr(oldDateToken.search("MM"), 2);
    // var year = date.substr(oldDateToken.search("YYYY"), 4);
    // return newDateToken.replace("DD", day).replace("MM", month).replace("YYYY", year);
    newDateToken = newDateToken.toUpperCase();
    var dateArr = CommonFunction.splitDateStr(date, oldDateToken);
    if(dateArr && dateArr.length === 3) {
      return newDateToken.replace("DD", dateArr[0]).replace("MM", dateArr[1]).replace("YYYY", dateArr[2]);
    }
    return "";
  }

  /** 
   * Format dữ liệu ngày tháng theo định dạng yyyy-mm-dd
   * @param {string} date dữ liệu thời gian lấy từ API
   * @returns {string} xâu định dạng ngày tháng yyyy-mm-dd
   * @author pthieu (05-07-2021)
   */
  static formatDateYYYYMMDD(date) {
   
    if (!date) {
      return '';
    }
    let dateOrigin = new Date(date);

    // lấy ra ngày và format để luôn có 2 chữ số
    let day = dateOrigin.getDate();
    day = day > 9 ? day : `0${day}`;

    // lấy ra tháng và format để luôn có 2 chữ số
    // chú ý: getMonth() thì tháng bắt đầu từ 0
    let month = dateOrigin.getMonth() + 1;
    month = month > 9 ? month : `0${month}`;

    // lấy ra năm và format để luôn có 4 chữ số
    let year = dateOrigin.getFullYear();
    if(year < 10) {
      year = `000${year}`;
    } else if(year < 100) {
      year = `00${year}`;
    } else if(year < 1000) {
      year = `0${year}`;
    }

    // trả về kết quả dạng YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }

  /**
   * Định dạng tiền lương theo dạng xxx.xxx.xxx
   * @param {string} value giá trị tiền
   * @returns {string} xâu định dang xxx.xxx.xxx
   * @author pthieu (06-07-2021)
   */
  static formatMoney(value) {
    if(!value || isNaN(value)) {
      return null;
    }
    // Chú ý: Number(null) => 0
    return Number(value).toLocaleString("it-IT");
  }

  /**
   * Loại bỏ dấu phân tách trong giá trị tiền
   * @param {*} money giá trị tiền có dấu phân tách
   * @returns giá trị tiền đã loại bỏ dấu phân tách
   * @author pthieu (19-07-2021)
   */
  static normalizeMoney(money) {
    if(!money) {
      return null;
    }
    // return money.toString().replaceAll(",", "").replaceAll(".", "");
    return money.toString().replace(/\.|,/g, "")
  }

  /**
   * Loại bỏ dấu tiếng Việt trong xâu
   * @param {string} str xâu cần loại bỏ dấu tiếng Việt
   * @returns {string} xâu đã loại bỏ bỏ dấu tiếng Việt
   * @author pthieu (08-07-2021)
   */
  static nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");

    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }

  /**
   * Thay thế các format item (đánh dấu bằng {chữ số})
   * bằng các xâu đại diện tương ứng truyền vào
   * @param {string} str xâu cần định dạng 
   * @param  {...any} args mảng các xâu đại diện dùng để thay thế
   * @returns {string} 
   * bản sao của str, với các format item đã được thay thế
   * bằng xâu đại diện tương ứng
   * @author pthieu (16-08-2021)
   */
  static formatString(str, ...args) {
      // tìm các format item và thay thế
      return str.replace(/{(\d+)}/g, function(match, number) { 
        // nếu xâu đại diện undefined thì sẽ giữ nguyên format item
        return typeof args[number] != 'undefined'
          ? args[number]
          : match;
      });
  }

  /**
   * Phương thức format số thập phân
   * @param {Number} num giá trị số cần format 
   * @param {NUmber} fixed số chữ số thập phân muốn hiển thị 
   * @param {String} decimalSeparator dấu phân cách phần nguyên và phần thập phân
   * @param {String} thousandsSeparator dấu phân cách phần nghìn
   * @returns {String} giá trị số đã định dạng
   */
  static formatDecimalNumber(num, fixed = null, decimalSeparator = DECIMAL_SEPARATOR, thousandsSeparator = THOUSANDS_SEPARATOR) {
    if(num == undefined || num == null || isNaN(num)) {
      return null;
    }
    // sử dụng [\D] hoặc [^\d]
    // phân tách phần nguyên và phần thập phân
    var arr = num.toString().split(/[\D]/);
    // lấy ra phần nguyên
    // thêm dấu phân tách phần nghìn
    var integerPart = arr[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousandsSeparator}`);
    var fractionalPart = "";
    // kiểm tra xem có phần thập phân không
    if(arr.length === 2) {
      // trong các TH bên dưới
      // hiển thị toàn bộ phần thập phân
      if(fixed == undefined || fixed == null || isNaN(fixed) || fixed < 0) {
        fractionalPart = arr[1];
      } else {
        // còn lại
        // hiển thị theo số chữ số thập phân theo đầu vào
        fractionalPart = arr[1].substr(0, fixed);
      }
    }

    if(fractionalPart) {
      return `${integerPart}${decimalSeparator}${fractionalPart}`;
    }
    return integerPart;
  }

  
  /**
   * Phương thức lấy giá trị số từ xâu số đã định dạng
   * @param {String} str xâu số đã định dạng
   * @param {String} decimalSeparator dấu phân cách phần nguyên và phần thập phân
   * @param {String} thousandsSeparator dấu phân cách phần nghìn
   * @returns {Number} giá trị số thực sự
   */
  static getNumberFromFormatStr(str, decimalSeparator = DECIMAL_SEPARATOR, thousandsSeparator = THOUSANDS_SEPARATOR) {
    if(str == undefined || str == null || str == "") {
      return null;
    }
    str = str.replaceAll(thousandsSeparator, '');
    var arr = str.split(decimalSeparator);

    var num = Number.parseInt(arr[0]);
    if(arr[1]) {
      num += Number.parseInt(arr[1]) / Math.pow(10, arr[1].length);
    }
    return num;
  }

  /**
   * Phương thức xác định ngày đầu tiên/ngày cuối cùng của 1 tháng trong năm
   * @param {Number} year năm
   * @param {Number} month tháng (bắt đầu từ 0)
   * @returns mảng range ngày bắt đầu - ngày kết thúc của tháng đó
   * @author pthieu (24-09-2021)
   */
  static getRangeDateInMonth(year, month) {
    // month bắt đầu từ 0
    // trong 1 năm, giá trị month = 0,..., 11
    // chú ý: khi truyền tham số, giá trị month có thể < 0, > 12
    // khi đó với new Date sẽ tự động tính sang năm sau, hoặc năm trước
    // và kết quả nhận được vẫn chính xác
    return [new Date(year, month, 1), new Date(year, month + 1, 0)];
  }

  /**
   * Phương thức xác định ngày đầu tiên/ngày cuối cùng của 1 quý trong năm
   * @param {Number} year năm
   * @param {Number} quarter quý (bắt đầu từ 0)
   * @returns mảng range ngày bắt đầu - ngày kết thúc của quý đó
   * @author pthieu (24-09-2021)
   */
  static getRangeDateInQuarter(year, quarter) {
    // 1 quý = 3 tháng
    // trong 1 năm, giá trị quarter = {0, 1, 2, 3}
    // chú ý: khi truyền tham số, giá trị quarter có thể < 0, > 3
    // khi đó với cách làm bên dưới, 
    // năm (year) sẽ được chuyển đối tương ứng và vẫn cho kết quả chính xác
    var beginMonth = quarter*3;
    var endMonth = quarter*3 + 2;
    return [new Date(year, beginMonth, 1), new Date(year, endMonth + 1, 0)];
  }

   /**
   * Phương thức xác định ngày đầu tiên/ngày cuối cùng
   * của 1 option (vd: "Hôm nay", "Tháng này",...)
   * @param {String} text option
   * @returns mảng range ngày bắt đầu - ngày kết thúc của option đó
   * @author pthieu (24-09-2021)
   */
  static getRangeDate(text) {
    var today = new Date();
    var year = today.getFullYear();
    // chú ý: tháng bắt đầu từ 0
    var month = today.getMonth();

    // quy ước: quý bắt đầu từ 0 -> 3
    var quarter = Math.floor(month / 3);

    var date = today.getDate();

    // getDay() => CN: 0, T2: 1
    // ta chuyển về: T2: 0, T3: 1,..., CN: 6
    var day = (today.getDay() + 6) % 7;
    // day = (day - 1) >= 0 ? (day - 1) : (day - 1 + 7);

    // fromDate: từ ngày
    // toDate: đến ngày
    var fromDate = null, toDate = null;

    switch(text) {
      case DATE_CONST.TODAY:
        fromDate = today;
        toDate = today;
        break;
      case DATE_CONST.THIS_WEEK:
        fromDate = new Date(year, month, date - day);
        toDate = new Date(year, month, date - day + 6);
        break;
      case DATE_CONST.BEGINNING_WEEK_TO_PRESENT:
        fromDate = new Date(year, month, date - day);
        toDate = today;
        break;
      case DATE_CONST.THIS_MONTH:
        // from = new Date(today.setDate(1));
        fromDate = new Date(year, month, 1);
        toDate = new Date(year, month + 1, 0);
        break;
      case DATE_CONST.BEGINNING_MONTH_TO_PRESENT:
        fromDate = new Date(year, month, 1);
        toDate = today;
        break;
      case DATE_CONST.THIS_QUARTER:
        [fromDate, toDate] = CommonFunction.getRangeDateInQuarter(year, quarter); 
        break;
      case DATE_CONST.BEGINNING_QUARTER_TO_PRESENT:
        // [from, to] = CommonFunction.getRangeDateInQuarter(year, quarter);
        fromDate = new Date(year, quarter*3, 1);
        toDate = today;
        break; 
      case DATE_CONST.THIS_YEAR:
        fromDate = new Date(year, 0, 1);
        toDate = new Date(year, 11, 31);
        break;
      case DATE_CONST.BEGINNING_YEAR_TO_PRESENT:
        fromDate = new Date(year, 0, 1);
        toDate = today;
        break;
      case DATE_CONST.SIX_MONTH_1:
        fromDate = new Date(year, 0, 1);
        toDate = new Date(year, 5, 30);
        break;
      case DATE_CONST.SIX_MONTH_2:
        fromDate = new Date(year, 6, 1);
        toDate = new Date(year, 11, 31);
        break;
      case DATE_CONST.MONTH_1:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 0);
        break;
      case DATE_CONST.MONTH_2:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 1);
        break;
      case DATE_CONST.MONTH_3:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 2);
        break;
      case DATE_CONST.MONTH_4:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 3);
        break;
      case DATE_CONST.MONTH_5:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 4);
        break;
      case DATE_CONST.MONTH_6:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 5);
        break;
      case DATE_CONST.MONTH_7:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 6);
        break;
      case DATE_CONST.MONTH_8:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 7);
        break;
      case DATE_CONST.MONTH_9:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 8);
        break;
      case DATE_CONST.MONTH_10:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 9);
        break;
      case DATE_CONST.MONTH_11:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 10);
        break;
      case DATE_CONST.MONTH_12:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, 11);
        break;
      case DATE_CONST.QUARTER_1:
        [fromDate, toDate] = CommonFunction.getRangeDateInQuarter(year, 0);
        break;
      case DATE_CONST.QUARTER_2:
        [fromDate, toDate] = CommonFunction.getRangeDateInQuarter(year, 1);
        break;
      case DATE_CONST.QUARTER_3:
        [fromDate, toDate] = CommonFunction.getRangeDateInQuarter(year, 2);
        break;
      case DATE_CONST.QUARTER_4:
        [fromDate, toDate] = CommonFunction.getRangeDateInQuarter(year, 3);
        break;
      case DATE_CONST.YESTERDAY:
        fromDate = new Date(year, month, date - 1);
        toDate = fromDate;
        break;
      case DATE_CONST.LAST_WEEK:
        fromDate = new Date(year, month, date - day - 7);
        toDate = new Date(year, month, date - day - 1);
        break;
      case DATE_CONST.LAST_MONTH:
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, month - 1);
        break;
      case DATE_CONST.LAST_QUARTER:
        [fromDate, toDate] = CommonFunction.getRangeDateInQuarter(year, quarter - 1); 
        break;
      case DATE_CONST.LAST_YEAR:
        fromDate = new Date(year - 1, 0, 1);
        toDate = new Date(year - 1, 11, 31);
        break;
      case DATE_CONST.TOMORROW:
        fromDate = new Date(year, month, date + 1);
        toDate = fromDate;
        break;
      case DATE_CONST.NEXT_WEEK:
        fromDate = new Date(year, month, date - day + 7);
        toDate = new Date(year, month, date - day + 13);
        break;
      case DATE_CONST.NEXT_MONTH:
        fromDate = new Date(year, month + 1, 1);
        toDate = new Date(year, month + 2, 0);
        [fromDate, toDate] = CommonFunction.getRangeDateInMonth(year, month + 1);
        break;
      case DATE_CONST.NEXT_QUARTER:
        [fromDate, toDate] = CommonFunction.getRangeDateInQuarter(year, quarter + 1);
        break; 
      case DATE_CONST.NEXT_YEAR:
        fromDate = new Date(year + 1, 0, 1);
        toDate = new Date(year + 1, 11, 31);
        break;
      default:
        break;
    }
    // ra sai vì convert sang kiểu date khác
    // return [JSON.stringify(fromDate), JSON.stringify(toDate)];

    // return [fromDate.toString(), toDate.toString()];
    // return [fromDate, toDate];
    if(fromDate && toDate) {
      return [
        CommonFunction.formatDate(fromDate.toString(), DATE_VALUE_TOKEN), 
        CommonFunction.formatDate(toDate.toString(), DATE_VALUE_TOKEN)
      ];
    } 
    return [null, null];
  }
}