import { references } from "@/i18n";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Reference,
  SchoolApplication,
  StaffApplication,
  User,
} from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import { sendReference } from "lib/references";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import * as EmailValidator from "email-validator";

export default function ReferenceForm({
  application,
  user,
  reference1Send,
  reference2Send,
}: {
  application: SchoolApplication | StaffApplication;
  user?: User;
  reference1Send: Dispatch<SetStateAction<boolean>>;
  reference2Send: Dispatch<SetStateAction<boolean>>;
}) {
  const [sendingReference1, setSendingReference1] = useState(false);
  const [sendingReference2, setSendingReference2] = useState(false);
  const [reference1, setReference1] = useState<Partial<Reference> | undefined>(
    application?.references != undefined && application?.references?.length > 0
      ? application?.references?.[0]
      : undefined
  );
  const [reference2, setReference2] = useState<Partial<Reference> | undefined>(
    application?.references != undefined && application?.references?.length > 1
      ? application?.references?.[1]
      : undefined
  );
  const locale = useLocale();
  const onReference1ValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (reference1) {
      setReference1({ ...reference1, [name]: value });
    } else {
      setReference1({ [name]: value });
    }
  };

  const onReference2ValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (reference2) {
      setReference2({ ...reference2, [name]: value });
    } else {
      setReference2({ [name]: value });
    }
  };

  const sendReference1 = async () => {
    if (sendingReference1 || !user) {
      return;
    }

    const allInfoSet =
      reference1?.email && reference1.relation && reference1.name;

    if (!allInfoSet) {
      toast.error("Please fill in all fields for reference 1.");
      return;
    }

    EmailValidator.validate(reference1.email!);

    try {
      setSendingReference1(true);

      await sendReference(application, reference1, user);
      setReference1({ ...reference1, emailSend: true });
      reference1Send && reference1Send(true);
      toast.success("email send successfully");
    } catch (error: any) {
      toast.error(`Failed to send reference because ${error.message ?? error}`);
    } finally {
      setSendingReference1(false);
    }
  };

  const sendReference2 = async () => {
    if (sendingReference2 || !user) {
      return;
    }

    const allInfoSet =
      reference2?.email != undefined &&
      reference2.relation != undefined &&
      reference2.name != undefined;

    if (!allInfoSet) {
      toast.error("Please fill in all fields for reference 2.");
      return;
    }

    const emailValid = EmailValidator.validate(reference2.email!);
    if (!emailValid) {
      toast.error("Email is not valid. Please provide a valid email");
      return;
    }

    try {
      setSendingReference2(true);
      await sendReference(application, reference2, user);
      setReference2({ ...reference2, emailSend: true });
      reference2Send && reference2Send(true);
      toast.success("email send successfully");
    } catch (error: any) {
      toast.error(`Failed to send reference because ${error.message}`);
    } finally {
      setSendingReference2(false);
    }
  };

  return (
    <form className="form">
      <div className="columns has-text-left">
        <div className="column">
          <h4>{references[locale].referenceTitle} 1</h4>

          {reference1?.emailSend ? (
            <>
              <h6 className="subtitle is-6">{references[locale].name}</h6>
              <p>{reference1.name}</p>
              <h6 className="subtitle is-6">{references[locale].relation}</h6>
              <p>{reference1.relation}</p>
              <h6 className="subtitle is-6">{references[locale].email}</h6>
              <p>{reference1.email}</p>
              <h6 className="subtitle is-6">{references[locale].status}</h6>
              <div>
                {reference1.submitted ? (
                  <div>
                    <span className="icon">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="has-text-success"
                      />
                    </span>
                    {references[locale].submitted}
                  </div>
                ) : (
                  <div>
                    <span className="icon">
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="has-text-danger"
                      />
                    </span>
                    {references[locale].notSubmitted}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label className="label">{references[locale].name}</label>
                <div className="control">
                  <input
                    type="text"
                    name="name"
                    className="input"
                    value={reference1?.name ?? ""}
                    onChange={onReference1ValueChanged}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">{references[locale].relation}</label>
                <div className="control">
                  <input
                    type="text"
                    name="relation"
                    className="input"
                    value={reference1?.relation ?? ""}
                    onChange={onReference1ValueChanged}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">{references[locale].email}</label>
                <div className="control">
                  <input
                    type="email"
                    name="email"
                    className="input"
                    value={reference1?.email ?? ""}
                    onChange={onReference1ValueChanged}
                  />
                </div>
              </div>

              <div
                className={`button is-link ${
                  sendingReference1 ? "is-loading" : ""
                }`}
                onClick={sendReference1}
              >
                {references[locale].sendEmail}
              </div>
            </>
          )}
        </div>
        <div className="column">
          <h4>{references[locale].referenceTitle} 2</h4>

          {reference2?.emailSend ? (
            <>
              <h5 className="subtitle is-6">{references[locale].name}</h5>
              <p>{reference2.name}</p>
              <h5 className="subtitle is-6">{references[locale].relation}</h5>
              <p>{reference2.relation}</p>
              <h5 className="subtitle is-6">{references[locale].email}</h5>
              <p>{reference2.email}</p>
              <h6 className="subtitle is-6">{references[locale].status}</h6>
              <div>
                {reference2.submitted ? (
                  <div>
                    <span className="icon has-text-success">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    {references[locale].submitted}
                  </div>
                ) : (
                  <div>
                    <span className="icon has-text-danger">
                      <FontAwesomeIcon icon={faXmark} />
                    </span>
                    {references[locale].notSubmitted}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label className="label">{references[locale].name}</label>
                <div className="control">
                  <input
                    type="text"
                    name="name"
                    className="input"
                    value={reference2?.name ?? ""}
                    onChange={onReference2ValueChanged}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">{references[locale].relation}</label>
                <div className="control">
                  <input
                    type="text"
                    name="relation"
                    className="input"
                    value={reference2?.relation ?? ""}
                    onChange={onReference2ValueChanged}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">{references[locale].email}</label>
                <div className="control">
                  <input
                    type="email"
                    name="email"
                    className="input"
                    value={reference2?.email ?? ""}
                    onChange={onReference2ValueChanged}
                  />
                </div>
              </div>

              <div
                className={`button is-link ${
                  sendingReference2 ? "is-loading" : ""
                }`}
                onClick={sendReference2}
              >
                {references[locale].sendEmail}
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
