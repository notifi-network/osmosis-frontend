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
    async ({ refresh }: { refresh: boolean }) => {
      if (
        frontendClient.userState === null ||
        frontendClient.userState.status !== "authenticated"
      ) {
        return;
      }

      if (!(refresh || cursorInfo.hasNextPage)) {
        return;
      }

      if (isQuerying.current) {
        return;
      }

      isQuerying.current = true;
      const result = await frontendClient.getNotificationHistory({
        first: MESSAGES_PER_PAGE,
        after: refresh ? undefined : cursorInfo.endCursor,
      });

      const nodes = result.nodes ?? [];
      setAllNodes((existing) => existing.concat(nodes));
      setCursorInfo(result.pageInfo);

      isQuerying.current = false;
      return result;
    },
    [cursorInfo.endCursor, cursorInfo.hasNextPage, frontendClient]
  );

  useEffect(() => {
    if (fetchedRef.current !== true) {
      fetchedRef.current = true;
      getNotificationHistory({
        refresh: true,
      });
    }
  }, [getNotificationHistory]);

  if (allNodes.length === 0) {
    return <HistoryEmpty />;
  }
  return <HistoryRows rows={allNodes} />;
};
