import { profileSidebar } from "@/i18n";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProfileSidebar() {
  const router = useRouter();

  return (
    <aside className="menu">
      <ul className="menu-list">
        <p className="menu-label">{profileSidebar[router.locale].general}</p>
        <li>
          <Link href="/user/profile">
            <a
              className={`${
                router.pathname === "/user/profile" ? "is-active" : ""
              }`}
            >
              {profileSidebar[router.locale].profile}
            </a>
          </Link>
        </li>
        <li>
          <Link href="/user/address">
            <a
              className={`${
                router.pathname === "/user/address" ? "is-active" : ""
              }`}
            >
              {profileSidebar[router.locale].addresses}
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
              {profileSidebar[router.locale].settings}
            </a>
          </Link>
        </li>
        <p className="menu-label">{profileSidebar[router.locale].schools}</p>
        <li>
          <Link href="/user/applications">
            <a
              className={`${
                router.pathname === "/user/applications" ? "is-active" : ""
              }`}
            >
              {profileSidebar[router.locale].applications}
            </a>
          </Link>
        </li>
        <li>
          <Link href="/user/schools">
            <a
              className={`${
                router.pathname === "/user/schools" ? "is-active" : ""
              }`}
            >
              {profileSidebar[router.locale].mySchools}
            </a>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
