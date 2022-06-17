import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, error } = useContext(AuthContext);
  useEffect(() => {
    console.log("test");
    error && toast.error(error);
  }, [error]);

  const router = useRouter();

  const onChange = (e) => {
    console.log("test3");
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    console.log("test2");
    e.preventDefault();
    setIsLoading(true);
    await login(formData);
    setIsLoading(false);
  };

  return (
    <div className="columns is-centered has-text-centered ">
      <div className="column is-5 box p-5">
        <h1 className="title is-4">Login</h1>
        <p className="description">You have to login to see this.</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium"
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                autoComplete="on"
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
                name="password"
                autoComplete="on"
                value={formData.password}
                onChange={onChange}
              />
            </div>
          </div>
          <button
            className={`button is-block is-primary is-fullwidth is-medium ${
              isLoading && "is-loading"
            }`}
            type="submit"
          >
            Submit
          </button>
          <br />
          <small>
            <em>
              Don&apos;t have an account?{" "}
              <Link href="/account/register">Register</Link>
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

Login.getLayout = function getLayout(page) {
  return <Layout title="Login to page">{page}</Layout>;
};
