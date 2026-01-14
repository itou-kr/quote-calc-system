import { createInstance } from 'i18next';
import type { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import ChainBackend, { ChainedBackendOptions } from 'i18next-chained-backend';
import  HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import { yupSetting } from '@front/config/yup';

const detector = new LanguageDetector(null, {
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
    htmlTag: document.documentElement,
});

const initOptions: InitOptions<ChainedBackendOptions> = {
    fallbackLng: 'ja',
    returnEmptyString: false,
    backend: {
        backends: [HttpBackend],
        backendOptions: [
            {
                loadPath: '/i18n/locales/{{lng}}.json',
            },
        ],
    },
    interpolation: {
        escapeValue: false,
    },
};

/**
 * ロケールの設定
 * 2回再描画がかかる対策
 * @returns
 */
export async function setupI18n() {
    const instance = createInstance();
    await instance.use(ChainBackend).use(initReactI18next).use(detector).init(initOptions, yupSetting);
    return instance;
}
