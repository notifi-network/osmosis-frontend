import { FunctionComponent } from "react";

import { useNotifiConfig } from "../../notifi-config-context";
import { AlertRow } from "./alert-row";

export const AlertList: FunctionComponent = () => {
  const config = useNotifiConfig();

  if (config.state !== "fetched") {
    return null;
  }

  return (
    <ul className="flex flex-col gap-3 px-6 pb-6 pt-3">
      {config.data.eventTypes.map((row) => {
        if (row.type === "label") {
          return (
            <li key={row.name} className="flex flex-col gap-3">
              <p className="text-subtitle1 font-subtitle1">{row.name}</p>
              <p className="text-caption font-caption text-osmoverse-200">
                {row.tooltipContent}
              </p>
            </li>
          );
        }
        return (
          <li key={row.name}>
            <AlertRow row={row} disabled={false} />
          </li>
        );
      })}
    </ul>
  );
};
