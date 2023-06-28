import { CardConfigItemV1 } from "@notifi-network/notifi-frontend-client";
import { useNotifiSubscriptionContext } from "@notifi-network/notifi-react-card";
import { FunctionComponent } from "react";

import { HistoryView } from "./history-view";
import { SignupView } from "./signup-view";

export const FetchedCard: FunctionComponent<{
  data: CardConfigItemV1;
}> = () => {
  const { cardView } = useNotifiSubscriptionContext();

  if (cardView.state === "history") {
    return <HistoryView />;
  } else if (cardView.state === "signup") {
    return <SignupView />;
  } else if (cardView.state === "edit") {
    return <HistoryView />;
  } else {
    return null;
  }
};
