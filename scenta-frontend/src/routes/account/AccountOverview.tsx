import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../app/auth/AuthContext";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { changePassword } from "../../services/backendApi";
import { useToast } from "../../components/feedback/ToastContext";

const AccountOverview = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      pushToast(t("account.passwordMissing"), "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      pushToast(t("account.passwordMismatch"), "error");
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      pushToast(t("account.passwordUpdated"), "success");
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("account.passwordError"), "error");
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">{t("account.welcome")}</h2>
      <div className="grid">
        <div>
          <strong>{t("account.profile")}</strong>
          <p>{t("account.name")}: {user?.name ?? t("account.unknown")}</p>
          <p>{t("account.email")}: {user?.email ?? t("account.unknown")}</p>
          <p>{t("account.password")}: ********</p>
        </div>
        <div>
          <strong>{t("account.changePassword")}</strong>
          <div className="grid">
            <TextInput
              type="password"
              placeholder={t("account.currentPassword")}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
            <TextInput
              type="password"
              placeholder={t("account.newPassword")}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <TextInput
              type="password"
              placeholder={t("account.confirmPassword")}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            <Button type="button" className="button--primary" onClick={() => void handleChangePassword()}>
              {t("account.updatePassword")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
