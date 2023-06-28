import { FunctionComponent } from "react";
import { useTranslation } from "react-multi-lang";

import { ModalBase, ModalBaseProps } from "~/modals";

export const NotifiModal: FunctionComponent<ModalBaseProps> = (props) => {
  const t = useTranslation();
  return (
    <ModalBase {...props} title={t("notifi.title")}>
      Notifi Modal
    </ModalBase>
  );
};
