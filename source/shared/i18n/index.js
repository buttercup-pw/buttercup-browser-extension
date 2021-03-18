import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import localesConfig from "../../../locales/config.json";

const languages = Object.keys(localesConfig.languages).reduce(
    (previous, currentLangKey) => ({
        ...previous,
        [currentLangKey]: {
            name: localesConfig.languages[currentLangKey].name,
            ...localesConfig.types.reduce(
                (previousType, currentType) => ({
                    ...previousType,
                    [currentType]: require(`../../../locales/${currentLangKey}/${currentType}.json`)
                }),
                {}
            )
        }
    }),
    {}
);

const resources = Object.keys(languages).reduce(
    (previous, currentLangKey) => ({
        ...previous,
        [currentLangKey]: localesConfig.types.reduce(
            (previousType, currentType) => ({
                ...previousType,
                [currentType]: languages[currentLangKey][currentType]
            }),
            {}
        )
    }),
    {}
);

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: localesConfig.fallbackLng,
    react: {
        wait: false
    },
    ns: localesConfig.types,
    defaultNS: "base",
    nsSeparator: ":",
    keySeparator: ".",
    pluralSeparator: "_",
    contextSeparator: "-",
    debug: false,
    saveMissingTo: "all",
    saveMissing: false,
    returnEmptyString: false
});

export default i18n;
