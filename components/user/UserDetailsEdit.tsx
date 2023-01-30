import { ChangeEvent, MouseEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import {
  faFlag,
  faLanguage,
  faMobilePhone,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { general, profile } from "@/i18n";
import { UserDetails } from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import NationalitySelect from "../common/NationalitySelect";
import { allNationalities } from "lib/countries";

export default function UserDetailsEdit({
  allowEdit = false,
  token,
  userDetails,
  showSave = true,
  setSaveFunction = undefined,
}: {
  allowEdit?: boolean;
  token: string;
  userDetails?: UserDetails;
  showSave?: boolean;
  setSaveFunction?: (fn: any) => void;
}) {
  const [updatedUser, setUpdatedUser] = useState<
    Partial<UserDetails> | undefined
  >(userDetails);
  const [userEdit, setUserEdit] = useState<Partial<UserDetails> | undefined>(
    updatedUser
  );

  const locale = useLocale();
  const [allowPersonalEdit, setAllowDetailEdit] = useState(allowEdit ?? false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (userEdit) {
      setUserEdit({ ...userEdit, [name]: value });
    } else {
      setUserEdit({ [name]: value });
    }
  };

  const handleNationalityChange = (country?: string) => {
    if (userEdit) {
      setUserEdit({ ...userEdit, nationality: country });
    } else {
      setUserEdit({ nationality: country });
    }
  };

  const onSaveDetails = async (e: MouseEvent) => {
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
        throw new Error(
          errorObj.error.message ?? res.statusText ?? "Something went wrong."
        );
      } else {
        setUpdatedUser(userEdit);
        if (showSave) {
          toast.success("User Details saved successfully");
        }
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
      setUpdatedUser(userEdit);

      if (showSave) {
        toast.success("User Details saved successfully");
      }
    }
  };
  setSaveFunction && setSaveFunction(onSaveDetails);

  const handleDetailsEditCancel = () => {
    setAllowDetailEdit(false);
    setUserEdit(updatedUser);
  };

  return allowPersonalEdit ? (
    <form className="longer-form-labels">
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{profile[locale].phone}:</label>
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
        <div className="field-label is-normal">
          <label className="label">{profile[locale].mobilePhone}:</label>
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
        <div className="field-label is-normal">
          <label className="label">{profile[locale].nationality}*:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded has-icons-left">
              <NationalitySelect
                nationality={userEdit?.nationality}
                nationalityChanged={handleNationalityChange}
                locale={locale}
                required={true}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faFlag} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{profile[locale].nativeLanguage}:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="native_language"
                name="native_language"
                placeholder={profile[locale].nativeLanguagePlaceholder}
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
        <div className="field-label is-normal">
          <label className="label">{profile[locale].secondLanguage}:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="language2"
                name="language2"
                placeholder={profile[locale].secondLanguagePlaceholder}
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
        <div className="field-label is-normal">
          <label className="label">{profile[locale].thirdLanguage}:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-left">
              <input
                className="input"
                type="text"
                id="language3"
                name="language3"
                placeholder={profile[locale].thirdLanguagePlaceholder}
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
              {general.buttons[locale].save}
            </div>
          </div>
          <div className="control">
            {" "}
            <div className="button" onClick={handleDetailsEditCancel}>
              {general.buttons[locale].cancel}
            </div>
          </div>
        </div>
      )}
    </form>
  ) : (
    <>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].phone}:
        </div>
        <div className="column">{updatedUser?.phone}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].mobilePhone}:
        </div>
        <div className="column">{updatedUser?.mobile_phone}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].nationality}:
        </div>
        <div className="column">
          {updatedUser?.nationality
            ? allNationalities.getName(updatedUser?.nationality, locale)
            : ""}
        </div>
      </div>
      <hr />
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].nativeLanguage}:
        </div>
        <div className="column">{updatedUser?.native_language}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].secondLanguage}:
        </div>
        <div className="column">{updatedUser?.language2}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {profile[locale].thirdLanguage}:
        </div>
        <div className="column">{updatedUser?.language3}</div>
      </div>
      <div
        className="button is-primary"
        onClick={() => setAllowDetailEdit(true)}
      >
        {general.buttons[locale].edit}
      </div>
    </>
  );
}
