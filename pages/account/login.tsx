import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import {
  useEffect,
  useState,
  useContext,
  ChangeEvent,
  FormEvent,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import styles from "@/styles/Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { general, login as t } from "@/i18n";
import { useLocale } from "i18n/useLocale";
import { getEnabledProviders } from "lib/auth";
import SocialButton from "@/components/common/SocialButton";
import * as EmailValidator from "email-validator";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [providers, setProviders] = useState<string[]>([]);
  const { login, error, user } = useContext(AuthContext);
  useEffect(() => {
    error && toast.error(error);
  }, [error]);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    getEnabledProviders()
      .then((providers) => setProviders(providers))
      .catch((err) => console.log(err));
  }, []);

  useMemo(() => {
    if (user) {
      router.back();
    }
  }, [router, user]);

  const isRedirecting = router.query["returnUrl"] != undefined;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);

      const emailValid = EmailValidator.validate(formData.email);
      if (!emailValid) {
        toast.error("Email is not valid. Please provide a valid email");
        return;
      }

      await login(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="columns is-centered has-text-centered ">
      <div className={`column is-5 box p-5 ${styles.loginBox}`}>
        <h1 className="title is-4">{t[locale].title}</h1>
        <p className="description mb-5">
          {isRedirecting
            ? t[locale].redirectDescription
            : t[locale].description}
        </p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="control is-expanded has-icons-left">
              <input
                className="input is-medium"
                type="email"
                placeholder={t[locale].email}
                id="email"
                name="email"
                autoComplete="on"
                value={formData.email}
                onChange={onChange}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
            </div>
          </div>
          <div className="field">
            <div className="control is-expanded has-icons-left">
              <input
                className="input is-medium"
                type="password"
                placeholder={t[locale].password}
                id="password"
                name="password"
                autoComplete="on"
                value={formData.password}
                onChange={onChange}
              />

              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faLock} />
              </span>
            </div>
          </div>
          <div className="has-text-left mb-4 mt-2">
            <small>
              <Link href="/account/forgotPassword">
                {t[locale].forgotPasswordLink}
              </Link>
            </small>
          </div>
          <button
            className={`button is-block is-primary is-fullwidth is-medium ${
              isLoading ? "is-loading" : ""
            }`}
            type="submit"
          >
            {general.buttons[locale].submit}
          </button>
          <br />
          <small>
            <em>
              {t[locale].noAccount}
              <Link href="/account/register">
                <a>{general.buttons[locale].register}</a>
              </Link>
            </em>
          </small>
        </form>
        <div className="separator has-text-grey is-italic mt-4 mb-5">
          {t[locale].or}
        </div>

        {providers.includes("google") && (
          <>
            <SocialButton
              imgSrc="/images/google.png"
              link={`${API_URL}/api/connect/google`}
              text={t[locale].loginWithGoogle}
            />
            <div className="my-3"></div>
          </>
        )}
        {providers.includes("facebook") && (
          <SocialButton
            imgSrc="/images/facebook.png"
            link={`${API_URL}/api/connect/facebook`}
            text={t[locale].loginWithFacebook}
          />
        )}
      </div>
    </div>
  );
}

Login.getLayout = function getLayout(page: any) {
  return <Layout title="Login to page">{page}</Layout>;
};
