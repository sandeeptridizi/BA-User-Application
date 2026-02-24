import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [openVerificationModel, setOpenVerificationModal] = useState(false);
  const [openAuthenticationModal, setOpenAuthenticationModal] = useState(false);

  return (
    <AppContext.Provider
      value={{
        openVerificationModel,
        setOpenVerificationModal,
        openAuthenticationModal,
        setOpenAuthenticationModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;
