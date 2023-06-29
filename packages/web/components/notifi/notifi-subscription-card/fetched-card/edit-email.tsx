import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from "@notifi-network/notifi-react-card";
import { FunctionComponent, useCallback } from "react";

import { InputWithIcon } from "./input-with-icon";

export const EditEmail: FunctionComponent = () => {
  const { email, loading, setEmail, render, setLoading } =
    useNotifiSubscriptionContext();
  const {
    canary: { frontendClient },
  } = useNotifiClientContext();

  const onBlur = useCallback(async () => {
    setLoading(true);
    try {
      await frontendClient.ensureTargetGroup({
        name: "Default",
        emailAddress: email,
      });

      const data = await frontendClient.fetchData();
      render(data);
    } finally {
      setLoading(false);
    }
  }, [email, frontendClient, render, setLoading]);

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
