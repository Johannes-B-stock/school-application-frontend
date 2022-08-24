import AuthContext from "@/context/AuthContext";
import { general, resetPassword as t } from "@/i18n";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    password: string;
    confirmPassword: string;
  }>({ password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);

  let { code } = router.query;
  const { resetPassword, error } = useContext(AuthContext);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code) {
      toast.error(
        "Please click on the link in your email to reset your password."
      );
    }
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (typeof code !== "string") {
        code = code[0];
      }
      const successful = await resetPassword({
        password: formData.password,
        code: code,
      });
      if (successful) {
        router.push("/account/login");
      }
    } catch (error) {
      toast.error(error.message ?? error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!code) {
    router.push("/account/forgotPassword");
  }

  return (
    <div className="columns is-centered has-text-centered ">
      <div className="column is-5">
        <div className="box p-5">
          <h1 className="title is-4">{t[router.locale].title}</h1>
          <p className="description mb-5">{t[router.locale].description}</p>
          <form onSubmit={onSubmit}>
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input is-medium"
                  type="password"
                  placeholder={t[router.locale].password}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
            </div>
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input is-medium"
                  type="password"
                  placeholder={t[router.locale].confirmPassword}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                />

                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
            </div>
            <button
              className={`button is-block is-primary is-fullwidth is-medium ${
                isLoading && "is-loading"
              }`}
              type="submit"
            >
              {general.buttons[router.locale].submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
