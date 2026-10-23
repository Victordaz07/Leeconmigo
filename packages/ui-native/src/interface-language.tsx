import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { translate, type InterfaceLanguage } from '@lee-conmigo/ui-core';

const LanguageContext = createContext<InterfaceLanguage>('es');
export function InterfaceLanguageProvider({ language, children }: { language: InterfaceLanguage; children: ReactNode }) {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}
export function useTranslation() {
  const language = useContext(LanguageContext);
  const t = useCallback((source: string, ...values: unknown[]) => translate(language, source, ...values), [language]);
  return { language, t };
}
