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
      // Support cards
      fundingTitle: "Funding",
      fundingDesc: "Providing funding opportunities to support startup growth",
      incubationTitle: "Incubation Program",
      incubationDesc: "Program providing essential resources and know-how for business growth",
      officeTitle: "Office Space",
      officeDesc: "Optimal work environment and networking space for startups",
      mentorshipTitle: "Mentorship",
      mentorshipDesc: "Mentoring by experienced entrepreneurs and business experts",
      // FAQ
      faqFundingQ: "How do I apply for funding?",
      faqFundingA: "The funding application process starts with completing your profile and submitting a business plan. After review, we'll provide advice on suitable funding methods.",
      faqIncubationQ: "How long is the incubation program?",
      faqIncubationA: "Our typical program runs for 3-6 months. During this period, you'll receive mentoring, workshops, and networking event opportunities.",
      faqOfficeQ: "Are there conditions for using office space?",
      faqOfficeA: "Registered startups can choose from flexible plans. The space is available 24/7, with bookable meeting rooms and event spaces.",
      faqMentorshipQ: "How are mentors matched?",
      faqMentorshipA: "After registration, we'll introduce you to suitable mentors based on your business area and challenges. You can confirm compatibility in an initial meeting before starting ongoing support.",
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
      title: "持続可能なスタートアップエコシステムの創造",
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
      // Support cards
      fundingTitle: "資金提供",
      fundingDesc: "スタートアップの成長をサポートする資金調達機会の提供",
      incubationTitle: "インキュベーションプログラム",
      incubationDesc: "事業成長に必要なリソースとノウハウを提供するプログラム",
      officeTitle: "オフィススペースの提供",
      officeDesc: "スタートアップに最適な作業環境とネットワーキングスペース",
      mentorshipTitle: "メンターシップ",
      mentorshipDesc: "経験豊富な起業家やビジネス専門家によるメンタリング",
      // FAQ
      faqFundingQ: "資金調達の申請方法を教えてください。",
      faqFundingA: "資金調達の申請は、まずプロフィールを完成させ、ビジネスプランを提出することから始まります。審査後、適切な資金調達方法についてアドバイスを提供します。",
      faqIncubationQ: "インキュベーションプログラムの期間はどのくらいですか？",
      faqIncubationA: "通常のプログラムは3〜6ヶ月間です。プログラム期間中は、メンタリング、ワークショップ、ネットワーキングイベントなどが提供されます。",
      faqOfficeQ: "オフィススペースの利用条件はありますか？",
      faqOfficeA: "登録済みのスタートアップであれば、フレキシブルなプランから選択して利用できます。24時間利用可能で、会議室やイベントスペースも予約可能です。",
      faqMentorshipQ: "メンターとのマッチング方法について教えてください。",
      faqMentorshipA: "ご登録後、事業領域や課題に基づいて最適なメンターをご紹介します。メンターとの初回面談で相性を確認し、継続的なサポートを受けることができます。",
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
