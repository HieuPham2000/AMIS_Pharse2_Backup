import createNumberMask from "text-mask-addons/dist/createNumberMask";
/**
 * Xâu định dạng hiển thị ngày tháng
 */
export const DATE_DISPLAY_TOKEN = "DD/MM/YYYY";
/**
 * Xâu định dạng value ngày tháng
 */
export const DATE_VALUE_TOKEN = "YYYY-MM-DD";
/**
 * Ký tự phân cách phần nguyên và phần thập phân
 */
export const DECIMAL_SEPARATOR = ",";
/**
 * Ký tự phân cách hàng nghìn
 */
export const THOUSANDS_SEPARATOR = ".";

/**
 * Mask input decimal
 */
export const DECIMAL_MASK = createNumberMask({
  prefix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: THOUSANDS_SEPARATOR,
  allowNegative: false,
});