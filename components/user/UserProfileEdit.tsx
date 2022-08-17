import AuthContext from "@/context/AuthContext";
import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { getMyDetails } from "lib/user";
import GenderSelect from "../common/GenderSelect";
import { general, profile } from "@/i18n";

export default function UserProfileEdit({ allowEdit = false, token, user }) {
  const router = useRouter();
  const { setUser } = useContext(AuthContext);
  const [loadingPicture, setLoadingPicture] = useState(false);

  const [userEdit, setUserEdit] = useState(user);
  const [allowPersonalEdit, setAllowPersonalEdit] = useState(
    allowEdit ?? false
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    setUserEdit(user);
  }, [user, setUserEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserEdit({ ...userEdit, [name]: value });
  };

  const onSavePersonal = async (e) => {
    e.preventDefault();

    const hasOnlyEmptyValues = Object.values(userEdit).every(
      (value) => value === ""
    );

    if (hasOnlyEmptyValues) {
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
      const updatedUser = await res.json();
      setUser({ ...user, ...updatedUser });
      toast.success("Saved successfully");
    }
  };

  const handleFileChange = async (e) => {
    try {
      setLoadingPicture(true);
      const image = e.target.files[0];

      const formData = new FormData();
      formData.append("files", image);
      formData.append("ref", "plugin::users-permissions.user");
      formData.append("refId", user.id);
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
    } catch (error) {
      toast.error(error);
    } finally {
      setLoadingPicture(false);
    }
  };

  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };

  const handlePersonalEditCancel = () => {
    setAllowPersonalEdit(false);
    setUserEdit(user);
  };

  return allowPersonalEdit ? (
    <form className="longer-form-labels">
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{profile[router.locale].avatar}:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="image is-32x32 is-rounded">
              <Image
                className="image is-32x32 is-rounded"
                alt="Profile"
                src={
                  user.picture?.formats.thumbnail.url ??
                  "/images/defaultAvatar.png"
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
                      ? profile[router.locale].loadingPicture
                      : profile[router.locale].upload}
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{profile[router.locale].userName}:</label>
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
                value={userEdit?.username}
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
          <label className="label">{profile[router.locale].firstName}:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="firstname"
                name="firstname"
                placeholder="First Name"
                value={userEdit?.firstname}
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
          <label className="label">{profile[router.locale].middleNames}:</label>
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
                value={userEdit?.middle_names}
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
          <label className="label">{profile[router.locale].lastName}:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Last Name"
                value={userEdit?.lastname}
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
          <label className="label">{profile[router.locale].email}:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left has-icons-right">
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={userEdit?.email}
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
                {profile[router.locale].changePassword}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{profile[router.locale].gender}:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <GenderSelect
              value={userEdit?.gender}
              onInputChange={handleInputChange}
              locale={router.locale}
            />
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{profile[router.locale].birthdate}:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="date"
                name="birthday"
                value={userEdit?.birthday}
                onChange={handleInputChange}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="field is-grouped">
        <div className="control">
          <div className="button is-primary" onClick={onSavePersonal}>
            {general.buttons[router.locale].save}
          </div>
        </div>
        <div className="control">
          {" "}
          <div className="button" onClick={handlePersonalEditCancel}>
            {general.buttons[router.locale].cancel}
          </div>
        </div>
      </div>
    </form>
  ) : (
    <>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[router.locale].avatar}:
        </div>
        <div className="column">
          <div className="image is-32x32 is-rounded">
            <Image
              className="image is-32x32 is-rounded"
              alt="Profile"
              src={
                user?.picture?.formats.thumbnail.url ??
                "/images/defaultAvatar.png"
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
          {profile[router.locale].userName}:
        </div>
        <div className="column">{user?.username}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[router.locale].firstName}:
        </div>
        <div className="column">{user?.firstname}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[router.locale].middleNames}:
        </div>
        <div className="column">{user?.middle_names}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[router.locale].lastName}:
        </div>
        <div className="column">{user?.lastname}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[router.locale].email}:
        </div>
        <div className="column">{user?.email}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[router.locale].gender}:
        </div>
        <div className="column">
          {user?.gender ? profile[router.locale][user.gender] : "-"}
        </div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[router.locale].birthdate}:
        </div>
        <div className="column">
          {user?.birthday
            ? new Date(user.birthday).toLocaleDateString(router.locale)
            : "-"}
        </div>
      </div>
      <div
        className="button is-primary"
        onClick={() => setAllowPersonalEdit(true)}
      >
        {general.buttons[router.locale].edit}
      </div>
    </>
  );
}
