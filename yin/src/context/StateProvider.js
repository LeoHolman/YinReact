import React, { useContext, useState, createContext } from "react";

const StateContext = createContext({ activeLang: "", setActiveLang: () => {} });
export const useStateContext = () => useContext(StateContext);

export const useStateProvider = (props) => {
  const [activeLang, setActiveLang] = useState("");
  return <StateContext.Provider value={{ activeLang, setActiveLang }} />;
};

export default useStateProvider;
