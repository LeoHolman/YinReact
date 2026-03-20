import React, { createContext, useState } from 'react';

const LanguageContext = createContext({
  setActiveLang: () => {},
});

export default LanguageContext;