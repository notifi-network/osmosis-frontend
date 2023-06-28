import { useNotifiSubscriptionContext } from "@notifi-network/notifi-react-card";
import { FunctionComponent } from "react";

export const HistoryEmpty: FunctionComponent = () => {
  const { setCardView } = useNotifiSubscriptionContext();
  return (
    <>
      No alert history
      <button onClick={() => setCardView({ state: "edit" })}>Edit</button>
    </>
  );
};
