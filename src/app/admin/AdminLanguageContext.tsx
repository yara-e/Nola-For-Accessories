"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";

interface AdminLanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(
  undefined
);

export function AdminLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Language>("en");
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    const savedLang = (localStorage.getItem("admin_lang") as Language) || "en";
    setLangState(savedLang);
    const newDir = savedLang === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = savedLang;
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    const newDir = newLang === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    localStorage.setItem("admin_lang", newLang);
    document.documentElement.dir = newDir;
    document.documentElement.lang = newLang;
  };

  const toggleLanguage = () => {
    setLanguage(lang === "en" ? "ar" : "en");
  };

  return (
    <AdminLanguageContext.Provider
      value={{ lang, toggleLanguage, setLanguage, dir }}
    >
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error(
      "useAdminLanguage must be used within an AdminLanguageProvider"
    );
  }
  return context;
}