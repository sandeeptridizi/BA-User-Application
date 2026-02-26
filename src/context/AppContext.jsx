import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [openVerificationModel, setOpenVerificationModal] = useState(false);
  const [openAuthenticationModal, setOpenAuthenticationModal] = useState(false);
  const [pendingOtpPhone, setPendingOtpPhone] = useState(null);
  const [pendingOtpPayload, setPendingOtpPayload] = useState(null);

  return (
    <AppContext.Provider
      value={{
        openVerificationModel,
        setOpenVerificationModal,
        openAuthenticationModal,
        setOpenAuthenticationModal,
        pendingOtpPhone,
        setPendingOtpPhone,
        pendingOtpPayload,
        setPendingOtpPayload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;
