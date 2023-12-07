import api from "../services/api";

export default {
  async get(url, query, responseType) {
    var t0 = performance.now();

    const res = await api.get(url, {
      params: query,

      responseType: responseType,
    });

    this.updateMonitoring(t0, url, responseType, query, "Get");

    return res;
  },

  async getById(url, id, query) {
    var t0 = performance.now();

    const res = await api.get(`${url}/${id}`, {
      params: query,
    });

    this.updateMonitoring(t0, url + id, null, query, "GetById");

    return res;
  },

  async post(url, data, contentType = "application/json;") {
    var t0 = performance.now();

    const res = await api.post(url, data, {
      headers: {
        "Content-Type": contentType,
      },
    });

    this.updateMonitoring(t0, url, null, data, "Post");

    return res;
  },

  updateMonitoring(t0, url, responseType, query, type) {
    var t1 = performance.now();

    var durationInSeconds = (t1 - t0) / 1000;

    if (durationInSeconds > 5) {
      var baseUrl = import.meta.env.VITE_ROOT_API;

      var env = import.meta.env.NODE_ENV;

      let formData = new FormData();

      let monitoringApp = {
        type: type,

        environment: env,

        baseUrl: baseUrl,

        url: url,

        query: JSON.stringify(query),

        responseType: responseType,

        durationInSeconds: durationInSeconds,

        systemName: "LM",
      };

      formData.append("monitoringApp", JSON.stringify(monitoringApp));

      navigator.sendBeacon(
        baseUrl + "monitoring/insertsNewMonitoringRecord",
        formData
      );

      console.log(
        "Type: " +
          type +
          " Env: " +
          env +
          " Base URL: " +
          baseUrl +
          " Url: " +
          url +
          " Query " +
          JSON.stringify(query) +
          " Response Type " +
          responseType +
          " duration: " +
          (t1 - t0) / 1000 +
          " sec"
      );
    }
  },
};
