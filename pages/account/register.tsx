import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import { useEffect, useState, useContext, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import styles from "@/styles/Login.module.css";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { general, register as t } from "@/i18n";
import { useLocale } from "i18n/useLocale";
import { getEnabledProviders } from "lib/auth";
import SocialButton from "@/components/common/SocialButton";
import * as EmailValidator from "email-validator";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { user, register, error } = useContext(AuthContext);
  const [providers, setProviders] = useState<string[]>([]);

  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    getEnabledProviders()
      .then((providers) => setProviders(providers))
      .catch((err) => console.log(err));
  }, []);

  if (user) {
    router.push("/");
  }

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

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
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
      } else {
        const userData = {
          username: formData.name,
          email: formData.email,
          password: formData.password,
        };
        await register(userData);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="columns is-centered has-text-centered ">
      <div className={`column is-5 box p-5 ${styles.registerBox}`}>
        <h1 className="title is-4">{t[locale].title}</h1>
        <p className="description mb-5">{t[locale].description}</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="text"
                placeholder={t[locale].name}
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="email"
                placeholder={t[locale].email}
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="password"
                placeholder={t[locale].password}
                id="password"
                autoComplete="on"
                name="password"
                value={formData.password}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="password"
                placeholder={t[locale].confirmPassword}
                id="confirmPassword"
                autoComplete="on"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
              />
            </div>
          </div>
          <button
            className={`button is-block is-primary is-fullwidth is-medium ${
              isLoading && "is-loading"
            }`}
          >
            {general.buttons[locale].submit}
          </button>
          <br />
          <small>
            <em>
              {t[locale].alreadyAccount}
              <Link href="/account/login">
                <a>{general.buttons[locale].login}</a>
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
              text={t[locale].registerWithGoogle}
            />
            <div className="my-3"></div>
          </>
        )}
        {providers.includes("facebook") && (
          <SocialButton
            imgSrc="/images/facebook.png"
            link={`${API_URL}/api/connect/facebook`}
            text={t[locale].registerWithFacebook}
          />
        )}
      </div>
    </div>
  );
}

Register.getLayout = function getLayout(page: any) {
  return <Layout title="User registration">{page}</Layout>;
};
