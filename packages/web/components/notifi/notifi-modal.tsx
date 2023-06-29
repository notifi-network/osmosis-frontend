import { FunctionComponent } from "react";
import { useTranslation } from "react-multi-lang";

import { ModalBase, ModalBaseProps } from "~/modals";

import { NotifiSubscriptionCard } from "./notifi-subscription-card";

export const NotifiModal: FunctionComponent<ModalBaseProps> = (props) => {
  const t = useTranslation();
  return (
    <ModalBase {...props} title={t("notifi.title")}>
      <div className="mt-4 flex max-h-96 flex-col overflow-y-auto">
        <NotifiSubscriptionCard />
      </div>
    </ModalBase>
  );
};
