import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { useAuth } from "../../app/auth/AuthContext";

const AuthPage = () => {
  const { t } = useTranslation();
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!email || !password || (type === "register" && !name)) {
      setError(t("auth.errors.required"));
      return;
    }
    try {
      if (type === "register") {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      const redirect = (location.state as { from?: string } | null)?.from || "/account";
      navigate(redirect);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth.errors.generic");
      if (message.toLowerCase().includes("email already")) {
        setError(t("auth.errors.exists"));
      } else if (message.toLowerCase().includes("invalid")) {
        setError(t("auth.errors.invalid"));
      } else {
        setError(message);
      }
    }
  };

  if (type === "forgot-password") {
    return (
      <div>
        <h1 className="section-title">{t("auth.forgotTitle")}</h1>
        <div className="card auth-form">
          <TextInput placeholder={t("auth.email")} />
          <Button className="button--primary" type="button">
            {t("auth.sendReset")}
          </Button>
        </div>
        <Link to="/auth/login">{t("auth.haveAccount")}</Link>
      </div>
    );
  }

  if (type === "reset-password") {
    return (
      <div>
        <h1 className="section-title">{t("auth.resetTitle")}</h1>
        <div className="card auth-form">
          <TextInput placeholder={t("auth.password")} type="password" />
          <Button className="button--primary" type="button">
            {t("auth.savePassword")}
          </Button>
        </div>
        <Link to="/auth/login">{t("auth.haveAccount")}</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">{type === "register" ? t("auth.registerTitle") : t("auth.loginTitle")}</h1>
      <div className="card auth-form">
        {type === "register" && (
          <TextInput
            placeholder={t("auth.fullName")}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        )}
        <TextInput
          placeholder={t("auth.email")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextInput
          placeholder={t("auth.password")}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p>{error}</p>}
        <Button className="button--primary" type="button" onClick={submit}>
          {t("auth.continue")}
        </Button>
      </div>
      {type === "register" ? (
        <Link to="/auth/login">{t("auth.haveAccount")}</Link>
      ) : (
        <Link to="/auth/register">{t("auth.noAccount")}</Link>
      )}
    </div>
  );
};

export default AuthPage;
