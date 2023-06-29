import { useNotifiSubscriptionContext } from "@notifi-network/notifi-react-card";
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { ModalBaseProps } from "~/modals";

type Location = "history" | "expired" | "signup" | "edit";

interface NotifiModalFunctions {
  innerState: Partial<ModalBaseProps>;
  setLocation: (newLocation: Location) => void;
}

const NotifiModalContext = createContext<NotifiModalFunctions>({
  innerState: {},
} as unknown as NotifiModalFunctions);

export const NotifiModalContextProvider: FunctionComponent<
  PropsWithChildren<{}>
> = ({ children }) => {
  const { setCardView } = useNotifiSubscriptionContext();
  const [innerState, setInnerState] = useState<Partial<ModalBaseProps>>({});
  const [location, setLocation] = useState<Location>("signup");

  useEffect(() => {
    switch (location) {
      case "history": {
        setCardView({ state: "history" });
        setInnerState({
          title: "Notifications",
          onRequestBack: () => {
            setLocation("edit");
          },
          backIcon: "setting",
        });
        break;
      }
      case "expired": {
        setCardView({ state: "expired" });
        setInnerState({ title: "Token expired" });
        break;
      }
      case "signup": {
        setCardView({ state: "signup" });
        setInnerState({ title: "Get notifications" });
        break;
      }
      case "edit": {
        setCardView({ state: "edit" });
        setInnerState({
          title: "Notification settings",
          onRequestBack: () => {
            setLocation("history");
          },
        });
        break;
      }
    }
  }, [location, setCardView]);

  return (
    <NotifiModalContext.Provider value={{ innerState, setLocation }}>
      {children}
    </NotifiModalContext.Provider>
  );
};

export const useNotifiModalContext = (): NotifiModalFunctions => {
  const context = useContext(NotifiModalContext);
  return context;
};
