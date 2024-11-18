import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { I18nContext, languages, type Language } from "./lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Matching from "./pages/Matching";
import Events from "./pages/Events";
import Support from "./pages/Support";

function App() {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = languages[language];
    
    for (const k of keys) {
      if (!value || typeof value !== "object") {
        return key;
      }
      value = value[k];
    }

    return value || key;
  };

  return (
    <ErrorBoundary>
      <I18nContext.Provider value={{ language, setLanguage, t }}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
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
    </ErrorBoundary>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <SWRConfig value={{ 
      fetcher,
      revalidateOnFocus: false,
      shouldRetryOnError: false 
    }}>
      <App />
    </SWRConfig>
  </StrictMode>
);
