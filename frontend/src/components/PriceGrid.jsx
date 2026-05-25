import RideCard from "./RideCard";
import styles from "./PriceGrid.module.css";

export default function PriceGrid({ uber, lyft, cheapest, changedTypes }) {
  const isChanged = (provider, type) =>
    changedTypes?.some(c => c.provider === provider && c.type === type);

  const isCheapest = (provider, type) =>
    cheapest?.provider === provider && cheapest?.type === type;

  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        <div className={styles.colHeader}>
          <span className={styles.dot} style={{ background: "var(--uber-dark)" }} />
          Uber
        </div>
        <div className={styles.rides}>
          {uber.length === 0
            ? <div className={styles.empty}>No results</div>
            : uber.map(r => (
                <RideCard
                  key={r.type}
                  ride={r}
                  isCheapest={isCheapest("uber", r.type)}
                  changed={isChanged("uber", r.type)}
                />
              ))
          }
        </div>
      </div>

      <div className={styles.sep} />

      <div className={styles.column}>
        <div className={styles.colHeader}>
          <span className={styles.dot} style={{ background: "var(--lyft-pink)" }} />
          Lyft
        </div>
        <div className={styles.rides}>
          {lyft.length === 0
            ? <div className={styles.empty}>No results</div>
            : lyft.map(r => (
                <RideCard
                  key={r.type}
                  ride={r}
                  isCheapest={isCheapest("lyft", r.type)}
                  changed={isChanged("lyft", r.type)}
                />
              ))
          }
        </div>
      </div>
    </div>
  );
}
