import classNames from "classnames";
import React, { ComponentProps, Fragment, FunctionComponent } from "react";

import { Icon } from "../assets";
import { Button } from "../buttons";
import IconButton from "../buttons/icon-button";
import { Popover } from "../popover";
import { useNotifiConfig } from "./notifi-config-context";
import { useNotifiModalContext } from "./notifi-modal-context";
import { NotifiSubscriptionCard } from "./notifi-subscription-card";

export interface NotifiButtonProps {
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

export const NotifiPopover: FunctionComponent<NotifiButtonProps> = ({
  className,
}: NotifiButtonProps) => {
  const context = useNotifiConfig();
  const { innerState: { onRequestBack, backIcon, title } = {} } =
    useNotifiModalContext();

  if (context === undefined) {
    return <NotifiIconButton className={className} disabled />;
  }

  return (
    <Popover className="relative">
      <Popover.Button as={Fragment}>
        <NotifiIconButton className={className} />
      </Popover.Button>
      <Popover.Panel
        className={classNames(
          "absolute bottom-[-0.5rem] right-[-10rem] z-40",
          "h-[42.5rem] w-[27.5rem]",
          "translate-y-full",
          "rounded-2xl bg-osmoverse-800 p-3 shadow-md md:p-5",
          "flex flex-col overflow-y-auto"
        )}
      >
        <div className="mt-2 mb-4 flex place-content-between items-center">
          {onRequestBack && (
            <IconButton
              aria-label="Back"
              mode="unstyled"
              size="unstyled"
              className="top-9.5 absolute left-8 z-50 w-fit cursor-pointer py-0 text-osmoverse-400 md:top-7 md:left-7"
              icon={
                <Icon id={backIcon ?? "chevron-left"} width={18} height={18} />
              }
              onClick={onRequestBack}
            />
          )}
          {typeof title === "string" ? (
            <div className="relative mx-auto">
              <h6>{title}</h6>
            </div>
          ) : (
            <>{title}</>
          )}
        </div>
        <NotifiSubscriptionCard />
      </Popover.Panel>
    </Popover>
  );
};
