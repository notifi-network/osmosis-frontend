import React, { FunctionComponent } from "react";

import { NotifiButton } from "./notifi-button";
import { NotifiContextProvider } from "./notifi-context";

interface Props {
  className?: string;
}

export const Notifi: FunctionComponent<Props> = (props) => {
  return (
    <NotifiContextProvider>
      <NotifiButton {...props} />
    </NotifiContextProvider>
  );
};
