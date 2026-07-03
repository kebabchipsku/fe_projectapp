import { createContext, useContext, useMemo, useState } from "react";

const HelpCenterContext = createContext(null);

export function HelpCenterProvider({ children }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeHelpTab, setActiveHelpTab] = useState("pdf");

  const openHelp = (tab = "pdf") => {
    setActiveHelpTab(tab === "video" ? "video" : "pdf");
    setIsHelpOpen(true);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  const value = useMemo(
    () => ({
      isHelpOpen,
      activeHelpTab,
      setActiveHelpTab,
      openHelp,
      closeHelp,
    }),
    [isHelpOpen, activeHelpTab],
  );

  return (
    <HelpCenterContext.Provider value={value}>
      {children}
    </HelpCenterContext.Provider>
  );
}

export function useHelpCenter() {
  const context = useContext(HelpCenterContext);

  if (!context) {
    throw new Error(
      "useHelpCenter harus digunakan di dalam HelpCenterProvider.",
    );
  }

  return context;
}
