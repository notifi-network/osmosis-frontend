import { FunctionComponent } from "react";

import { EditEmail } from "./edit-email";
import { EditSms } from "./edit-sms";
import { EditTelegram } from "./edit-telegram";

export const EditView: FunctionComponent = () => {
  return (
    <div className="flex flex-col space-y-2">
      <p className="text-center text-caption font-caption text-osmoverse-200">
        Add destinations for your notifications.
      </p>
      <EditEmail />
      <EditTelegram />
      <EditSms />
    </div>
  );
};
