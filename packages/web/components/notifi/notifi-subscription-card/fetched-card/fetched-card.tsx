import { CardConfigItemV1 } from "@notifi-network/notifi-frontend-client";
import { useNotifiSubscriptionContext } from "@notifi-network/notifi-react-card";
import { FunctionComponent } from "react";

import { HistoryView } from "./history-view";

export const FetchedCard: FunctionComponent<{
  data: CardConfigItemV1;
}> = ({ data }) => {
  const { cardView } = useNotifiSubscriptionContext();

  if (cardView.state === "preview") {
    return <HistoryView />;
  } else if (cardView.state === "history") {
    return <HistoryView />;
  } else if (cardView.state === "signup") {
    return <HistoryView />;
  } else if (cardView.state === "edit") {
    return <HistoryView />;
  } else {
    return null;
  }
};
