import { Keplr, Key } from "@keplr-wallet/types";
import { NotifiContext } from "@notifi-network/notifi-react-card";
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

import { useKeplr } from "~/hooks";
import { useStore } from "~/stores";

import { NotifiConfigContext } from "./notifi-config-context";

interface RequiredInfo {
  key: Key;
  keplr: Keplr;
  chainId: string;
}

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

  if (info === undefined) {
    return <>{children}</>;
  }

  return (
    <NotifiContext
      env="Development"
      walletBlockchain="OSMOSIS"
      dappAddress="junitest.xyz"
      accountAddress={info.key.bech32Address}
      walletPublicKey={Buffer.from(info.key.pubKey).toString("base64")}
      signMessage={async (message: Uint8Array): Promise<Uint8Array> => {
        const result = await info.keplr.signArbitrary(
          info.chainId,
          info.key.bech32Address,
          message
        );
        return Buffer.from(result.signature, "base64");
      }}
      enableCanary
    >
      <NotifiConfigContext
        type="SUBSCRIPTION_CARD"
        id="afa2bcb3e2f1408eafb008bed44f54cd"
      >
        {children}
      </NotifiConfigContext>
    </NotifiContext>
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
