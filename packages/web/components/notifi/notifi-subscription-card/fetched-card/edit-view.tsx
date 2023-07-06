import { NotifiFrontendClient } from "@notifi-network/notifi-frontend-client";
import {
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from "@notifi-network/notifi-react-card";
import classNames from "classnames";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "~/components/buttons";

import { AlertList } from "./alert-list";
import styles from "./edit-view.module.css";
import { InputWithSwitch } from "./input-with-switch";

type TargetGroupFragment = Awaited<
  ReturnType<NotifiFrontendClient["getTargetGroups"]>
>[number];

type EditState = Readonly<{
  targetGroup: TargetGroupFragment | undefined;
  emailSelected: boolean;
  telegramSelected: boolean;
  smsSelected: boolean;
}>;

export const EditView: FunctionComponent = () => {
  const { client } = useNotifiClientContext();

  const {
    email: originalEmail,
    phoneNumber: originalPhoneNunmber,
    telegramId: originalTelegram,
    loading,
  } = useNotifiSubscriptionContext();

  const { formState, setEmail, setPhoneNumber, setTelegram } = useNotifiForm();

  const [editState, setEditState] = useState<EditState>({
    targetGroup: undefined,
    emailSelected: false,
    telegramSelected: false,
    smsSelected: false,
  });

  const onClickSave = useCallback(async () => {
    const {
      email: emailToSave,
      phoneNumber: smsToSave,
      telegram: telegramToSave,
    } = formState;
    const { emailSelected, telegramSelected, smsSelected } = editState;

    try {
      await client.ensureTargetGroup({
        name: "Default",
        emailAddress: emailSelected ? emailToSave : undefined,
        phoneNumber: smsSelected ? smsToSave : undefined,
        telegramId: telegramSelected ? telegramToSave : undefined,
        discordId: undefined,
      });
    } catch (e: unknown) {}
  }, [client, editState, formState]);

  useEffect(() => {
    const targetGroup = client.data?.targetGroups?.find(
      (it) => it.name === "Default"
    );
    if (targetGroup === editState.targetGroup) {
      return;
    }

    if (targetGroup !== undefined) {
      const emailTarget = targetGroup.emailTargets?.[0];
      const emailSelected = emailTarget !== undefined;
      const telegramTarget = targetGroup.telegramTargets?.[0];
      const telegramSelected = telegramTarget !== undefined;
      const smsTarget = targetGroup.smsTargets?.[0];
      const smsSelected = smsTarget !== undefined;

      setEmail(emailTarget?.emailAddress ?? "");
      setTelegram(telegramTarget?.telegramId ?? "");
      setPhoneNumber(smsTarget?.phoneNumber ?? "");
      setEditState({
        targetGroup,
        emailSelected,
        telegramSelected,
        smsSelected,
      });
    } else {
      setEditState({
        targetGroup: undefined,
        emailSelected: false,
        telegramSelected: false,
        smsSelected: false,
      });
    }
  }, [client, editState, setEmail, setPhoneNumber, setTelegram]);

  const isDirty = useMemo(() => {
    if (editState.targetGroup === undefined) {
      return (
        (editState.emailSelected && formState.email !== "") ||
        (editState.telegramSelected && formState.telegram !== "") ||
        (editState.smsSelected && formState.phoneNumber !== "")
      );
    } else {
      return (
        (editState.emailSelected && formState.email !== originalEmail) ||
        (!editState.emailSelected && originalEmail !== "") ||
        (editState.smsSelected &&
          formState.phoneNumber !== originalPhoneNunmber) ||
        (!editState.smsSelected && originalPhoneNunmber !== "") ||
        (editState.telegramSelected &&
          formState.telegram !== originalTelegram) ||
        (!editState.telegramSelected && originalTelegram !== "")
      );
    }
  }, [
    editState,
    formState,
    originalEmail,
    originalPhoneNunmber,
    originalTelegram,
  ]);

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-center text-caption font-caption text-osmoverse-200">
        Add destinations for your notifications.
      </p>
      <InputWithSwitch
        iconId="email"
        type="email"
        placeholder="Email"
        value={formState.email}
        onChange={(e) => {
          const newValue = e.currentTarget.value;
          if (newValue === "") {
            setEditState((previous) => ({
              ...previous,
              emailSelected: false,
            }));
          } else {
            setEditState((previous) => ({
              ...previous,
              emailSelected: true,
            }));
          }
          setEmail(newValue);
        }}
        selected={editState.emailSelected}
        setSelected={(selected) => {
          setEditState((previous) => ({
            ...previous,
            emailSelected: selected,
          }));
        }}
      />
      <InputWithSwitch
        iconId="telegram"
        type="text"
        placeholder="Telegram"
        value={formState.telegram}
        onChange={(e) => {
          const newValue = e.currentTarget.value;
          if (newValue === "") {
            setEditState((previous) => ({
              ...previous,
              telegramSelected: false,
            }));
          } else {
            setEditState((previous) => ({
              ...previous,
              telegramSelected: true,
            }));
          }
          setTelegram(newValue);
        }}
        selected={editState.telegramSelected}
        setSelected={(selected) => {
          setEditState((previous) => ({
            ...previous,
            telegramSelected: selected,
          }));
        }}
      />
      <InputWithSwitch
        iconId="smartphone"
        type="tel"
        placeholder="SMS"
        value={formState.phoneNumber}
        onChange={(e) => {
          let newValue = e.currentTarget.value;
          if (newValue !== "" && !newValue.startsWith("+")) {
            newValue = "+1" + newValue;
          }
          if (newValue === "") {
            setEditState((previous) => ({
              ...previous,
              smsSelected: false,
            }));
          } else if (newValue !== "") {
            setEditState((previous) => ({
              ...previous,
              smsSelected: true,
            }));
          }
          setPhoneNumber(newValue);
        }}
        selected={editState.smsSelected}
        setSelected={(selected) => {
          setEditState((previous) => ({
            ...previous,
            smsSelected: selected,
          }));
        }}
      />
      <AlertList />
      {isDirty ? (
        <div
          className={classNames(
            styles.saveSection,
            "sticky bottom-0 left-0 right-0 flex flex-col p-3 md:p-5"
          )}
        >
          <Button
            mode="primary"
            disabled={loading}
            onClick={() => onClickSave()}
          >
            Save changes
          </Button>
        </div>
      ) : null}
    </div>
  );
};
