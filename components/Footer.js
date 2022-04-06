import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>Copyright &copy; Johannes Birkenstock</p>
        <p>
          <Link href="/about">About</Link>
        </p>
      </div>
    </footer>
  );
}
