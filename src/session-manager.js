import loginService from "./services/loginService";
import IdleJs from "idle-js";
import eventBus from "./eventBus";

const LOCAL_STORAGE_KEYS = {
  lastLoginTime: "llt",
  origin: "origin",
  currentUser: "currentUser",
  onIdleDt: "onIdleDt",
};

var idle = new IdleJs({
  idle: Number(import.meta.env.VITE_IDLE_TIME), // idle time in ms
  events: ["mousemove", "keydown", "mousedown", "touchstart"], // events that will trigger the idle resetter
  onIdle: function () {
    eventBus.$emit("idle");
  },
  onActive: function () {
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.onIdleDt, new Date());
  }, // callback function to be executed after back form idleness
  onHide: function () {}, // callback function to be executed when window become hidden
  onShow: function () {}, // callback function to be executed when window become visible
  keepTracking: true, // set it to false if you want to be notified only on the first idleness change
  startAtIdle: true, // set it to true if you want to start in the idle state
});

function stopAndResetIdle() {
  console.log("idle reset");
  idle.stop().reset();
}

function startIdle() {
  console.log(
    "start idle",
    Number(import.meta.env.VITE_IDLE_TIME) / 1000,
    "seconds"
  );
  idle.start();
}

function onLoginSuccess(res) {
  if (res != undefined) {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.origin,
      "+" + window.location.origin.toString()
    );
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.currentUser,
      JSON.stringify(res.data)
    );
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.onIdleDt, new Date());

    startIdle();
  }

  return res;
}

function clearLeftovers() {
  window.localStorage.clear();
  window.sessionStorage.clear();
}

function deleteCookies() {
  var cookies = document.cookie;
  let arrayCookie = cookies.split(";");
  for (var i = 0; i < arrayCookie.length; ++i) {
    var myCookie = arrayCookie[i];
    var pos = myCookie.indexOf("=");
    var name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

function logout() {
  loginService
    .logout()
    .then((response) => {
      clearLeftovers();
      deleteCookies();
      stopAndResetIdle();
      eventBus.$emit("logoutSuccess");
      console.log("App.logout method successful");
    })
    .catch((error) => {
      console.log("App.logout method ERROR: " + error);
    });
}

function alreadyLogged() {
  startIdle();
}

function timeElapsedFromLogin() {
  let date = new Date();
  let sDate = new Date(
    window.localStorage.getItem(LOCAL_STORAGE_KEYS.onIdleDt)
  );
  return (
    date - sDate < Number(import.meta.env.VITE_IDLE_TIME) &&
    !!window.localStorage.getItem(LOCAL_STORAGE_KEYS.currentUser)
  );
}

function isLogged() {
  if (!idle.idle) {
    // if the user is active
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.onIdleDt, new Date());
    return true;
  }

  return timeElapsedFromLogin();
}

function isRakaz() {
  return obj.currentUser?.userRole === "rakaz";
}

function isBakar() {
  return obj.currentUser?.userRole === "bakar";
}

function isManager() {
  return obj.currentUser?.userRole === "manager";
}

function isMefakeach() {
  return obj.currentUser?.userRole === "mefakeach";
}

var obj = {
  isBakar,
  isManager,
  isMefakeach,
  isRakaz,
  logout,
  alreadyLogged,
  isLogged,
  onLoginSuccess,
  clearLeftovers,
  deleteCookies,
  stopAndResetIdle,
  get currentUser() {
    return JSON.parse(
      window.localStorage.getItem(LOCAL_STORAGE_KEYS.currentUser)
    );
  },
};

export default obj;
