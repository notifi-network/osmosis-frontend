import { FunctionComponent, InputHTMLAttributes } from "react";

import { SpriteIconId } from "~/components/assets";
import { Switch } from "~/components/control";

import { InputWithIcon } from "./input-with-icon";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  iconId: SpriteIconId;
  selected: boolean;
  setSelected: (selected: boolean) => void;
}

export const InputWithSwitch: FunctionComponent<Props> = ({
  iconId,
  selected,
  setSelected,
  ...inputProps
}: Props) => {
  return (
    <div className="flex flex-row justify-center">
      <Switch
        className="flex-grow"
        labelPosition="left"
        isOn={selected}
        onToggle={(value) => setSelected(value)}
      >
        <InputWithIcon iconId={iconId} {...inputProps} />
      </Switch>
    </div>
  );
};
