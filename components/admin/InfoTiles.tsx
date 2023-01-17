import styles from "@/styles/InfoTiles.module.css";

export default function InfoTiles({
  data,
}: {
  data: { count: number; name: string }[];
}) {
  return (
    <div className="tile is-ancestor has-text-centered">
      {data.map((tile, index) => (
        <div key={index} className="tile is-parent">
          <article className="tile is-child box">
            <p className="title">{tile.count}</p>
            <p className={`subtitle ${styles.subtitle}`}>{tile.name}</p>
          </article>
        </div>
      ))}
    </div>
  );
}
