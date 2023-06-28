import { CardConfigItemV1 } from "@notifi-network/notifi-frontend-client";
import { FunctionComponent } from "react";

export const FetchedCard: FunctionComponent<{
  data: CardConfigItemV1;
}> = ({ data }) => {
  return (
    <>
      {data.eventTypes.map((it) => (
        <div key={it.name}>{it.name}</div>
      ))}
    </>
  );
};
