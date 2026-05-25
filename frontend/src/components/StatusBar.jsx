import { useState, useEffect } from "react";
import styles from "./StatusBar.module.css";

export default function StatusBar({ watching, lastUpdated, cheapest, onStopWatch, tripId, onEndTrip }) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!lastUpdated) return;
    const update = () => {
      const secs = Math.floor((Date.now() - new Date(lastUpdated)) / 1000);
      if (secs < 60) setElapsed(`${secs}s ago`);
      else setElapsed(`${Math.floor(secs / 60)}m ago`);
    };
    update();
    const t = setInterval(update, 5000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        {watching
          ? <span className={styles.live}><span className={styles.dot} />LIVE</span>
          : <span className={styles.static}>SNAPSHOT</span>
        }
        {lastUpdated && <span className={styles.updated}>updated {elapsed}</span>}
      </div>

      {cheapest && (
        <div className={styles.cheapestBadge}>
          <span className={styles.cheapestLabel}>CHEAPEST</span>
          <span className={styles.cheapestValue}>
            {cheapest.provider.toUpperCase()} {cheapest.type} · ${cheapest.price}
          </span>
        </div>
      )}

      <div className={styles.actions}>
        {watching && (
          <button className={styles.stopBtn} onClick={onStopWatch}>Stop watch</button>
        )}
        {tripId && (
          <button className={styles.endBtn} onClick={onEndTrip}>End trip</button>
        )}
      </div>
    </div>
  );
}
