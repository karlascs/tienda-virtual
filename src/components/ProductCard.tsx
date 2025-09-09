import styles from "@/styles/card.module.css";

type Props = { name: string; price: number; image: string };

export default function ProductCard({ name, price, image }: Props) {
  return (
    <article className={`${styles.card} card`}>
      <img src={image} alt={name} />
      <div className="body">
        <h3>{name}</h3>
        <p className="price">
          {price.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
        </p>
      </div>
    </article>
  );
}
