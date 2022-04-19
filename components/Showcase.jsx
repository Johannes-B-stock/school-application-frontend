import styles from "@/styles/Showcase.module.css";

export default function Showcase() {
  return (
    <section
      className={`hero is-medium is-link has-text-centered ${styles.showcase}`}
    >
      <div className="hero-body">
        <p className="title">Welcome to the school application page</p>
        <p className="subtitle">
          Here you can apply for schools and manage your registered schools
        </p>
      </div>
    </section>
  );
}
