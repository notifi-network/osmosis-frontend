import { NotifiFrontendClient } from "@notifi-network/notifi-frontend-client";
import { useNotifiClientContext } from "@notifi-network/notifi-react-card";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { HistoryEmpty } from "./history-empty";
import { HistoryRowData, HistoryRows } from "./history-rows";

type FetchParams = Parameters<
  NotifiFrontendClient["getNotificationHistory"]
>[0];

type CursorInfo = Readonly<{
  hasNextPage: boolean;
  endCursor?: string | undefined;
}>;

const MESSAGES_PER_PAGE = 50;

export const HistoryView: FunctionComponent = () => {
  const {
    canary: { frontendClient },
  } = useNotifiClientContext();

  const [allNodes, setAllNodes] = useState<ReadonlyArray<HistoryRowData>>([]);
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    hasNextPage: false,
    endCursor: undefined,
  });
  const fetchedRef = useRef(false);
  const isQuerying = useRef(false);

  const getNotificationHistory = useCallback(
    async ({ first, after }: FetchParams) => {
      if (isQuerying.current) {
        return;
      }
      isQuerying.current = true;
      const result = await frontendClient.getNotificationHistory({
        first,
        after,
      });

      const nodes = result.nodes ?? [];
      setAllNodes((existing) => existing.concat(nodes));
      setCursorInfo(result.pageInfo);

      isQuerying.current = false;
      return result;
    },
    [frontendClient]
  );

  useEffect(() => {
    if (fetchedRef.current !== true) {
      fetchedRef.current = true;
      getNotificationHistory({
        first: MESSAGES_PER_PAGE,
      });
    }
  }, [getNotificationHistory]);

  if (allNodes.length === 0) {
    return <HistoryEmpty />;
  }
  return <HistoryRows rows={allNodes} />;
};
