"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { ConfigProvider, theme } from "antd";
import { cloudColors } from "../../theme/colors";

type ThemeMode = "dark" | "light";
let fallbackTheme: ThemeMode = "dark";

const ThemeModeContext = createContext<{
  mode: ThemeMode;
  toggleMode: () => void;
} | null>(null);

function subscribeToTheme(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("dashboard-theme-change", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("dashboard-theme-change", listener);
  };
}

function getSavedTheme(): ThemeMode {
  try {
    return window.localStorage.getItem("dashboard-theme") === "light" ? "light" : "dark";
  } catch {
    return fallbackTheme;
  }
}

function getServerTheme(): ThemeMode {
  return "dark";
}

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    fontFamily: "var(--font-inter)",
    colorPrimary: cloudColors[100],
    colorPrimaryHover: cloudColors[300],
    colorPrimaryActive: cloudColors[500],
    colorPrimaryText: cloudColors[100],
    colorTextLightSolid: cloudColors[950],
    colorTextBase: cloudColors[100],
    colorText: cloudColors[100],
    colorTextSecondary: cloudColors[300],
    colorTextTertiary: cloudColors[300],
    colorBgBase: cloudColors[950],
    colorBgLayout: cloudColors[950],
    colorBgContainer: cloudColors[900],
    colorBgElevated: cloudColors[700],
    colorBorder: cloudColors[700],
    colorBorderSecondary: cloudColors[700],
    colorLink: cloudColors[100],
    colorLinkHover: cloudColors[300],
  },
};

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    fontFamily: "var(--font-inter)",
    colorPrimary: "#39445c",
    colorBgBase: "#ffffff",
    colorBgLayout: "#f7f8fa",
    colorBgContainer: "#ffffff",
    colorText: "#202531",
    colorTextSecondary: "#687181",
    colorBorder: "#dfe3e9",
    colorBorderSecondary: "#e9ebef",
  },
};

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error("useThemeMode must be used within AntdThemeProvider");
  return context;
}

export function AntdThemeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribeToTheme, getSavedTheme, getServerTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const toggleMode = () => {
    const next = mode === "dark" ? "light" : "dark";
    fallbackTheme = next;
    try {
      window.localStorage.setItem("dashboard-theme", next);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
    window.dispatchEvent(new Event("dashboard-theme-change"));
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ConfigProvider theme={mode === "dark" ? darkTheme : lightTheme}>
        {children}
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
}
