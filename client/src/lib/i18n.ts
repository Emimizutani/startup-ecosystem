import { createContext, useContext } from 'react';

export const languages = {
  en: {
    common: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      profile: "Profile",
      events: "Events",
      matching: "Matching",
      support: "Support",
      search: "Search",
      submit: "Submit",
      cancel: "Cancel",
    },
    home: {
      title: "Building a Sustainable Startup Ecosystem",
      subtitle: "Find your perfect match in tech and innovation",
      getStarted: "Get Started",
    },
    profile: {
      editProfile: "Edit Profile",
      skills: "Skills",
      experience: "Experience",
      contact: "Contact Information",
    },
    matching: {
      findMatches: "Find Matches",
      noMatches: "No matches found",
      filters: "Filters",
    },
    events: {
      upcoming: "Upcoming Events",
      past: "Past Events",
      register: "Register for Event",
    },
    support: {
      startupResources: "Startup Resources",
      mentorship: "Mentorship",
      funding: "Funding",
      contact: "Contact Us",
    },
  },
  ja: {
    common: {
      login: "ログイン",
      register: "登録",
      logout: "ログアウト",
      profile: "プロフィール",
      events: "イベント",
      matching: "マッチング",
      support: "サポート",
      search: "検索",
      submit: "送信",
      cancel: "キャンセル",
    },
    home: {
      title: "持続可能なスタートアップエコシステムを創る",
      subtitle: "テクノロジーとイノベーションで最適なマッチングを",
      getStarted: "始めましょう",
    },
    profile: {
      editProfile: "プロフィール編集",
      skills: "スキル",
      experience: "経験",
      contact: "連絡先",
    },
    matching: {
      findMatches: "マッチングを探す",
      noMatches: "マッチングが見つかりません",
      filters: "フィルター",
    },
    events: {
      upcoming: "今後のイベント",
      past: "過去のイベント",
      register: "イベント登録",
    },
    support: {
      startupResources: "スタートアップリソース",
      mentorship: "メンタリング",
      funding: "資金調達",
      contact: "お問い合わせ",
    },
  },
};

export type Language = keyof typeof languages;
export type TranslationKey = keyof typeof languages.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useI18n = () => useContext(I18nContext);
