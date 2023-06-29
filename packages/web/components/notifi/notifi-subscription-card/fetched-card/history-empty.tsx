import { FunctionComponent } from "react";

import { useNotifiModalContext } from "../../notifi-modal-context";

export const HistoryEmpty: FunctionComponent = () => {
  const { editView } = useNotifiModalContext();
  return (
    <>
      No alert history
      <button
        onClick={() => {
          editView();
        }}
      >
        Edit
      </button>
    </>
  );
};
