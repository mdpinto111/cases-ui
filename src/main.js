import "./assets/main.css";
import { createStore } from "vuex";
import sessionManager from "./session-manager";
import { createApp } from "vue";
import { createPinia } from "pinia";

import vuetifyHe from "vuetify/lib/locale/he";

import i18n from "./plugins/i18n";
import eventBus from "./eventBus";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import { configure, defineRule } from "vee-validate";
import { required, max, numeric, min } from "@vee-validate/rules";
import ValidateUtil from "./scripts/validate";

configure({
  generateMessage: ValidateUtil.customErrorMessages,
  validateOnInput: true, // You can set other global configuration options here
});

// Define the rules
defineRule("required", required);
defineRule("numeric", numeric);
defineRule("min", min);
defineRule("max", max);

const store = createStore({
  state: {
    username: "",
    currentSugia: null,
    tasksForUser: null,
    helpText: null,
    paymentException: null,
    transmissionException: null,
    newSugiaDetails: { id: null, name: null, errMsgs: [], status: null },
    newSugiaInProgress: { show: false, color: null },
    showValidateSugiaDialog: false,
  },
  mutations: {
    SET_USERNAME: (state, payload) => {
      state.username = payload;
    },
    SET_CURRENTSUGIA: (state, payload) => {
      state.currentSugia = payload;
    },
    SET_TASKSFORUSER: (state, payload) => {
      state.tasksForUser = payload;
    },
    SET_HELPTEXT: (state, payload) => {
      state.helpText = payload;
    },
    SET_PAYMENTEXCEPTION: (state, payload) => {
      state.paymentException = payload;
    },
    SET_TRANSMISSIONEXCEPTION: (state, payload) => {
      state.transmissionException = payload;
    },
    SET_NEWSUGIADETAILS: (state, payload) => {
      state.newSugiaDetails = payload;
    },
    SET_NEWSUGIAINPROGRESS: (state, payload) => {
      state.newSugiaInProgress = payload;
    },
    SET_SHOWVALIDATESUGIADIALOG: (state, payload) => {
      state.showValidateSugiaDialog = payload;
    },
  },
  actions: {
    setUsername: (context, payload) => {
      context.commit("SET_USERNAME", payload);
    },
    setCurrentSugia: (context, payload) => {
      context.commit("SET_CURRENTSUGIA", payload);
    },
    setTasksForUser: (context, payload) => {
      context.commit("SET_TASKSFORUSER", payload);
    },
    setHelpText: (context, payload) => {
      context.commit("SET_HELPTEXT", payload);
    },
    setTransmissionException: (context, payload) => {
      context.commit("SET_TRANSMISSIONEXCEPTION", payload);
    },
    setPaymentException: (context, payload) => {
      context.commit("SET_PAYMENTEXCEPTION", payload);
    },
    setNewSugiaDetails: (context, payload) => {
      context.commit("SET_NEWSUGIADETAILS", payload);
    },
    setNewSugiaInProgress: (context, payload) => {
      context.commit("SET_NEWSUGIAINPROGRESS", payload);
    },
    setShowValidateSugiaDialog: (context, payload) => {
      context.commit("SET_SHOWVALIDATESUGIADIALOG", payload);
    },
  },
  getters: {
    getUsername: (state) => state.username,
    getCurrentSugia: (state) => state.currentSugia,
    getTaskForUser: (state) => state.taskForUser,
    getHelpText: (state) => state.helpText,
    getTransmissionException: (state) => state.transmissionException,
    getPaymentException: (state) => state.paymentException,
    getNewSugiaDetails: (state) => state.newSugiaDetails,
    getNewSugiaInProgress: (state) => state.newSugiaInProgress,
    getShowValidateSugiaDialog: (state) => state.showValidateSugiaDialog,
  },
});

const app = createApp(App);
app.component({ App });
app.use(store);
app.use(createPinia());
app.use(router);
app.use(i18n); // No need for app.use(VueI18n)

const vuetify = createVuetify({
  lang: {
    locales: { vuetifyHe },
    current: "vuetifyHe",
  },
  rtl: true,
});

app.use(vuetify); // No need for app.use(VueI18n)

app.mixin({
  created: function () {
    if (sessionManager.isLogged()) {
      sessionManager.alreadyLogged();
    }
    eventBus.on("idle", () => {
      sessionManager.logout();
    });

    eventBus.on("logoutSuccess", () => {
      if (router.currentRoute?.name !== "Login")
        router.push({
          name: "Login",
        });
    });
    addEventListener("beforeunload", (event) => {
      event.preventDefault();
      loginService
        .logout()
        .then((response) => {
          sessionManager.clearLeftovers();
          sessionManager.deleteCookies();
          sessionManager.stopAndResetIdle();
          eventBus.emit("logoutSuccess");
          console.log("App.logout method successful");
          window.close();
        })
        .catch((error) => {
          console.log("App.logout method ERROR: " + error);
          window.close();
        });
    });
  },
});
app.config.productionTip = false;
app.mount("#app");
