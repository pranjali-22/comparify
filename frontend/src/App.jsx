import { useState, useEffect, useRef, useCallback } from "react";
import { getSocket } from "./socket";
import { startTrip, cancelTrip, endTrip } from "./api";
import SearchBar  from "./components/SearchBar";
import PriceGrid  from "./components/PriceGrid";
import StatusBar  from "./components/StatusBar";
import ChangeLog  from "./components/ChangeLog";
import styles     from "./App.module.css";

export default function App() {
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);   // { uber, lyft, cheapest, pickup, dropoff, timestamp }
  const [watching,    setWatching]    = useState(false);
  const [changedTypes, setChangedTypes] = useState([]);
  const [events,      setEvents]      = useState([]);
  const [tripId,      setTripId]      = useState(null);
  const [error,       setError]       = useState(null);
  const socketRef = useRef(null);
  const routeRef  = useRef(null);

  const addEvent = useCallback((kind, desc) => {
    setEvents(prev => [...prev.slice(-49), { kind, desc, timestamp: new Date().toISOString() }]);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on("prices:initial", (data) => {
      setResult(data);
      setLoading(false);
      setWatching(true);
      setError(null);
    });

    socket.on("prices:changed", (data) => {
      setResult(prev => ({
        ...prev,
        uber:      data.uber,
        lyft:      data.lyft,
        cheapest:  data.cheapest,
        timestamp: data.timestamp,
      }));
      setChangedTypes(data.changes);

      data.changes.forEach(c => {
        if (c.current.price_low < c.previous.price_low) {
          addEvent("price_drop",
            `${c.provider.toUpperCase()} ${c.type}: $${c.previous.price_low} → $${c.current.price_low}`);
        }
        if (c.current.surge && !c.previous.surge) {
          addEvent("surge_started", `${c.provider.toUpperCase()} ${c.type} surge active`);
        }
        if (!c.current.surge && c.previous.surge) {
          addEvent("surge_ended", `${c.provider.toUpperCase()} ${c.type} surge ended`);
        }
      });

      if (data.cheapestChanged && data.cheapest) {
        addEvent("cheapest_changed",
          `${data.cheapest.provider.toUpperCase()} ${data.cheapest.type} @ $${data.cheapest.price}`);
      }

      setTimeout(() => setChangedTypes([]), 3500);
    });

    socket.on("prices:heartbeat", (data) => {
      setResult(prev => prev ? { ...prev, timestamp: data.timestamp } : prev);
    });

    socket.on("prices:stopped", () => setWatching(false));
    socket.on("error", (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => {
      socket.off("prices:initial");
      socket.off("prices:changed");
      socket.off("prices:heartbeat");
      socket.off("prices:stopped");
      socket.off("error");
    };
  }, [addEvent]);

  const handleSearch = async (pickup, dropoff) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setEvents([]);
    setChangedTypes([]);
    routeRef.current = { pickup, dropoff };

    // Stop any existing watch
    if (watching) socketRef.current.emit("watch:stop");
    if (tripId) { await cancelTrip(tripId).catch(() => {}); setTripId(null); }

    // Start a trip watch and socket watch
    try {
      const trip = await startTrip({ pickup, dropoff, socketId: socketRef.current.id });
      setTripId(trip.tripId);
    } catch { /* optional */ }

    socketRef.current.emit("watch:prices", { pickup, dropoff });
  };

  const handleStopWatch = () => {
    socketRef.current.emit("watch:stop");
    setWatching(false);
  };

  const handleEndTrip = async () => {
    if (!tripId) return;
    await endTrip(tripId).catch(() => {});
    setTripId(null);
    handleStopWatch();
    addEvent("trip_ended", `Stopped watching ${routeRef.current?.pickup} → ${routeRef.current?.dropoff}`);
  };

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>RW</span>
          <div className={styles.logoText}>
            <span className={styles.logoName}>RideWatch</span>
            <span className={styles.logoSub}>live price monitor</span>
          </div>
        </div>
        <div className={styles.headerMeta}>
          Updates every <span className={styles.highlight}>30s</span>
        </div>
      </header>

      <main className={styles.main}>
        {/* Search */}
        <section className={styles.searchSection}>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </section>

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        {/* Loading skeleton */}
        {loading && !result && (
          <div className={styles.skeleton}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeletonCard} style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className={styles.results}>
            <div className={styles.routeHeader}>
              <span className={styles.routeLabel}>{result.pickup}</span>
              <span className={styles.routeArrow}>→</span>
              <span className={styles.routeLabel}>{result.dropoff}</span>
            </div>

            <StatusBar
              watching={watching}
              lastUpdated={result.timestamp}
              cheapest={result.cheapest}
              tripId={tripId}
              onStopWatch={handleStopWatch}
              onEndTrip={handleEndTrip}
            />

            <PriceGrid
              uber={result.uber}
              lyft={result.lyft}
              cheapest={result.cheapest}
              changedTypes={changedTypes}
            />

            {events.length > 0 && <ChangeLog events={events} />}
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div className={styles.empty}>
            <div className={styles.emptyGrid}>
              {[...Array(6)].map((_, i) => <div key={i} className={styles.emptyCell} />)}
            </div>
            <p className={styles.emptyText}>Enter a pickup and dropoff to compare<br/>Uber and Lyft prices in real time</p>
          </div>
        )}
      </main>
    </div>
  );
}
