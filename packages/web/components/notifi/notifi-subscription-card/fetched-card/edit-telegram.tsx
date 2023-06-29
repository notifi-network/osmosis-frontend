import { useNotifiSubscriptionContext } from "@notifi-network/notifi-react-card";
import { FunctionComponent, useCallback } from "react";

import { InputWithIcon } from "./input-with-icon";

export const EditTelegram: FunctionComponent = () => {
  const { telegramId, loading, setTelegramId, setLoading } =
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
      iconId="telegram"
      disabled={loading}
      type="text"
      value={telegramId}
      onInput={(e) => setTelegramId(e.currentTarget.value)}
      onBlur={() => onBlur()}
      placeholder="@osmosis"
    />
  );
};
