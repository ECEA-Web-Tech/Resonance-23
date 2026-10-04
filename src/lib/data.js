import { useEffect, useState } from "react";
import events from "../data/events";
import credits from "../data/credits";

export const FALLBACK = { events, credits, sponsors: [] };
const cache = {};

export async function load(name, fresh = false) {
  if (cache[name] && !fresh) return cache[name];
  if (!import.meta.env.VITE_FIREBASE_API_KEY) return (cache[name] = FALLBACK[name]);
  try {
    // Loaded on demand so Firebase stays out of the first paint.
    const [{ db }, { collection, getDocs, orderBy, query }] = await Promise.all([
      import("./firebase"),
      import("firebase/firestore/lite"),
    ]);
    const snap = await getDocs(query(collection(db, name), orderBy("order")));
    return (cache[name] = snap.docs.map((d) => ({ ...d.data(), id: d.id })));
  } catch (err) {
    if (fresh) throw err; // admin wants the real state, not the fallback
    console.warn(`Couldn't load ${name} from Firestore, showing bundled data`, err);
    return FALLBACK[name];
  }
}

/** undefined while loading, then an array. */
export function useCollection(name) {
  const [items, setItems] = useState(cache[name]);
  useEffect(() => {
    let live = true;
    load(name).then((v) => live && setItems(v));
    return () => (live = false);
  }, [name]);
  return items;
}
