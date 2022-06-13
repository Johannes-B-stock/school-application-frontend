import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { API_URL } from "@/config/index";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { user, register, error } = useContext(AuthContext);

  const router = useRouter();

  if (user) {
    router.push("/");
  }

  useEffect(() => {
    error && toast.error(error);
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      };
      await register(userData);
    }
    setIsLoading(false);
  };
  return (
    <div className="columns is-centered has-text-centered ">
      <div className="column is-5 box p-5">
        <h1 className="title is-4">Register</h1>
        <p className="description">Register now to apply for a school.</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="text"
                placeholder="Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="password"
                placeholder="Password"
                id="password"
                autoComplete="on"
                name="password"
                value={formData.password}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="password"
                placeholder="Confirm Password"
                id="confirmPassword"
                autoComplete="on"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
              />
            </div>
          </div>
          <button
            className={`button is-block is-primary is-fullwidth is-medium ${
              isLoading && "is-loading"
            }`}
          >
            Submit
          </button>
          <br />
          <small>
            <em>
              Already have an account? <Link href="/account/login">Login</Link>
            </em>
          </small>
        </form>
        <br />
        <div className="separator has-text-grey is-italic">or</div>
        <br />
        <button
          className="button is-light is-fullwidth is-medium"
          onClick={() => router.push(`${API_URL}/api/connect/google`)}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faGoogle} />
          </span>
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
}

Register.getLayout = function getLayout(page) {
  return <Layout title="User registration">{page}</Layout>;
};
