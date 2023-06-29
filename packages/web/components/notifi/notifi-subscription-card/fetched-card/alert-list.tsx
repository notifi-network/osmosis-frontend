import { EventTypeItem } from "@notifi-network/notifi-frontend-client";
import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from "@notifi-network/notifi-react-card";
import { FunctionComponent, useCallback, useEffect, useState } from "react";

import { useNotifiConfig } from "../../notifi-config-context";
import { AlertRow, ToggleState } from "./alert-row";

export const AlertList: FunctionComponent = () => {
  const config = useNotifiConfig();
  const { loading, email, phoneNumber, telegramId, alerts, render } =
    useNotifiSubscriptionContext();
  const {
    canary: { frontendClient },
  } = useNotifiClientContext();

  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const isToggled = useCallback(
    (targetType: "email" | "sms" | "telegram", row: EventTypeItem): boolean => {
      return toggles[`${row.name}__${targetType}`] ?? false;
    },
    [toggles]
  );

  useEffect(() => {
    if (config.state === "fetched") {
      const newToggles = config.data.eventTypes.reduce<Record<string, boolean>>(
        (record, row) => {
          const alert = alerts[row.name];
          const hasEmail = (alert?.targetGroup?.emailTargets?.length ?? 0) > 0;
          const hasSms = (alert?.targetGroup?.smsTargets?.length ?? 0) > 0;
          const hasTelegram =
            (alert?.targetGroup?.telegramTargets?.length ?? 0) > 0;

          record[`${row.name}__email`] = hasEmail;
          record[`${row.name}__sms`] = hasSms;
          record[`${row.name}__telegram`] = hasTelegram;
          return record;
        },
        {}
      );
      setToggles(newToggles);
    }
  }, [alerts, config]);

  const toggleTarget = useCallback(
    async (
      targetType: "email" | "sms" | "telegram",
      row: EventTypeItem,
      toggled: boolean
    ) => {
      const key = `${row.name}__${targetType}`;
      if (toggles[key] === toggled) {
        return;
      }

      setToggles((current) => ({
        ...current,
        [key]: toggled,
      }));

      try {
        const includeEmail =
          targetType === "email" ? toggled : isToggled("email", row);
        const includeSms =
          targetType === "sms" ? toggled : isToggled("sms", row);
        const includeTelegram =
          targetType === "telegram" ? toggled : isToggled("telegram", row);
        await frontendClient.ensureTargetGroup({
          name: row.name,
          emailAddress: includeEmail && email !== "" ? email : undefined,
          telegramId:
            includeTelegram && telegramId !== "" ? telegramId : undefined,
          phoneNumber:
            includeSms && phoneNumber !== "" ? phoneNumber : undefined,
        });

        const alert = alerts[row.name];
        if (alert === undefined) {
          await frontendClient.ensureAlert({ eventType: row, inputs: {} });
        }
      } catch {
        frontendClient
          .fetchData()
          .then(render)
          .catch(() => {});
      }
    },
    [
      alerts,
      email,
      frontendClient,
      isToggled,
      phoneNumber,
      render,
      telegramId,
      toggles,
    ]
  );

  const getToggleState = useCallback(
    (
      targetType: "email" | "sms" | "telegram",
      row: EventTypeItem
    ): ToggleState => {
      return {
        value: isToggled(targetType, row),
        onToggle: (toggled) => {
          toggleTarget(targetType, row, toggled);
        },
      };
    },
    [isToggled, toggleTarget]
  );

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
          email={getToggleState("email", row)}
          telegram={getToggleState("telegram", row)}
          sms={getToggleState("sms", row)}
        />
      ))}
    </ul>
  );
};
