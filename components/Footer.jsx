import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container is-max-desktop">
        <div className="content has-text-centered">
          <p>Copyright &copy; Johannes Birkenstock</p>
          <nav className="level">
            <div className="level-left"></div>
            <div className="level-right">
              <div className="level-item">
                <Link href="/about">About</Link>
              </div>
              <div className="level-item">
                <Link href="/contact">Contact</Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
