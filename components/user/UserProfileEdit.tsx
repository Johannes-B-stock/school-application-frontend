import AuthContext from "@/context/AuthContext";
import {
  useContext,
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
} from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { API_URL, defaultAvatarPath } from "@/config/index";
import { toast } from "react-toastify";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { getMyDetails } from "lib/user";
import GenderSelect from "../common/GenderSelect";
import { general, profile } from "@/i18n";
import { User } from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import PasswordResetModal from "@/components/auth/PasswordResetModal";

export default function UserProfileEdit({
  token,
  user,
}: {
  token: string;
  user: User;
}) {
  const locale = useLocale();
  const { setUser } = useContext(AuthContext);
  const [loadingPicture, setLoadingPicture] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [userEdit, setUserEdit] = useState(user);
  const [enableEdit, setEnableEdit] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    setUserEdit(user);
  }, [user, setUserEdit]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserEdit({ ...userEdit, [name]: value });
  };

  const onSavePersonal = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const necessaryFieldsFilled = necessaryFieldsAreFilled(userEdit);

      if (!necessaryFieldsFilled) {
        toast.error("Please fill in the necessary fields!");
        return;
      }

      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: userEdit }),
      });
      if (!res.ok) {
        toast.error(res.statusText ?? "Something went wrong.");
      } else {
        const updatedUser = (await res.json()) as User;
        setUser({ ...user, ...updatedUser });
        setEnableEdit(false);
      }
    } catch (error: any) {
      toast.error(error?.message, error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoadingPicture(true);
      const image = e.target.files?.[0];
      if (!image) {
        return;
      }

      const formData = new FormData();
      formData.append("files", image);
      formData.append("ref", "plugin::users-permissions.user");
      formData.append("refId", user.id.toString());
      formData.append("field", "picture");

      const uploadFetch = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadResult = await uploadFetch.json();
      if (uploadFetch.ok) {
        const updatedUser = await getMyDetails(token);
        setUser(updatedUser);
      } else {
        toast.error(uploadResult.message ?? uploadFetch.statusText);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoadingPicture(false);
    }
  };

  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };

  const handlePersonalEditCancel = () => {
    setEnableEdit(false);
    setUserEdit(user);
  };

  return enableEdit ? (
    <>
      <PasswordResetModal
        show={showPasswordModal}
        setShow={setShowPasswordModal}
        token={token}
      />
      <form className="longer-form-labels">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">{profile[locale].avatar}:</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="image is-32x32 is-rounded">
                <Image
                  className="image is-32x32 is-rounded"
                  alt="Profile"
                  src={
                    user.picture?.formats?.thumbnail.url ??
                    user.picture?.url ??
                    defaultAvatarPath
                  }
                  width="32"
                  height="32"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="field">
              <div className="file">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      {loadingPicture ? (
                        <span className="loading"></span>
                      ) : (
                        <FontAwesomeIcon icon={faUpload} />
                      )}
                    </span>
                    <span className="file-label">
                      {loadingPicture
                        ? profile[locale].loadingPicture
                        : profile[locale].upload}
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">{profile[locale].userName}:</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded has-icons-left">
                <input
                  className="input"
                  type="text"
                  id="username"
                  name="username"
                  placeholder="user"
                  value={userEdit?.username ?? "" ?? ""}
                  onChange={handleInputChange}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">{profile[locale].firstName}:</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded has-icons-left">
                <input
                  className={`input ${userEdit?.firstname ? "" : "is-danger"}`}
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="First Name"
                  value={userEdit?.firstname ?? ""}
                  onChange={handleInputChange}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">{profile[locale].middleNames}:</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded has-icons-left">
                <input
                  className="input"
                  type="text"
                  id="middle_names"
                  name="middle_names"
                  placeholder="Middle Name(s)"
                  value={userEdit?.middle_names ?? ""}
                  onChange={handleInputChange}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">{profile[locale].lastName}:</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded has-icons-left">
                <input
                  className={`input ${userEdit?.lastname ? "" : "is-danger"}`}
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Last Name"
                  value={userEdit?.lastname ?? ""}
                  onChange={handleInputChange}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">{profile[locale].email}:</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded has-icons-left has-icons-right">
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  value={userEdit?.email ?? ""}
                  onChange={handleInputChange}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="field is-grouped">
          <div className="field-label is-normal">
            <label className="label"></label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <div
                  className="button is-light is-link"
                  onClick={togglePasswordModal}
                >
                  {profile[locale].changePassword}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">{profile[locale].gender}:</label>
          </div>
          <div className="field-body">
            <div className="field">
              <GenderSelect
                value={userEdit?.gender ?? ""}
                onInputChange={handleInputChange}
                locale={locale}
                required={true}
              />
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">{profile[locale].birthdate}:</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control">
                <input
                  className={`input ${userEdit?.birthday ? "" : "is-danger"}`}
                  type="date"
                  name="birthday"
                  value={userEdit?.birthday ?? ""}
                  onChange={handleInputChange}
                />
              </p>
            </div>
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <div
              className={`button is-primary ${isSaving ? "is-loading" : ""}`}
              onClick={onSavePersonal}
            >
              {general.buttons[locale].save}
            </div>
          </div>
          <div className="control">
            <div className="button" onClick={handlePersonalEditCancel}>
              {general.buttons[locale].cancel}
            </div>
          </div>
        </div>
      </form>
    </>
  ) : (
    <>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].avatar}:
        </div>
        <div className="column">
          <div className="image is-32x32 is-rounded">
            <Image
              className="image is-32x32 is-rounded"
              alt="Profile"
              src={
                user?.picture?.formats?.thumbnail.url ??
                user?.picture?.url ??
                defaultAvatarPath
              }
              width="32"
              height="32"
              objectFit="cover"
            />
          </div>
        </div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].userName}:
        </div>
        <div className="column">{user?.username}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].firstName}:
        </div>
        <div className="column">{user?.firstname}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].middleNames}:
        </div>
        <div className="column">{user?.middle_names}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].lastName}:
        </div>
        <div className="column">{user?.lastname}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].email}:
        </div>
        <div className="column">{user?.email}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].gender}:
        </div>
        <div className="column">
          {user?.gender ? profile[locale][user.gender] : "-"}
        </div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].birthdate}:
        </div>
        <div className="column">
          {user?.birthday
            ? new Date(user.birthday).toLocaleDateString(locale)
            : "-"}
        </div>
      </div>
      <div className="button is-primary" onClick={() => setEnableEdit(true)}>
        {general.buttons[locale].edit}
      </div>
    </>
  );
}
function necessaryFieldsAreFilled(userEdit: User) {
  return userEdit.username?.length > 0 && userEdit.email?.length > 0;
}
