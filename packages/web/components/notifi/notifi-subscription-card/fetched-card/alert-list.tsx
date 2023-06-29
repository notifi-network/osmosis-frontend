import { useNotifiSubscriptionContext } from "@notifi-network/notifi-react-card";
import { FunctionComponent } from "react";

import { useNotifiConfig } from "../../notifi-config-context";
import { AlertRow } from "./alert-row";

export const AlertList: FunctionComponent = () => {
  const config = useNotifiConfig();
  const { loading } = useNotifiSubscriptionContext();

  if (config.state !== "fetched") {
    return null;
  }

  return (
    <ul>
      {config.data.eventTypes.map((row) => (
        <AlertRow
          key={row.name}
          row={row}
          disabled={loading}
          email={{ value: false, onToggle: () => {} }}
          telegram={{ value: false, onToggle: () => {} }}
          sms={{ value: false, onToggle: () => {} }}
        />
      ))}
    </ul>
  );
};
