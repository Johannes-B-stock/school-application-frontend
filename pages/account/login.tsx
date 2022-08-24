import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { general, login as t } from "@/i18n";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, error } = useContext(AuthContext);
  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const router = useRouter();

  const isRedirecting = router.query["returnUrl"] != undefined;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    await login(formData);
    setIsLoading(false);
  };

  return (
    <div className="columns is-centered has-text-centered ">
      <div className="column is-5 box p-5">
        <h1 className="title is-4">{t[router.locale].title}</h1>
        <p className="description mb-5">
          {isRedirecting
            ? t[router.locale].redirectDescription
            : t[router.locale].description}
        </p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="control is-expanded has-icons-left">
              <input
                className="input is-medium"
                type="email"
                placeholder={t[router.locale].email}
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
                placeholder={t[router.locale].password}
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
                {t[router.locale].forgotPasswordLink}
              </Link>
            </small>
          </div>
          <button
            className={`button is-block is-primary is-fullwidth is-medium ${
              isLoading && "is-loading"
            }`}
            type="submit"
          >
            {general.buttons[router.locale].submit}
          </button>
          <br />
          <small>
            <em>
              {t[router.locale].noAccount}
              <Link href="/account/register">
                <a>{general.buttons[router.locale].register}</a>
              </Link>
            </em>
          </small>
        </form>
        <br />
        <div className="separator has-text-grey is-italic">
          {t[router.locale].or}
        </div>
        <br />
        <button
          className="button is-light is-fullwidth is-medium"
          onClick={() => router.push(`${API_URL}/api/connect/google`)}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faGoogle} />
          </span>
          <span>{t[router.locale].loginWithGoogle}</span>
        </button>
      </div>
    </div>
  );
}

Login.getLayout = function getLayout(page) {
  return <Layout title="Login to page">{page}</Layout>;
};
