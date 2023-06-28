import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from "@notifi-network/notifi-react-card";
import { FunctionComponent, useCallback } from "react";

import { InputBox } from "~/components/input";

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
    <InputBox
      disabled={loading}
      className="w-44 md:w-20"
      type="email"
      inputClassName="text-right text-h6 font-h6 md:subtitle1"
      currentValue={email}
      onInput={(value) => setEmail(value)}
      onBlur={() => onBlur()}
      placeholder=""
    />
  );
};
