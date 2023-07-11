import { Popover } from "@headlessui/react";
import { NotifiFrontendClient } from "@notifi-network/notifi-frontend-client";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useMemo } from "react";

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
  return (
    <ul className="mt-3 ">
      {rows.map((row, key) => {
        return (
          <HistoryRow
            key={key}
            /*{...rowProps}*/ row={row}
            onCtaClick={() => setAlertEntry(row)}
            isModalCloseAfterClick={false}
          />
        );
      })}

      {dummyRows.map((row, key) => (
        <HistoryRow
          onCtaClick={row.onCtaClick}
          row={row}
          key={key}
          isModalCloseAfterClick={true}
        />
      ))}
    </ul>
  );
};

interface RowProps {
  onCtaClick: () => void;
  isModalCloseAfterClick: boolean;
  row: HistoryRowData | DummyRow;
  dummyRow?: DummyRow;
}

const HistoryRow: FunctionComponent<RowProps> = ({
  onCtaClick,
  isModalCloseAfterClick,
  row,
}) => {
  const { setLocation } = useNotifiModalContext();
  const router = useRouter();

  const { emoji, title, message, cta, timestamp, popOutUrl } = useMemo(() => {
    if (row.__typename !== "DummyRow") {
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
        popOutUrl: "",
      };

      if (row.detail?.__typename === "BroadcastMessageEventDetails") {
        rowProps.emoji = "📢";
        rowProps.title = row.detail.subject || "No title";
        rowProps.message = row.detail.message || "No message";
        rowProps.cta = "View";
      }

      if (row.detail?.__typename === "GenericEventDetails") {
        rowProps.cta = "View";
        rowProps.message = "";
        rowProps.title = "";
        rowProps.popOutUrl = "";
        const jsonDetail: undefined | EventDetailsJson =
          row.detail.eventDetailsJson &&
          JSON.parse(row.detail.eventDetailsJson);
        switch (row.detail.sourceName) {
          case "pool":
            const poolEventDetailsJson = jsonDetail as StatusesEventDetailsJson;
            const poolId = poolEventDetailsJson?.EventData?.pool?.poolId;

            if (poolEventDetailsJson.EventData.isAssetTransfer) {
              const txHash =
                poolEventDetailsJson?.EventData.assetTransfer?.transaction.hash;
              const blockHeight =
                poolEventDetailsJson?.EventData.assetTransfer?.transaction
                  .height;
              rowProps.title = `Osmosis Outbound Transfer`;
              rowProps.emoji = "💸";
              txHash &&
                (rowProps.popOutUrl = `https://www.mintscan.io/cosmos/txs/${txHash}?height=${blockHeight}`);
            }
            if (poolEventDetailsJson.EventData.isPoolExited) {
              const txHash =
                poolEventDetailsJson?.EventData?.pool?.transaction?.hash;
              const blockHeight =
                poolEventDetailsJson?.EventData?.pool?.transaction?.height;
              rowProps.title = `Osmosis Pool Exited: ${poolId}`;
              rowProps.emoji = "✅";
              txHash &&
                (rowProps.popOutUrl = `https://www.mintscan.io/cosmos/txs/${txHash}?height=${blockHeight}`);
            }
            if (poolEventDetailsJson.EventData.isPoolJoined) {
              rowProps.title = `Osmosis Pool Joined: ${poolId}`;
              rowProps.emoji = "💵";
              rowProps.popOutUrl = `/pool/${poolId}`;
            }
            if (poolEventDetailsJson.EventData.isTokenSwapped) {
              const txHash =
                poolEventDetailsJson?.EventData?.tokenSwapped?.transaction
                  ?.hash;
              const blockHeight =
                poolEventDetailsJson?.EventData?.tokenSwapped?.transaction
                  ?.height;
              rowProps.title = `Osmosis Swap Confirmed`;
              rowProps.emoji = "🔄";
              console.log({ txHash, blockHeight, poolEventDetailsJson });
              txHash &&
                (rowProps.popOutUrl = `https://www.mintscan.io/cosmos/txs/${txHash}?height=${blockHeight}`);
            }
            break;

          case "transfer":
            const transferEventDetailsJson =
              jsonDetail as TransferEventDetailsJson;
            const txHash = transferEventDetailsJson?.EventData.transaction.hash;
            const blockHeight =
              transferEventDetailsJson?.EventData.transaction.height;
            const token =
              transferEventDetailsJson?.EventData.denomMetadata.display;
            rowProps.title = `Asset Recieved: ${token}`;
            rowProps.emoji = "💰";
            rowProps.popOutUrl = `https://www.mintscan.io/cosmos/txs/${txHash}?height=${blockHeight}`;
            break;

          case "position":
            const positionEventDetailsJson =
              jsonDetail as PositionEventDetailsJson;
            const asset0 =
              positionEventDetailsJson?.EventData?.position?.asset0?.denom;
            const asset1 =
              positionEventDetailsJson?.EventData?.position?.asset1?.denom;
            const positionPoolId =
              positionEventDetailsJson?.EventData?.position?.position?.poolId;
            rowProps.title = `Your [${asset0}/${asset1}] LP position is out of range`;
            rowProps.emoji = "🚧";
            rowProps.popOutUrl = `/pool/${positionPoolId}`;
            break;

          default:
            rowProps.title = "Not supported source";
        }
      }
      return rowProps;
    }
    return {
      emoji: row.emoji,
      title: row.title,
      message: row.message,
      cta: row.cta,
      timestamp: row.timestamp,
      popOutUrl: "",
    };
  }, [row]);

  const handleClick = useCallback(() => {
    if (popOutUrl) {
      popOutUrl.startsWith("/")
        ? router.push(popOutUrl)
        : window.open(popOutUrl, "_blank");
      return;
    }

    setLocation("historyDetail");
    onCtaClick();
  }, [onCtaClick, setLocation, popOutUrl]);

  return (
    <li
      className={
        !isModalCloseAfterClick
          ? "item-center flex flex-row border-b border-osmoverse-500 px-4 py-2"
          : "item-center flex flex-row border-b border-osmoverse-900 bg-osmoverse-700 px-4 py-2"
      }
    >
      <div className="m-auto h-8 w-3">{emoji}</div>
      <div className="ml-5 grid flex-grow grid-cols-3 grid-rows-2">
        <div className="col-span-2 text-base">{title}</div>

        {isModalCloseAfterClick ? (
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
        <div className="col-span-2 text-xs text-osmoverse-200">{message}</div>
        <div className="col-span-1 text-right text-xs text-osmoverse-500">
          {timestamp}
        </div>
      </div>
    </li>
  );
};

type DummyRow = {
  __typename: "DummyRow";
  emoji: string;
  title: string;
  message: string;
  cta: string | JSX.Element;
  timestamp: string;
  onCtaClick: () => void;
};

const dummyRows: DummyRow[] = [
  {
    emoji: "🎉",
    __typename: "DummyRow",
    title: "Buy tokens to get started",
    message: "Acquire OSMO to start trading",
    cta: "Buy",
    timestamp: "",
    onCtaClick: () => {
      window.open(
        "https://osmosis.zone/blog/layerswap-a-new-on-ramp-and-cross-chain-service-for-osmosis",
        "_blank"
      );
    },
  },
  {
    emoji: "🎉",
    __typename: "DummyRow",
    title: "How to start trading",
    message: "This quick tutorial will get you trading in minutes",
    cta: "Learn",
    timestamp: "",
    onCtaClick: () => {
      window.open("https://support.osmosis.zone/tutorials/deposits", "_blank");
    },
  },
  {
    emoji: "🎉",
    __typename: "DummyRow",
    title: "How to deposit funds",
    message: "Learn how to deposit funds on Osmosis ",
    cta: "Learn",
    timestamp: "",
    onCtaClick: () => {
      window.open(
        "https://support.osmosis.zone/tutorials/trading-on-osmosis",
        "_blank"
      );
    },
  },
];

type EventDetailsJson =
  | StatusesEventDetailsJson
  | TransferEventDetailsJson
  | PositionEventDetailsJson;

type StatusesEventDetailsJson = {
  EventData: {
    isAssetTransfer: boolean;
    isPoolExited: boolean;
    isPoolJoined: boolean;
    isTokenSwapped: boolean;
    AlertData: Object;
    pool?: {
      address: string;
      module: string;
      poolId: string;
      tokens: Object[]; // TODO: define type
      transaction: Transaction;
    };
    assetTransfer?: {
      denomMetadata: DenomMetadata;
      recipient: string;
      recipientBalanceFormatted: string;
      sender: string;
      transaction: Transaction;
    };
    tokenSwapped?: TokenSwapped;
  };
  NotifiData: Object;
};

type TransferEventDetailsJson = {
  unsubscribe_url: string;
  historyRowData: Object;
  AlertData: Object;
  NotifiData: Object;
  EventData: {
    transaction: Transaction;
    recipient: string;
    sender: string;
    denomMetadata: DenomMetadata;
    recipientBalanceFormatted: string;
    transferAmountFormatted: string;
  };
};

type PositionEventDetailsJson = {
  AlertData: Object;
  NotifiData: Object;
  EventData: {
    position: UserPosition;
    address: string;
    currentTick: string;
    currentPrice: string;
    lowerPriceBound: string;
    upperPriceBound: string;
  };
};

type Position = {
  positionId: number;
  address: string;
  poolId: number;
  lowerTick: number;
  upperTick: number;
  joinTime: Date | undefined;
  liquidity: string;
};

type UserPosition = {
  position: Position | undefined;
  asset0: Coin | undefined;
  asset1: Coin | undefined;
  claimableSpreadRewards: Coin[];
  claimableIncentives: Coin[];
  forfeitedIncentives: Coin[];
};

type Coin = {
  denom: string;
  amount: string;
};

type Transaction = {
  hash: string;
  height: string;
  index: number;
  tx: string;
  tx_result: Object;
};

type DenomMetadata = {
  base: string;
  description: string;
  display: string;
  symbol: string;
  denomUnits: Object[];
};

interface TokenSwapped {
  transaction: Transaction;
  module: PoolModule;
  denomIn: string;
  denomOut: string;
  amountInFormatted: string;
  amountOutFormatted: string;
  denomInMetadata: DenomMetadata; //Same interface used in other events...
  denomOutMetadata: DenomMetadata; //Same interface used in other events...
}

enum PoolModule {
  CL = "CONCENTRATED LIQUIDITY",
  GAMM = "GENERIC AUTOMATED MARKET MAKER",
}
