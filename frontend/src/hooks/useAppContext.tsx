import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { BLOCKS } from "@/data/mockData";
import type { Block, Role } from "@/types";

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  blockId: string;
  setBlockId: (id: string) => void;
  block: Block;
  districtId: string;
  setDistrictId: (id: string) => void;
  language: string;
  setLanguage: (l: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("farmer");
  const [blockId, setBlockId] = useState("berasia");
  const [districtId, setDistrictId] = useState("bhopal");
  const [language, setLanguage] = useState("English");

  const value = useMemo<AppState>(() => {
    const block = BLOCKS.find((b) => b.id === blockId) ?? BLOCKS[0]!;
    return {
      role,
      setRole,
      blockId,
      setBlockId: (id: string) => {
        setBlockId(id);
        const b = BLOCKS.find((x) => x.id === id);
        if (b) setDistrictId(b.districtId);
      },
      block,
      districtId,
      setDistrictId,
      language,
      setLanguage,
    };
  }, [role, blockId, districtId, language]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
