import { useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch, loading }) {
  const [pickup,  setPickup]  = useState("");
  const [dropoff, setDropoff] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (pickup.trim() && dropoff.trim()) onSearch(pickup.trim(), dropoff.trim());
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.inputs}>
        <div className={styles.field}>
          <span className={styles.label}>FROM</span>
          <input
            className={styles.input}
            value={pickup}
            onChange={e => setPickup(e.target.value)}
            placeholder="Pickup address…"
            disabled={loading}
          />
        </div>
        <div className={styles.divider} />
        <div className={styles.field}>
          <span className={styles.label}>TO</span>
          <input
            className={styles.input}
            value={dropoff}
            onChange={e => setDropoff(e.target.value)}
            placeholder="Dropoff address…"
            disabled={loading}
          />
        </div>
      </div>
      <button className={styles.btn} type="submit" disabled={loading || !pickup || !dropoff}>
        {loading ? <span className={styles.spinner} /> : "COMPARE"}
      </button>
    </form>
  );
}
