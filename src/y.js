import "./style/overrides.css";

import "./style/components.css";
import "./style/main.css";
import "./style/tables.css";

import "./style/normalize.css";
import "./style/taxes-4186f7.css";
import sessionManager from "./session-manager";
import { createApp, h } from "vue";
import App from "./App.vue";
import { createStore } from "vuex";
import router from "./router";
import eventBus from "./eventBus";

// Vuex Store
const store = createStore({
  state() {
    return {
      username: "",
      currentSugia: null,
      tasksForUser: null,
      helpText: null,
      paymentException: null,
      transmissionException: null,
      newSugiaDetails: { id: null, name: null, errMsgs: [], status: null },
      newSugiaInProgress: { show: false, color: null },
      showValidateSugiaDialog: false,
    };
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

// Set up EventBus listeners
eventBus.on("idle", () => {
  sessionManager.logout();
});

eventBus.on("logoutSuccess", () => {
  if (router.currentRoute.value.name !== "Login") {
    router.push({ name: "Login" });
  }
});

// Handle beforeunload event
window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  loginService
    .logout()
    .then(() => {
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

// const app = createApp(App)
const app = createApp({
  created: function () {
    if (sessionManager.isLogged()) {
      sessionManager.alreadyLogged();
    }
  },
});

// Using Vuetify
app.use(Vuetify, { rtl: true });

// Using Vuex
app.use(store);

app.use(router);

app.mount("#app");
