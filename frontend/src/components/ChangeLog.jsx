import styles from "./ChangeLog.module.css";

const icons = {
  price_drop:       "↓",
  surge_started:    "⚡",
  surge_ended:      "✓",
  cheapest_changed: "★",
};

const labels = {
  price_drop:       "Price drop",
  surge_started:    "Surge started",
  surge_ended:      "Surge ended",
  cheapest_changed: "Cheapest changed",
};

export default function ChangeLog({ events }) {
  if (!events.length) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>EVENT LOG</div>
      <div className={styles.list}>
        {[...events].reverse().map((ev, i) => (
          <div key={i} className={`${styles.event} ${styles[ev.kind] || ""}`}>
            <span className={styles.icon}>{icons[ev.kind] || "·"}</span>
            <div className={styles.body}>
              <span className={styles.eventLabel}>{labels[ev.kind] || ev.kind}</span>
              <span className={styles.desc}>{ev.desc}</span>
            </div>
            <span className={styles.time}>
              {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
