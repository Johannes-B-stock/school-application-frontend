import styles from "@/styles/Showcase.module.css";

export default function Showcase({ imageUrl, title, subtitle }) {
  return (
    <section
      className={`hero is-medium is-link has-text-centered ${styles.showcase}`}
      style={{ "background-image": `url(${imageUrl})` }}
    >
      <div className="hero-body">
        <p className="title">{title}</p>
        <p className="subtitle">{subtitle}</p>
      </div>
    </section>
  );
}
