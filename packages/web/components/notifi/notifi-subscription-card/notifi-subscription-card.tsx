import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from "@notifi-network/notifi-react-card";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";

import { useNotifiConfig } from "../notifi-config-context";
import { ErrorCard } from "./error-card";
import { ExpiredCard } from "./expired-card";
import { FetchedCard } from "./fetched-card";
import { LoadingCard } from "./loading-card";

export const NotifiSubscriptionCard: FunctionComponent = () => {
  const {
    canary: { frontendClient },
  } = useNotifiClientContext();

  const isClientInitialized = useMemo(
    () => frontendClient.userState !== null,
    [frontendClient.userState]
  );

  const isTokenExpired = useMemo(
    () => frontendClient.userState?.status === "expired",
    [frontendClient.userState]
  );

  const config = useNotifiConfig();

  const { cardView, setCardView } = useNotifiSubscriptionContext();
  const firstLoadRef = useRef(false);

  useEffect(() => {
    if (frontendClient.userState !== null && firstLoadRef.current !== true) {
      firstLoadRef.current = true;

      if (frontendClient.userState.status === "authenticated") {
        setCardView({ state: "history" });
      } else if (frontendClient.userState.status === "expired") {
        setCardView({ state: "expired" });
      } else {
        setCardView({ state: "signup" });
      }
    }
  }, [frontendClient.userState, setCardView]);

  if (isTokenExpired || cardView.state === "expired") {
    return <ExpiredCard />;
  }

  if (!isClientInitialized || config.state === "loading") {
    return <LoadingCard />;
  } else if (config.state === "error") {
    return <ErrorCard error={config.reason} />;
  } else if (cardView.state === "error") {
    return <ErrorCard error={cardView.reason} />;
  } else {
    return <FetchedCard data={config.data} />;
  }
};
