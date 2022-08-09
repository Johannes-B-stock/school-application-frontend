import {
  faMars,
  faMarsAndVenus,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function GenderSelect({ value, onInputChange }) {
  return (
    <div className="control is-expanded has-icons-left">
      <div className="select">
        <select
          name="gender"
          id="gender"
          value={value}
          onChange={onInputChange}
        >
          <option value="null"></option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <span className="icon is-small is-left">
        {value === "male" && <FontAwesomeIcon icon={faMars} />}
        {value === "female" && <FontAwesomeIcon icon={faVenus} />}
        {value !== "male" && value !== "female" && (
          <FontAwesomeIcon icon={faMarsAndVenus} />
        )}
      </span>
    </div>
  );
}
