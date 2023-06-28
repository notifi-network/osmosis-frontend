import { FunctionComponent } from "react";
import { useTranslation } from "react-multi-lang";

import { ModalBase, ModalBaseProps } from "~/modals";

import { useNotifiConfig } from "./notifi-config-context";

export const NotifiModal: FunctionComponent<ModalBaseProps> = (props) => {
  const t = useTranslation();
  const card = useNotifiConfig();
  return (
    <ModalBase {...props} title={t("notifi.title")}>
      {JSON.stringify(card)}
    </ModalBase>
  );
};
