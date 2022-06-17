import Link from "next/link";
import { useRouter } from "next/router";

export default function ProfileSidebar() {
  const router = useRouter();

  return (
    <aside className="menu">
      <ul className="menu-list">
        <p className="menu-label">General</p>
        <li>
          <Link href="/user/profile">
            <a
              className={`${
                router.pathname === "/user/profile" ? "is-active" : ""
              }`}
            >
              Profile
            </a>
          </Link>
        </li>
        <p className="menu-label">Schools</p>
        <li>
          <Link href="/user/applications">
            <a
              className={`${
                router.pathname === "/user/applications" ? "is-active" : ""
              }`}
            >
              Applications
            </a>
          </Link>
        </li>
        <li>
          <Link href="/user/settings">
            <a
              className={`${
                router.pathname === "/user/settings" ? "is-active" : ""
              }`}
            >
              Settings
            </a>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
