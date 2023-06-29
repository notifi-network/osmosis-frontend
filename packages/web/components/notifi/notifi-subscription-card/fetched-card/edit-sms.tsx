import { useNotifiSubscriptionContext } from "@notifi-network/notifi-react-card";
import { FunctionComponent, useCallback } from "react";

import { InputWithIcon } from "./input-with-icon";

export const EditSms: FunctionComponent = () => {
  const { phoneNumber, loading, setPhoneNumber, setLoading } =
    useNotifiSubscriptionContext();

  const onBlur = useCallback(async () => {
    setLoading(true);
    try {
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return (
    <InputWithIcon
      iconId="smartphone"
      disabled={loading}
      type="tel"
      value={phoneNumber}
      onInput={(e) => setPhoneNumber(e.currentTarget.value)}
      onBlur={() => onBlur()}
      placeholder="+1-123-456-7890"
    />
  );
};
