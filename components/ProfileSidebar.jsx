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
                router.pathname.endsWith("profile") ? "is-active" : ""
              }`}
            >
              Profile
            </a>
          </Link>
        </li>
        <p className="menu-label">Schools</p>
        <li>
          <Link href="/user/applications">Applications</Link>
        </li>
        <li>
          <a>Settings</a>
        </li>
      </ul>
    </aside>
  );
}
