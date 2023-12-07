import i18n from "./i18n";

import router from "../router/index";

import resourcebundleService from "../services/resourcebundleService";

var i18nUtil = {
  testConsole() {
    console.log(i18n.locale);

    console.log(i18n.messages);
  },

  initI18n(login, messages, locale) {
    i18n._initVM({
      locale: locale,

      fallbackLocale: "HE",

      messages: messages,

      dateTimeFormats: "",

      numberFormats: "",
    });

    if (login) {
      this.replaceToDashboard(login);
    }
  },

  loadMessages(login) {
    resourcebundleService
      .getAllResourceBundle("LM", "HE,EN,FR")
      .then((response) => {
        if (response.data) {
          window.localStorage.setItem(
            "messages",
            JSON.stringify(response.data)
          );

          window.localStorage.setItem("locale", "HE");

          this.initI18n(login, response.data, "HE");
        } else {
          window.localStorage.setItem("locale", "HE");

          this.initI18n(
            false,
            JSON.parse(window.localStorage.getItem("messages"))
          );
        }
      })

      .catch((error) => {
        window.localStorage.setItem("locale", "HE");

        this.initI18n(false, { HE: {} }, "HE");

        this.replaceToDashboard(login);
      });
  },

  replaceToDashboard(login) {
    if (login) {
      router.replace("/dashboard");
    }
  },

  t(message, any) {
    return i18n.t(message, any);
  },
};

export default i18nUtil;
