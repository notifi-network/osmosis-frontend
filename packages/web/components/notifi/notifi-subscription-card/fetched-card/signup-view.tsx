import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from "@notifi-network/notifi-react-card";
import { FunctionComponent, useCallback, useState } from "react";

import { Button } from "~/components/buttons";

import { useNotifiModalContext } from "../../notifi-modal-context";

export const SignupView: FunctionComponent = () => {
  const { client } = useNotifiClientContext();
  const [loading, setLoading] = useState(false);
  const { params } = useNotifiSubscriptionContext();
  const { setLocation } = useNotifiModalContext();

  const onClickVerify = useCallback(async () => {
    setLoading(true);
    try {
      if (params.walletBlockchain === "OSMOSIS") {
        await client.logIn({
          walletBlockchain: "OSMOSIS",
          signMessage: params.signMessage,
        });

        const data = await client.fetchData();

        const defaultTargetGroup = data.targetGroups?.find(
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
  }, [client, params.signMessage, params.walletBlockchain, setLocation]);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <p className="text-subtitle1 font-subtitle1">
        Verify your wallet with Notifi to get Notifications
      </p>
      <Button mode="primary" disabled={loading} onClick={() => onClickVerify()}>
        Verify
      </Button>
    </div>
  );
};
