import styles from "./RideCard.module.css";

const PROVIDER_COLOR = { uber: "var(--uber-dark)", lyft: "var(--lyft-pink)" };

export default function RideCard({ ride, isCheapest, changed }) {
  const surgeLabel = ride.provider === "lyft"
    ? ride.surge_multiplier
    : ride.surge_multiplier > 1
      ? `${ride.surge_multiplier}x`
      : null;

  return (
    <div
      className={`${styles.card} ${isCheapest ? styles.cheapest : ""} ${changed ? styles.changed : ""}`}
      style={{ "--provider-color": PROVIDER_COLOR[ride.provider] }}
    >
      <div className={styles.header}>
        <span className={styles.provider} style={{ color: PROVIDER_COLOR[ride.provider] }}>
          {ride.provider.toUpperCase()}
        </span>
        {isCheapest && <span className={styles.badge}>CHEAPEST</span>}
        {ride.surge && (
          <span className={styles.surge}>⚡ {surgeLabel}</span>
        )}
      </div>

      <div className={styles.type}>{ride.type}</div>

      <div className={styles.pricing}>
        <span className={styles.price}>${ride.price_low}</span>
        <span className={styles.priceSep}>–</span>
        <span className={styles.priceHigh}>${ride.price_high}</span>
      </div>

      <div className={styles.meta}>
        {ride.eta_minutes != null && (
          <span className={styles.eta}>
            <span className={styles.metaLabel}>ETA</span> {ride.eta_minutes} min
          </span>
        )}
        <span className={styles.currency}>{ride.currency}</span>
      </div>

      {changed && <div className={styles.changedBar} />}
    </div>
  );
}
