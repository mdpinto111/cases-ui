import baseService from "../services/baseService";

export default {
  logout() {
    return baseService.post("logout/logout");
  },

  login(data) {
    return baseService.post("login/login", data);
  },

  getLogin() {
    return baseService.get("/login", {});
  },
};
