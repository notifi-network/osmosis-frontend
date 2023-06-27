import { Keplr, Key } from "@keplr-wallet/types";
import {
  newFrontendClient,
  NotifiFrontendClient,
} from "@notifi-network/notifi-frontend-client";
import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useKeplr } from "~/hooks";
import { useStore } from "~/stores";

interface RequiredInfo {
  key: Key;
  keplr: Keplr;
  chainId: string;
}

interface NotifiContextData {
  client: NotifiFrontendClient;
  info: RequiredInfo;
}

const NotifiContext = createContext<NotifiContextData | undefined>(undefined);

export const useNotifiContext: () => NotifiContextData | undefined = () => {
  return useContext(NotifiContext);
};

export const NotifiContextProvider: FunctionComponent<
  PropsWithChildren<{}>
> = ({ children }) => {
  const { chainStore } = useStore();
  const { chainId } = chainStore.osmosis;
  const keplr = useKeplr();
  const [info, setInfo] = useState<RequiredInfo | undefined>();

  useEffect(() => {
    getRequiredInfo(chainId, keplr.getKeplr).then((info) => setInfo(info));
  }, [keplr, chainId]);

  const client = useMemo(() => {
    if (info === undefined) {
      return undefined;
    }

    const { key } = info;

    return newFrontendClient({
      account: {
        address: key.bech32Address,
        publicKey: Buffer.from(key.pubKey).toString("base64"),
      },
      tenantId: "junitest.xyz",
      env: "Development",
      walletBlockchain: "OSMOSIS",
    });
  }, [info]);

  let value: NotifiContextData | undefined = undefined;
  if (info !== undefined && client !== undefined) {
    value = {
      client,
      info,
    };
  }

  return (
    <NotifiContext.Provider value={value}>{children}</NotifiContext.Provider>
  );
};

const getRequiredInfo = async (
  chainId: string,
  getter: () => Promise<Keplr | undefined>
): Promise<RequiredInfo | undefined> => {
  const keplr = await getter();
  if (keplr === undefined) {
    return;
  }

  const key = await keplr.getKey(chainId);

  return {
    key,
    keplr,
    chainId,
  };
};
