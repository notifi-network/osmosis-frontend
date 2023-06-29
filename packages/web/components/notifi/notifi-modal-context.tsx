import { useNotifiSubscriptionContext } from "@notifi-network/notifi-react-card";
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

import { ModalBaseProps } from "~/modals";

interface NotifiModalFunctions {
  innerState: Partial<ModalBaseProps>;
  historyView: () => void;
  expiredView: () => void;
  signupView: () => void;
  editView: () => void;
}

const NotifiModalContext = createContext<NotifiModalFunctions>({
  innerState: {},
} as unknown as NotifiModalFunctions);

export const NotifiModalContextProvider: FunctionComponent<
  PropsWithChildren<{}>
> = ({ children }) => {
  const { setCardView } = useNotifiSubscriptionContext();
  const [innerState, setInnerState] = useState<Partial<ModalBaseProps>>({});

  const historyView = useCallback(() => {
    setInnerState({ title: "Notifications" });
    setCardView({ state: "history" });
  }, [setCardView]);

  const expiredView = useCallback(() => {
    setInnerState({ title: "Token expired" });
    setCardView({ state: "expired" });
  }, [setCardView]);

  const signupView = useCallback(() => {
    setInnerState({ title: "Get notifications" });
    setCardView({ state: "signup" });
  }, [setCardView]);

  const editView = useCallback(() => {
    setInnerState({
      title: "Notification settings",
      onRequestBack: () => {
        historyView();
      },
    });
    setCardView({ state: "edit" });
  }, [historyView, setCardView]);

  return (
    <NotifiModalContext.Provider
      value={{ innerState, historyView, expiredView, signupView, editView }}
    >
      {children}
    </NotifiModalContext.Provider>
  );
};

export const useNotifiModalContext = (): NotifiModalFunctions => {
  const context = useContext(NotifiModalContext);
  return context;
};
