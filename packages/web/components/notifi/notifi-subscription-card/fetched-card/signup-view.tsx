import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from "@notifi-network/notifi-react-card";
import { FunctionComponent, useCallback, useState } from "react";

import { Button } from "~/components/buttons";

import { useNotifiModalContext } from "../../notifi-modal-context";

export const SignupView: FunctionComponent = () => {
  const {
    canary: { frontendClient },
  } = useNotifiClientContext();
  const [loading, setLoading] = useState(false);
  const { params, render } = useNotifiSubscriptionContext();
  const { setLocation } = useNotifiModalContext();

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
          setLocation("history");
        } else {
          setLocation("edit");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [frontendClient, params, render, setLocation]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-subtitle1 font-subtitle1">
        Verify your wallet with Notifi to get Notifications
      </p>
      <Button mode="primary" disabled={loading} onClick={() => onClickVerify()}>
        Verify
      </Button>
    </div>
  );
};
