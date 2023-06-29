import { EventTypeItem } from "@notifi-network/notifi-frontend-client";
import { FunctionComponent } from "react";

import { CheckBox } from "~/components/control";

interface Props {
  row: EventTypeItem;
  disabled: boolean;
  email: ToggleState;
  sms: ToggleState;
  telegram: ToggleState;
}

interface ToggleState {
  value: boolean;
  onToggle: (toggled: boolean) => void;
}

interface GenericProps extends Props {
  title: string;
  description: string;
}

export const AlertRow: FunctionComponent<Props> = (props) => {
  switch (props.row.type) {
    case "broadcast":
      return (
        <GenericAlertRow
          {...props}
          title={props.row.name}
          description={props.row.tooltipContent ?? ""}
        />
      );
    case "directPush":
      return (
        <GenericAlertRow
          {...props}
          title={props.row.name}
          description={props.row.tooltipContent ?? ""}
        />
      );
    case "fusion":
    case "fusionToggle":
      return (
        <GenericAlertRow
          {...props}
          title={props.row.name}
          description={props.row.tooltipContent ?? ""}
        />
      );
    default:
      return (
        <GenericAlertRow
          {...props}
          disabled
          title={props.row.name}
          description="Unsupported notification type. Please contact the developers."
        />
      );
  }
};

const GenericAlertRow: FunctionComponent<GenericProps> = ({
  title,
  description,
  disabled,
  email,
  sms,
  telegram,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 hover:bg-osmoverse-700">
      <p className="text-subtitle1 font-subtitle1">{title}</p>
      <p className="text-caption font-caption text-osmoverse-200">
        {description}
      </p>
      <CheckBox
        disabled={disabled}
        isOn={email.value}
        onToggle={email.onToggle}
      >
        Email
      </CheckBox>
      <CheckBox
        disabled={disabled}
        isOn={telegram.value}
        onToggle={telegram.onToggle}
      >
        Telegram
      </CheckBox>
      <CheckBox disabled={disabled} isOn={sms.value} onToggle={sms.onToggle}>
        SMS
      </CheckBox>
    </div>
  );
};
