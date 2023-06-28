import { useNotifiClientContext } from "@notifi-network/notifi-react-card";
import { FunctionComponent, useMemo } from "react";

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

  if (isTokenExpired) {
    return <ExpiredCard />;
  }

  if (!isClientInitialized || config.state === "loading") {
    return <LoadingCard />;
  } else if (config.state === "error") {
    return <ErrorCard error={config.reason} />;
  } else {
    return <FetchedCard data={config.data} />;
  }
};
