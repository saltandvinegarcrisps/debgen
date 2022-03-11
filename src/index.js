import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

async function initI18next() {
    await i18next
        .use(HttpApi)
        .use(LanguageDetector)
        .init({
            debug: true,
            supportedLngs: ["de", "en"],
            fallbackLng: "en",
            nonExplicitSupportedLngs: true,
            backend: {
                loadPath: "/lang/{{lng}}.json",
            },
        });
}

function translatePageElements() {
    const translatableElements = document.querySelectorAll(
        "[data-i18n-key]",
    );
    translatableElements.forEach((el) => {
        const key = el.getAttribute("data-i18n-key");

        const interpolations = el.getAttribute("data-i18n-opt");
        const parsedInterpolations = interpolations
            ? JSON.parse(interpolations)
            : {};

        el.innerHTML = i18next.t(key, parsedInterpolations);
    });
}

function bindLocaleSwitcher(initialValue) {
    const switcher = document.querySelector(
        "[data-i18n-switcher]",
    );

    switcher.value = initialValue;

    switcher.onchange = (e) => {
        i18next
            .changeLanguage(e.target.value)
            .then(translatePageElements);
    };
}

// Init
(async function () {
    i18next.on("languageChanged", (newLanguage) => {
        document.documentElement.lang = newLanguage;
        document.documentElement.dir = i18next.dir(newLanguage);
    });

    await initI18next();
    translatePageElements();
    bindLocaleSwitcher(i18next.resolvedLanguage);
})();