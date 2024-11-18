import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { I18nContext, languages, type Language } from "./lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Matching from "./pages/Matching";
import Events from "./pages/Events";
import Support from "./pages/Support";

function App() {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    const keys = key.split('.');
    let value = languages[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return key;
      }
    }
    return value as string;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/matching" component={Matching} />
            <Route path="/events" component={Events} />
            <Route path="/support" component={Support} />
            <Route>404 - Page Not Found</Route>
          </Switch>
        </main>
        <Footer />
      </div>
      <Toaster />
    </I18nContext.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <App />
    </SWRConfig>
  </StrictMode>
);
