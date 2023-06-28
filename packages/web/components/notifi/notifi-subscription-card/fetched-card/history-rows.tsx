import { NotifiFrontendClient } from "@notifi-network/notifi-frontend-client";
import dayjs from "dayjs";
import { FunctionComponent } from "react";

export type HistoryRowData = Awaited<
  ReturnType<NotifiFrontendClient["getNotificationHistory"]>
>["nodes"][number];

export const HistoryRows: FunctionComponent<{
  rows: ReadonlyArray<HistoryRowData>;
}> = ({ rows }) => {
  return (
    <ul>
      {rows.map((row) => {
        const timestamp =
          dayjs(row.createdDate).format("MMMM D, YYYY h:mm A") + " UTC";
        const rowProps = {
          emoji: "😵",
          title: "Unsupported Notification",
          message: "Oops, something went wrong. Please let us know",
          cta: "",
          timestamp,
        };
        if (row.detail?.__typename === "GenericEventDetails") {
          rowProps.emoji = "😊";
          rowProps.title = row.detail.sourceName;
          rowProps.message = row.detail.notificationTypeName;
          rowProps.cta = "View";

          switch (row.detail.icon) {
            case "INFO":
              rowProps.emoji = "💸";
              break;
            case "URGENT":
              rowProps.emoji = "⚠️";
              break;
            case "MEGAPHONE":
              rowProps.emoji = "🎉";
              break;
          }
        }

        return <HistoryRow key={row.id} {...rowProps} />;
      })}
    </ul>
  );
};

const HistoryRow: FunctionComponent<{
  emoji: string;
  title: string;
  message: string;
  cta: string;
  timestamp: string;
}> = ({ emoji, title, message, cta, timestamp }) => {
  return (
    <div className="flex flex-row">
      <div className="h-8 w-6">{emoji}</div>
      <div className="grid flex-grow grid-cols-3 grid-rows-2">
        <div className="col-span-2">{title}</div>
        <div className="col-span-1">{cta}</div>
        <div className="col-span-2">{message}</div>
        <div className="col-span-1">{timestamp}</div>
      </div>
    </div>
  );
};
