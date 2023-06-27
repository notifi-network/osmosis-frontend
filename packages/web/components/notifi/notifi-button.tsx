import React, { ComponentProps, FunctionComponent } from "react";

import { Icon } from "../assets";
import { Button } from "../buttons";
import IconButton from "../buttons/icon-button";
import { useNotifiContext } from "./notifi-context";

interface Props {
  className?: string;
}

const NotifiIconButton: FunctionComponent<ComponentProps<typeof Button>> = (
  props
) => {
  return (
    <IconButton
      aria-label="Open Notifications dropdown"
      icon={<Icon id="bell" width={24} height={24} />}
      {...props}
    />
  );
};

export const NotifiButton: FunctionComponent<Props> = ({
  className,
}: Props) => {
  const context = useNotifiContext();
  if (context === undefined) {
    return <NotifiIconButton className={className} disabled />;
  }

  return (
    <NotifiIconButton
      className={className}
      onClick={() => {
        console.log("click");
      }}
    />
  );
};
