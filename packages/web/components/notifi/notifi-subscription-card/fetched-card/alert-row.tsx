import { EventTypeItem } from "@notifi-network/notifi-frontend-client";
import { FunctionComponent } from "react";

import { Switch } from "~/components/control";

interface Props {
  row: EventTypeItem;
  disabled: boolean;
}

interface GenericProps extends Props {
  title: string;
}

export const AlertRow: FunctionComponent<Props> = (props) => {
  switch (props.row.type) {
    case "broadcast":
      return <GenericAlertRow {...props} title={props.row.name} />;
    case "directPush":
      return <GenericAlertRow {...props} title={props.row.name} />;
    case "fusion":
    case "fusionToggle":
      return <GenericAlertRow {...props} title={props.row.name} />;
    default:
      return <GenericAlertRow {...props} disabled title={props.row.name} />;
  }
};

const GenericAlertRow: FunctionComponent<GenericProps> = ({
  title,
  disabled,
}) => {
  return (
    <Switch
      labelPosition="right"
      disabled={disabled}
      isOn={false}
      onToggle={() => {}}
    >
      {title}
    </Switch>
  );
};
