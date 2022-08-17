import { references } from "@/i18n";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SchoolApplication, User } from "definitions/backend";
import { sendReference } from "lib/references";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

export default function ReferenceForm({
  application,
  user,
  token,
  reference1Send,
  reference2Send,
  schoolReference = true,
}: {
  application: any;
  user: User;
  token: string;
  reference1Send: Dispatch<SetStateAction<boolean>>;
  reference2Send: Dispatch<SetStateAction<boolean>>;
  schoolReference: boolean;
}) {
  const [sendingReference1, setSendingReference1] = useState(false);
  const [sendingReference2, setSendingReference2] = useState(false);
  const [reference1, setReference1] = useState(
    application?.reference1?.data
      ? {
          id: application?.reference1?.data.id,
          ...application?.reference1?.data.attributes,
        }
      : {}
  );
  const [reference2, setReference2] = useState(
    application?.reference2?.data
      ? {
          id: application?.reference2?.data.id,
          ...application?.reference2?.data.attributes,
        }
      : {}
  );
  const { locale } = useRouter();
  const onReference1ValueChanged = (e) => {
    const { name, value } = e.target;
    setReference1({ ...reference1, [name]: value });
  };

  const onReference2ValueChanged = (e) => {
    const { name, value } = e.target;
    setReference2({ ...reference2, [name]: value });
  };

  const sendReference1 = async () => {
    if (sendingReference1) {
      return;
    }

    const allInfoSet =
      reference1.email && reference1.relation && reference1.name;

    if (!allInfoSet) {
      toast.error("Please fill in all fields for reference 1.");
      return;
    }

    try {
      setSendingReference1(true);

      await sendReference(
        "reference1",
        application,
        reference1,
        user,
        token,
        schoolReference
      );
      setReference1({ ...reference1, emailSend: true });
      reference1Send && reference1Send(true);
      toast.success("email send successfully");
    } catch (error) {
      toast.error(`Failed to send reference because ${error.message}`);
    } finally {
      setSendingReference1(false);
    }
  };

  const sendReference2 = async () => {
    if (sendingReference2) {
      return;
    }

    const allInfoSet =
      reference2.email && reference2.relation && reference2.name;

    if (!allInfoSet) {
      toast.error("Please fill in all fields for reference 2.");
      return;
    }

    try {
      setSendingReference2(true);
      await sendReference(
        "reference2",
        application,
        reference2,
        user,
        token,
        schoolReference
      );
      setReference2({ ...reference2, emailSend: true });
      reference2Send && reference2Send(true);
      toast.success("email send successfully");
    } catch (error) {
      toast.error(`Failed to send reference because ${error.message}`);
    } finally {
      setSendingReference2(false);
    }
  };

  return (
    <form className="form">
      <div className="columns has-text-left">
        <div className="column">
          <h4>{references[locale].reference1Title}</h4>

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
                    value={reference1.name ?? ""}
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
                    value={reference1.relation ?? ""}
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
                    value={reference1.email ?? ""}
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
          <h4>{references[locale].reference2Title}</h4>

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
                    value={reference2.name ?? ""}
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
                    value={reference2.relation ?? ""}
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
                    value={reference2.email ?? ""}
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
