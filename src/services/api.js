import axios from "axios";

//import MockAdapter from 'axios-mock-adapter'

import router from "../router";

import i18nUtil from "../plugins/i18nUtil";

import eventBus from "../eventBus";

import sessionManager from "../session-manager.js";

//export var mock = new MockAdapter()

// create a new axios instance

const instance = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API, // + 'LMDP/',

  timeout: 3000000,

  withCredentials: true,
});

instance.baseURL = import.meta.env.VITE_ROOT_API; // + 'LMDP/'

// before a request is made start the nprogress

instance.interceptors.request.use((config) => {
  if (shouldLoading(config)) window.theApp.setIsLoading(true);

  return config;
});

function shouldLoading(config) {
  return (
    !config.url.includes("getNewSugiaStatus") &&
    !config.url.includes("getAmountExceptions") &&
    !config.url.includes("empuser/all")
  );
}

// before a response is returned stop nprogress

instance.interceptors.response.use(
  (response) => {
    if (shouldLoading(response.config)) window.theApp.setIsLoading(false);

    return response;
  },

  (error) => {
    if (shouldLoading(response.config)) window.theApp.setIsLoading(false);

    console.log("The error: " + error);

    if (error.response.status === 401) {
      sessionManager.logout();

      router.push({ path: "/login", query: null });
    } else if (error.response.status >= 400) {
      console.log(
        "error accessing url " +
          error.request.responseURL +
          ", service may be down!"
      );

      eventBus.$emit("api-error", error);

      // Throw the original exeption, to display the error message in login page

      if (
        error.request.responseURL &&
        error.request.responseURL.includes("login/login")
      ) {
        throw error;
      }

      throw new Error(i18nUtil.t("api.contactCallCenter"));
    } else {
      throw error;
    }
  }
);

// *************************************** Mockups ********************************************* //

/*

If you want to use mock to test your API offline (without the server), the steps are, as following :

1. set the USE_MOCKS = true in your env.js file

2. add the mock you want to the relevant xxxMock file inside loadAllMockingRequests function, see example in tasksServiceMock

3. run the code to testremark

*/

// if (import.meta.env.VITE_USE_MOCKS === true) {

//   // alert('Using mocks!')

//   mock = new MockAdapter(instance)

//   // importing the mock files and calling the loadAllMockingRequests that should contain the mocks

//   let casesServiceMock = require('casesServiceMock.js')

//   casesServiceMock.loadAllMockingRequests()

//   let docsServiceMock = require('./docsServiceMock.js')

//   docsServiceMock.loadAllMockingRequests()

//   let entirexServiceMock = require('./entirexServiceMock.js')

//   entirexServiceMock.loadAllMockingRequests()

//   let loginServiceMock = require('./loginServiceMock.js')

//   loginServiceMock.loadAllMockingRequests()

//   let resourcebundleServiceMock = require('./resourcebundleServiceMock.js')

//   resourcebundleServiceMock.loadAllMockingRequests()

//   let sugiaServiceMock = require('./sugiaServiceMock.js')

//   sugiaServiceMock.loadAllMockingRequests()

//   let tasksServiceMock = require('./tasksServiceMock.js')

//   tasksServiceMock.loadAllMockingRequests() // you have an example here

//   let usersServiceMock = require('./usersServiceMock.js')

//   usersServiceMock.loadAllMockingRequests()

//   mock.onAny().passThrough() // has to be at the end, otherwise it win't set the mocking requests.

// }

// *************************************** End of Mockups ********************************************* //

export default instance;
