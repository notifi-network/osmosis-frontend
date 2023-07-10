import { Popover } from "@headlessui/react";
import { NotifiFrontendClient } from "@notifi-network/notifi-frontend-client";
import dayjs from "dayjs";
import { FunctionComponent, useCallback } from "react";

import { Icon } from "~/components/assets";

import { useNotifiModalContext } from "../../notifi-modal-context";

export type HistoryRowData = Awaited<
  ReturnType<NotifiFrontendClient["getNotificationHistory"]>
>["nodes"][number];

export const HistoryRows: FunctionComponent<{
  rows: ReadonlyArray<HistoryRowData>;
  setAlertEntry: React.Dispatch<
    React.SetStateAction<HistoryRowData | undefined>
  >;
}> = ({ rows, setAlertEntry }) => {
  const dummyRows: RowProps[] = [
    {
      emoji: "🎉",
      title: "Buy tokens to get started",
      message: "Acquire OSMO to start trading",
      isMarketingRow: true,
      cta: "Buy",
      timestamp: "",
      setAlertEntry: () => {
        // router.push("/?from=ATOM&to=OSMO");
        // router.push("/pool/1");

        window.open(
          "https://osmosis.zone/blog/layerswap-a-new-on-ramp-and-cross-chain-service-for-osmosis",
          "_blank"
        );
      },
    },
    {
      emoji: "🎉",
      title: "How to start trading",
      message: "This quick tutorial will get you trading in minutes",
      isMarketingRow: true,
      cta: "Learn",
      timestamp: "",
      setAlertEntry: () => {
        window.open(
          "https://support.osmosis.zone/tutorials/deposits",
          "_blank"
        );
      },
    },
    {
      emoji: "🎉",
      title: "How to deposit funds",
      message: "Learn how to deposit funds on Osmosis ",
      isMarketingRow: true,
      cta: "Learn",
      timestamp: "",
      setAlertEntry: () => {
        window.open(
          "https://support.osmosis.zone/tutorials/trading-on-osmosis",
          "_blank"
        );
      },
    },
  ];

  return (
    <ul className="mt-3 ">
      {rows.map((row, key) => {
        const day = dayjs(row.createdDate);
        const isToday = day.isAfter(dayjs(Date.now()).subtract(1, "day"));
        const isYesterday =
          day.isAfter(dayjs(Date.now()).subtract(2, "day")) && !isToday;
        const timestamp = isToday
          ? day.format("h:mm A")
          : isYesterday
          ? day.format("h:mm A") + " Yesterday"
          : day.format("MMMM D, YYYY h:mm A");

        const rowProps = {
          emoji: "😵",
          title: "Unsupported Notification",
          message: "Oops, something went wrong. Please let us know",
          cta: "",
          timestamp,
        };

        if (row.detail?.__typename === "BroadcastMessageEventDetails") {
          rowProps.emoji = "📢";
          rowProps.title = row.detail.subject || "No title";
          rowProps.message = row.detail.message || "No message";
          rowProps.cta = "View";
        }

        if (row.detail?.__typename === "GenericEventDetails") {
          rowProps.title = row.detail.sourceName;
          rowProps.message = row.detail.notificationTypeName || "No message";
          rowProps.cta = "View";
          switch (row.detail.icon) {
            case "INFO":
              rowProps.emoji = "💸";
              break;
            case "URGENT":
              rowProps.emoji = "⚠️";
              break;
            case "MEGAPHONE":
              rowProps.emoji = "📢";
              break;
            case "STAR":
              rowProps.emoji = "🌟";
              break;
            case "SWAP":
              rowProps.emoji = "🔄";
              break;
            case "CHECKMARK":
              rowProps.emoji = "✅";
              break;
          }
        }

        return (
          <HistoryRow
            key={key}
            {...rowProps}
            setAlertEntry={() => setAlertEntry(row)}
          />
        );
      })}

      {dummyRows.map((row, key) => (
        <HistoryRow key={key} {...row} />
      ))}
    </ul>
  );
};

interface RowProps {
  emoji: string;
  title: string;
  message: string;
  cta: string | JSX.Element;
  timestamp: string;
  setAlertEntry: () => void;
  isMarketingRow?: boolean;
}

const HistoryRow: FunctionComponent<RowProps> = ({
  emoji,
  title,
  message,
  cta,
  timestamp,
  setAlertEntry,
  isMarketingRow,
}) => {
  const { setLocation } = useNotifiModalContext();

  const handleClick = useCallback(() => {
    setAlertEntry();
    // TODO: prompt to other page or history detail (TBD)
    setLocation("historyDetail");
  }, [setAlertEntry, setLocation]);

  return (
    <li
      className={
        !isMarketingRow
          ? "item-center flex flex-row border-b border-osmoverse-500 px-4 py-2"
          : "item-center flex flex-row border-b border-osmoverse-900 bg-osmoverse-700 px-4 py-2"
      }
    >
      <div className="m-auto h-8 w-3">{emoji}</div>
      <div className="ml-5 grid flex-grow grid-cols-3 grid-rows-2">
        <div className="col-span-2 text-base">{title}</div>

        {isMarketingRow ? (
          // TODO: Do not need to close modal if options are redirected to external page
          <Popover.Button>
            <div
              className="col-span-1 flex  cursor-pointer flex-row justify-end text-osmoverse-300"
              onClick={handleClick}
            >
              <div>{cta}</div>
              <Icon
                id={"arrow-right"}
                className="ml-3 scale-75 text-wosmongton-200"
                height={24}
                width={24}
              />
            </div>
          </Popover.Button>
        ) : (
          <div
            className="col-span-1 flex  cursor-pointer flex-row justify-end text-osmoverse-300"
            onClick={handleClick}
          >
            <div>{cta}</div>
            <Icon
              id={"arrow-right"}
              className="ml-3 scale-75 text-wosmongton-200"
              height={24}
              width={24}
            />
          </div>
        )}
        <div className="col-span-2 text-xs text-osmoverse-200">
          {message || "Empty Subject"}
        </div>
        <div className="col-span-1 text-right text-xs text-osmoverse-500">
          {timestamp}
        </div>
      </div>
    </li>
  );
};
