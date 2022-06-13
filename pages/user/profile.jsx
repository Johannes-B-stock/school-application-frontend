import AuthContext from "@/context/AuthContext";
import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/styles/ProfilePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { parseCookie } from "@/helpers/index";
import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import AddressEdit from "@/components/AddressEdit";
import ProfileHeaderCard from "@/components/ProfileHeaderCard";
import ProfileSidebar from "@/components/ProfileSidebar";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage({ token }) {
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const [loadingPicture, setLoadingPicture] = useState(false);

  const [userEdit, setUserEdit] = useState(user);
  const [allowPersonalEdit, setAllowPersonalEdit] = useState(false);

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

      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const res = await fetch(`${API_URL}/users/me`);
        if (res.ok) {
          const updatedUser = await res.json();
          setUser(updatedUser);
        } else {
          router.reload();
        }
      } else {
        const result = res.json();
        toast.error(result.message ?? res.statusText);
      }
    } catch (error) {
      toast.error(res.statusText);
    } finally {
      setLoadingPicture(false);
    }
  };

  const handlePersonalEditCancel = () => {
    setAllowPersonalEdit(false);
    setUserEdit(user);
  };

  return (
    <>
      <ProfileHeaderCard user={user} />
      <div className="columns">
        <div className="column is-3">
          <ProfileSidebar />
        </div>
        <div className="column">
          <h1 className="title">Profile Page</h1>
          <div className={`card ${styles.profileCard}`}>
            <div className="card-header background-gradient-light-left">
              <div className="card-header-title">Personal Information</div>
            </div>
            <div className="card-content">
              {allowPersonalEdit ? (
                <form>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Avatar:</label>
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
                                  ? "Loading picture"
                                  : "Upload a new picture"}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">User Name:</label>
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
                      <label className="label">First Name:</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <p className="control is-expanded has-icons-left">
                          <input
                            className="input"
                            type="text"
                            id="firstname"
                            name="firstname"
                            placeholder="user"
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
                      <label className="label">Last Name:</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <p className="control is-expanded has-icons-left">
                          <input
                            className="input"
                            type="text"
                            id="lastname"
                            name="lastname"
                            placeholder="user"
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
                      <label className="label">Email:</label>
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
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Gender:</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left has-icons-right">
                          <div className="select">
                            <select
                              name="gender"
                              id="gender"
                              value={userEdit?.gender}
                              onChange={handleInputChange}
                            >
                              <option value="null">unknown</option>
                              <option value="male">male</option>
                              <option value="female">female</option>
                              <option value="other">other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Birthday:</label>
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
                      <div
                        className="button is-primary"
                        onClick={onSavePersonal}
                      >
                        Save
                      </div>
                    </div>
                    <div className="control">
                      {" "}
                      <div
                        className="button"
                        onClick={handlePersonalEditCancel}
                      >
                        Cancel
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  <div className="columns">
                    <div className="column is-3 has-text-weight-semibold">
                      Avatar:
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
                      User Name:
                    </div>
                    <div className="column">{user?.username}</div>
                  </div>

                  <div className="columns">
                    <div className="column is-3 has-text-weight-semibold">
                      First Name:
                    </div>
                    <div className="column">{user?.firstname}</div>
                  </div>

                  <div className="columns">
                    <div className="column is-3 has-text-weight-semibold">
                      Last Name:
                    </div>
                    <div className="column">{user?.lastname}</div>
                  </div>

                  <div className="columns">
                    <div className="column is-3 has-text-weight-semibold">
                      Email:
                    </div>
                    <div className="column">{user?.email}</div>
                  </div>
                  <div className="columns">
                    <div className="column is-3 has-text-weight-semibold">
                      Gender:
                    </div>
                    <div className="column">{user?.gender ?? "-"}</div>
                  </div>
                  <div className="columns">
                    <div className="column is-3 has-text-weight-semibold">
                      Birthdate:
                    </div>
                    <div className="column">
                      {user?.birthday
                        ? new Date(user.birthday).toLocaleDateString(
                            router.locale
                          )
                        : "-"}
                    </div>
                  </div>
                  <div
                    className="button is-primary"
                    onClick={() => setAllowPersonalEdit(true)}
                  >
                    Edit
                  </div>
                </>
              )}
            </div>
          </div>
          <br />
          <div className={`card ${styles.profileCard}`}>
            <div className="card-header">
              <div className="card-header-title">My Address</div>
            </div>
            <div className="card-content">
              {user && (
                <AddressEdit token={token} user={user} address={user.address} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookie(req);

  return {
    props: { token: token ?? null },
  };
}
