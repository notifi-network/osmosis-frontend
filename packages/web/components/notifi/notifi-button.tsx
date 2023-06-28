import React, { ComponentProps, FunctionComponent } from "react";

import { Icon } from "../assets";
import { Button } from "../buttons";
import IconButton from "../buttons/icon-button";
import { useNotifiConfig } from "./notifi-config-context";

export interface NotifiButtonProps {
  className?: string;
  requestOpen: () => void;
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

export const NotifiButton: FunctionComponent<NotifiButtonProps> = ({
  className,
  requestOpen,
}: NotifiButtonProps) => {
  const context = useNotifiConfig();
  if (context === undefined) {
    return <NotifiIconButton className={className} disabled />;
  }

  return (
    <NotifiIconButton
      className={className}
      onClick={() => {
        requestOpen();
      }}
    />
  );
};
