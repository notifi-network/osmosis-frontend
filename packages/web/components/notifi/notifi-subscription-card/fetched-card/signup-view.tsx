import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from "@notifi-network/notifi-react-card";
import { FunctionComponent, useCallback, useState } from "react";

export const SignupView: FunctionComponent = () => {
  const {
    canary: { frontendClient },
  } = useNotifiClientContext();
  const [loading, setLoading] = useState(false);
  const { params, render, setCardView } = useNotifiSubscriptionContext();

  const onClickVerify = useCallback(async () => {
    setLoading(true);
    try {
      if (params.walletBlockchain === "OSMOSIS") {
        await frontendClient.logIn({
          walletBlockchain: "OSMOSIS",
          signMessage: params.signMessage,
        });

        const data = await frontendClient.fetchData();
        render(data);

        const defaultTargetGroup = data.targetGroup?.find(
          (it) => it?.name === "Default"
        );
        if (defaultTargetGroup !== undefined) {
          setCardView({ state: "history" });
        } else {
          setCardView({ state: "edit" });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [frontendClient, params, render, setCardView]);

  return (
    <>
      Verify your wallet with Notifi to get Notifications
      <button
        className={"button flex flex-col gap-1"}
        disabled={loading}
        onClick={() => onClickVerify()}
      >
        Verify
      </button>
    </>
  );
};
