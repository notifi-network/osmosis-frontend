import { FunctionComponent } from "react";

import { EditEmail } from "./edit-email";

export const EditView: FunctionComponent = () => {
  return (
    <div className="flex flex-col">
      <EditEmail />
    </div>
  );
};
