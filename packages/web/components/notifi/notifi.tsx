import React, { FunctionComponent } from "react";

import { NotifiButton, NotifiButtonProps } from "./notifi-button";
import { NotifiContextProvider } from "./notifi-context";

export const Notifi: FunctionComponent<NotifiButtonProps> = (props) => {
  return (
    <NotifiContextProvider>
      <NotifiButton {...props} />
    </NotifiContextProvider>
  );
};
