import baseService from "../services/baseService";

export default {
  getAllResourceBundle(system, locale) {
    return baseService.get(
      "resourcebundle/resourcebundle/allResourcesBySystemAndLocales",

      {
        system: system,

        locales: locale,
      }
    );
  },
};
