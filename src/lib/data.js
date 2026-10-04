import { useEffect, useState } from "react";
import events from "../data/events";
import credits from "../data/credits";

export const FALLBACK = {
  events,
  credits,
  sponsors: [
    {
      id: "news7-tamil",
      name: "News7 Tamil",
      logo: "https://images.seeklogo.com/logo-png/32/1/news-7-tamil-logo-png_seeklogo-323695.png?v=1962744071487269352",
      tier: "Media Partner",
      order: 1,
    },
    {
      id: "studyin",
      name: "StudyIn",
      logo: "https://tse1.mm.bing.net/th/id/OIP.7tqr40D-YgmjDNMVwDcbbgAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      tier: "Knowledge Partner",
      order: 2,
    },
    {
      id: "ieee-madras",
      name: "IEEE Madras Section",
      logo: "https://tse3.mm.bing.net/th/id/OIP.0muAzfOxE4vV-GoDJj2BUAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      tier: "Technical Partner",
      order: 3,
    },
  ],
};
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
