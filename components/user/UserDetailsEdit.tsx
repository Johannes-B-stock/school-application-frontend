import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import {
  faFlag,
  faLanguage,
  faMobilePhone,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

export default function UserDetailsEdit({
  allowEdit = false,
  token,
  userDetails,
  showSave = true,
  setSaveFunction = null,
}) {
  const [userEdit, setUserEdit] = useState(userDetails);
  const [allowPersonalEdit, setAllowDetailEdit] = useState(allowEdit ?? false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserEdit({ ...userEdit, [name]: value });
  };

  const onSaveDetails = async (e) => {
    e?.preventDefault();
    if (!userEdit?.nationality) {
      throw new Error("Nationality missing!");
    }
    if (!userDetails) {
      const res = await fetch(`${API_URL}/api/user-details/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: userEdit }),
      });
      if (!res.ok) {
        const errorObj = await res.json();
        toast.error(
          errorObj.error.message ?? res.statusText ?? "Something went wrong."
        );
      } else {
        toast.success("Saved successfully");
      }
      return;
    }

    const res = await fetch(`${API_URL}/api/user-details/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: userEdit }),
    });
    if (!res.ok) {
      const errorObj = await res.json();
      toast.error(
        errorObj.error.message ?? res.statusText ?? "Something went wrong."
      );
    } else {
      toast.success("Saved successfully");
    }
  };
  setSaveFunction && setSaveFunction(onSaveDetails);

  const handleDetailsEditCancel = () => {
    setAllowDetailEdit(false);
    setUserEdit(userDetails);
  };

  return allowPersonalEdit ? (
    <form>
      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">Phone:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="phone"
                name="phone"
                placeholder="(+49) 1234/56789"
                value={userEdit?.phone ?? ""}
                onChange={handleInputChange}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faPhone} />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">Mobile Phone:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="mobile_phone"
                name="mobile_phone"
                placeholder="(+49) 1234/56789"
                value={userEdit?.mobile_phone ?? ""}
                onChange={handleInputChange}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faMobilePhone} />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">Nationality*:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="nationality"
                name="nationality"
                placeholder="Nationality"
                value={userEdit?.nationality ?? ""}
                onChange={handleInputChange}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faFlag} />
              </span>
            </p>
          </div>
        </div>
      </div>
      <hr />
      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">Native Language:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="native_language"
                name="native_language"
                placeholder="German"
                value={userEdit?.native_language ?? ""}
                onChange={handleInputChange}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faLanguage} />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">Second Language:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="language2"
                name="language2"
                placeholder="German"
                value={userEdit?.language2 ?? ""}
                onChange={handleInputChange}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faLanguage} />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">Third Language:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="language3"
                name="language3"
                placeholder="German"
                value={userEdit?.language3 ?? ""}
                onChange={handleInputChange}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faLanguage} />
              </span>
            </p>
          </div>
        </div>
      </div>
      {showSave && (
        <div className="field is-grouped">
          <div className="control">
            <div className="button is-primary" onClick={onSaveDetails}>
              Save
            </div>
          </div>
          <div className="control">
            {" "}
            <div className="button" onClick={handleDetailsEditCancel}>
              Cancel
            </div>
          </div>
        </div>
      )}
    </form>
  ) : (
    <>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">Phone:</div>
        <div className="column">{userDetails?.phone}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          Mobile Phone:
        </div>
        <div className="column">{userDetails?.mobile_phone}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">Nationality:</div>
        <div className="column">{userDetails?.nationality}</div>
      </div>
      <hr />
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          Native language:
        </div>
        <div className="column">{userDetails?.native_language}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          Second language:
        </div>
        <div className="column">{userDetails?.language2}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          Third language:
        </div>
        <div className="column">{userDetails?.language3}</div>
      </div>
      <div
        className="button is-primary"
        onClick={() => setAllowDetailEdit(true)}
      >
        Edit
      </div>
    </>
  );
}
