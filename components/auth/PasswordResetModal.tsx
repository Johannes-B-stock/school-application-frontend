import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateMyPassword } from "lib/user";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PasswordResetModal({
  show,
  setShow,
  token,
}: {
  show: boolean;
  setShow: (show: boolean) => any;
  token: string;
}) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShow(show);
  }, [show, setShow]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSavePassword = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      await updateMyPassword(
        formData.currentPassword,
        formData.password,
        token
      );
      toast.success("Password successfully changed");
      togglePasswordModal();
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.error?.message ?? error.message ?? error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordModal = () => {
    setShow(!show);
  };

  return (
    <div className={`modal ${show ? "is-active" : ""}`}>
      <div className="modal-background" onClick={togglePasswordModal}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Change Password</p>
          <button
            className="delete"
            aria-label="close"
            onClick={togglePasswordModal}
          ></button>
        </header>
        <section className="modal-card-body">
          <p className="description mb-5">
            Please type in your current and the new password
          </p>
          <form>
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input is-medium"
                  type="password"
                  autoComplete="true"
                  placeholder="Current Password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={onChange}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
            </div>
            <hr />
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input is-medium"
                  type="password"
                  autoComplete="true"
                  placeholder="New Password"
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
                  autoComplete="true"
                  placeholder="Confirm Password"
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
          </form>
        </section>
        <footer className="modal-card-foot">
          <button
            className={`button is-primary ${isLoading ? "is-loading" : ""}`}
            onClick={handleSavePassword}
          >
            Save
          </button>
          <button className="button" onClick={togglePasswordModal}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
}
