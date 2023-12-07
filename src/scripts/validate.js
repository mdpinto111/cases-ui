import i18nUtil from "../plugins/i18nUtil";

var ValidateUtil = {
  textFieldRegex() {
    return /^([\n\ra-zA-Z\u05D0-\u05fe,\u20220-9_ \t():'".,?+!₪@%|/–-]+)$/;
  },

  fileNameRegex() {
    return /^([a-zA-Z\u0590-\u05fe0-9 _():'".,?!/–-]+)$/;
  },

  customErrorMessages() {
    return {
      messages: {
        regex: (n) =>
          i18nUtil.t("validate.regexMsg", { field: n }) +
          ". , - ( ) ! : / ? + @ ₪ ' | \" _ %",

        numeric: (n) => i18nUtil.t("validate.numericMsg", { field: n }),
      },
    };
  },
};

export default ValidateUtil;
