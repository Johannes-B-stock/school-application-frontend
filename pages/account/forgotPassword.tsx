import AuthContext from "@/context/AuthContext";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { general } from "@/i18n";
import { forgotPassword as t } from "@/i18n";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSend, setResetEmailSend] = useState(false);
  const { forgotPassword, user, error } = useContext(AuthContext);
  const router = useRouter();

  const onChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const emailSend = await forgotPassword({ email });
      setResetEmailSend(emailSend);
    } catch (error) {
      toast.error(error.message ?? error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    router.back();
  }

  return (
    <div className="columns is-centered has-text-centered ">
      {resetEmailSend ? (
        <div className="column is-5 box p-5">
          <h1 className="title is-4">{t[router.locale].title}</h1>
          <p className="description mb-5">{t[router.locale].emailSend}</p>
        </div>
      ) : (
        <>
          <div className="column is-5 box p-5">
            <h1 className="title is-4">{t[router.locale].title}</h1>
            <p className="description mb-5">{t[router.locale].typeEmail}</p>
            <form onSubmit={onSubmit}>
              <div className="field">
                <div className="control is-expanded has-icons-left">
                  <input
                    className="input is-medium"
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={onChange}
                  />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope} />
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
        </>
      )}
    </div>
  );
}
