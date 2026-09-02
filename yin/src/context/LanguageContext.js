import { createContext } from "react";

const LanguageContext = createContext({
  setActiveLang: () => {},
});

export default LanguageContext;
