import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from "@notifi-network/notifi-react-card";
import { FunctionComponent, useCallback } from "react";

import { useNotifiConfig } from "../../notifi-config-context";
import { InputWithIcon } from "./input-with-icon";

export const EditEmail: FunctionComponent = () => {
  const { email, loading, setEmail, render, setLoading } =
    useNotifiSubscriptionContext();
  const {
    canary: { frontendClient },
  } = useNotifiClientContext();
  const config = useNotifiConfig();

  const onBlur = useCallback(async () => {
    setLoading(true);
    try {
      await frontendClient.ensureTargetGroup({
        name: "Default",
        emailAddress: email,
      });

      if (config.state === "fetched") {
        for (let i = 0, n = config.data.eventTypes.length; i < n; ++i) {
          const row = config.data.eventTypes[i];
          await frontendClient.ensureTargetGroup({
            name: row.name,
            emailAddress: email,
          });
        }
      }

      const data = await frontendClient.fetchData();
      render(data);
    } finally {
      setLoading(false);
    }
  }, [config, email, frontendClient, render, setLoading]);

  return (
    <InputWithIcon
      iconId="email"
      disabled={loading}
      type="email"
      value={email}
      onInput={(e) => setEmail(e.currentTarget.value)}
      onBlur={() => onBlur()}
      placeholder="hello@osmosis.team"
    />
  );
};
