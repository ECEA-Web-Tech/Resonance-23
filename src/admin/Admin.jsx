import { useCallback, useEffect, useState } from "react";
import { AlertDialog, Dialog, Tabs } from "radix-ui";
import { toast, Toaster } from "sonner";
import { LoaderCircle, LogOut, Moon, Pencil, Plus, Sun, Trash2, X } from "lucide-react";
import { browserSessionPersistence, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, deleteDoc, doc, setDoc, writeBatch } from "firebase/firestore/lite";
import { app, db } from "../lib/firebase";
import { FALLBACK, load } from "../lib/data";
import { driveImg } from "../lib/drive";
import { useTheme } from "../lib/theme";
import { CATEGORIES } from "../data/events";
import { ROLE_ORDER } from "../data/credits";

const COLLECTIONS = [
  {
    id: "events",
    label: "Events",
    image: "poster",
    sub: (e) => CATEGORIES.find((c) => c.id === e.category)?.label,
    fields: [
      { k: "name", label: "Name", required: true },
      { k: "category", label: "Category", options: CATEGORIES.map((c) => [c.id, c.label]), required: true },
      { k: "tagline", label: "Tagline", hint: "Short line under the name, e.g. “Chess, in collaboration with Castle Red”" },
      { k: "description", label: "Description", textarea: true, required: true },
      { k: "poster", label: "Poster", url: true, hint: "Google Drive share link (anyone with the link) or an image URL" },
      { k: "register", label: "Registration link", url: true },
      { k: "venue", label: "Venue" },
      { k: "mode", label: "Mode", hint: "e.g. Online" },
      { k: "team", label: "Team size" },
      { k: "fee", label: "Entry fee" },
      { k: "date", label: "Date" },
      { k: "time", label: "Time" },
      { k: "pocs", label: "Contacts", pocs: true, hint: "One per line: Name, phone" },
    ],
  },
  {
    id: "credits",
    label: "Team",
    image: "photo",
    sub: (p) => p.role,
    fields: [
      { k: "name", label: "Name", required: true },
      { k: "role", label: "Role", options: ROLE_ORDER.map((r) => [r, r]), required: true },
      { k: "photo", label: "Photo", url: true, hint: "Google Drive share link (anyone with the link) or an image URL, 3:4" },
      { k: "linkedin", label: "LinkedIn URL", url: true },
    ],
  },
  {
    id: "sponsors",
    label: "Sponsors",
    image: "logo",
    sub: (s) => s.tier,
    fields: [
      { k: "name", label: "Name", required: true },
      { k: "tier", label: "Tier", hint: "Groups sponsors on the site, e.g. Title sponsor, Food partner. Leave empty for one group." },
      { k: "logo", label: "Logo", url: true, hint: "Google Drive share link or an image URL" },
      { k: "link", label: "Website", url: true },
    ],
  },
];

const input =
  "w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-gold";
const btn = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50";
const goldBtn = `${btn} bg-gold text-on-gold hover:bg-gold-hi`;
const ghostBtn = `${btn} border border-line hover:border-gold hover:text-gold`;

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "item";

const pocsToText = (pocs = []) => pocs.map((p) => `${p.name}, ${p.phone}`).join("\n");
const textToPocs = (t) =>
  t
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^(.*?)[\s,:–-]+([+\d][\d\s]{6,})$/);
      return m ? { name: m[1].trim(), phone: m[2].trim() } : { name: l, phone: "" };
    });

/* ---------- login ---------- */

function Login({ auth }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await auth.setPersistence(browserSessionPersistence);
      await signInWithEmailAndPassword(auth, f.get("email"), f.get("password"));
    } catch (err) {
      const wrong = ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-email"];
      setError(
        wrong.includes(err.code)
          ? "Email or password is incorrect."
          : err.code === "auth/too-many-requests"
            ? "Too many attempts. Wait a few minutes and try again."
            : `Sign-in failed (${err.code || err.message}). Check the Firebase config and that Email/Password sign-in is enabled.`
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-[100svh] place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[28px] border border-line bg-surface p-8 backdrop-blur-xl">
        <h1 className="gold-text font-display text-4xl">Mission control</h1>
        <p className="mt-2 text-sm text-muted">Sign in to manage events, team and sponsors.</p>
        <label className="mt-8 block text-sm font-medium">
          Email
          <input name="email" type="email" required autoComplete="username" className={`${input} mt-1.5`} />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Password
          <input name="password" type="password" required autoComplete="current-password" className={`${input} mt-1.5`} />
        </label>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}
        <button disabled={busy} className={`${goldBtn} mt-6 w-full`}>
          {busy && <LoaderCircle className="size-4 animate-spin" />}
          Sign in
        </button>
      </form>
    </main>
  );
}

/* ---------- editor ---------- */

function Editor({ col, item, nextOrder, onClose, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(item?.[col.image] || "");

  const save = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = { order: Number(f.get("order")) || 0 };
    for (const field of col.fields) {
      const v = String(f.get(field.k) ?? "").trim();
      if (!v) continue;
      if (field.url && !/^https:\/\/\S+$/.test(v)) {
        toast.error(`${field.label} must be a full https:// link.`);
        return;
      }
      data[field.k] = field.pocs ? textToPocs(v) : v;
    }
    setBusy(true);
    try {
      const id = item?.id || (col.id === "events" ? `${slug(data.name)}-${Date.now().toString(36).slice(-4)}` : undefined);
      const ref = id ? doc(db, col.id, id) : doc(collection(db, col.id));
      await setDoc(ref, data);
      toast.success(item ? "Changes saved" : `${data.name} added`);
      onSaved();
    } catch (err) {
      toast.error(err.code === "permission-denied" ? "This account isn't allowed to make changes." : `Couldn't save: ${err.message}`);
      setBusy(false);
    }
  };

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay fixed inset-0 z-50 bg-bg/75 backdrop-blur-sm" />
        <Dialog.Content className="sheet fixed inset-x-3 bottom-3 top-3 z-50 mx-auto max-w-2xl overflow-y-auto rounded-[24px] border border-line bg-surface-solid p-6 text-ink sm:top-10 sm:bottom-10">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-3xl">
              {item ? `Edit ${item.name}` : `Add to ${col.label.toLowerCase()}`}
            </Dialog.Title>
            <Dialog.Close className="grid size-9 place-items-center rounded-full border border-line" aria-label="Close">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Fill in the fields and save.</Dialog.Description>

          <form onSubmit={save} className="mt-6 space-y-4">
            {col.fields.map((field) => {
              const value = field.pocs ? pocsToText(item?.pocs) : item?.[field.k] ?? "";
              const common = { name: field.k, defaultValue: value, required: field.required, className: `${input} mt-1.5` };
              return (
                <label key={field.k} className="block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-gold"> *</span>}
                  {field.options ? (
                    <select {...common} defaultValue={value || field.options[0][0]}>
                      {field.options.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  ) : field.textarea || field.pocs ? (
                    <textarea {...common} rows={field.pocs ? 3 : 7} />
                  ) : (
                    <input
                      {...common}
                      type={field.url ? "url" : "text"}
                      placeholder={field.url ? "https://" : undefined}
                      onChange={field.k === col.image ? (e) => setPreview(e.target.value) : undefined}
                    />
                  )}
                  {field.hint && <span className="mt-1 block text-xs font-normal text-muted">{field.hint}</span>}
                  {field.k === col.image && preview && (
                    <img src={driveImg(preview, 300)} alt="Preview" className="mt-2 h-32 rounded-lg border border-line object-contain" />
                  )}
                </label>
              );
            })}
            <label className="block text-sm font-medium">
              Position
              <input name="order" type="number" defaultValue={item?.order ?? nextOrder} className={`${input} mt-1.5 max-w-32`} />
              <span className="mt-1 block text-xs font-normal text-muted">Lower numbers show first.</span>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close type="button" className={ghostBtn}>
                Cancel
              </Dialog.Close>
              <button disabled={busy} className={goldBtn}>
                {busy && <LoaderCircle className="size-4 animate-spin" />}
                {item ? "Save changes" : "Add"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ---------- one collection ---------- */

function Manager({ col }) {
  const [items, setItems] = useState();
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [importing, setImporting] = useState(false);

  const refresh = useCallback(
    () =>
      load(col.id, true)
        .then(setItems)
        .catch((err) => toast.error(`Couldn't load ${col.label.toLowerCase()}: ${err.message}`)),
    [col]
  );
  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (item) => {
    try {
      await deleteDoc(doc(db, col.id, item.id));
      toast.success(`${item.name} deleted`);
      refresh();
    } catch (err) {
      toast.error(`Couldn't delete: ${err.message}`);
    }
  };

  // One-time seed from the bundled docx/sheet data when the collection is empty.
  const importBundled = async () => {
    setImporting(true);
    try {
      const batch = writeBatch(db);
      FALLBACK[col.id].forEach(({ id, ...data }) => batch.set(doc(db, col.id, id), data));
      await batch.commit();
      toast.success(`Imported ${FALLBACK[col.id].length} ${col.label.toLowerCase()}`);
      refresh();
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  if (!items) return <LoaderCircle className="mx-auto mt-16 size-6 animate-spin text-gold" />;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {items.length} {items.length === 1 ? "entry" : "entries"}
          {col.id === "sponsors" && !items.length && ". The sponsors section stays hidden on the site until you add one."}
        </p>
        <button onClick={() => setEditing("new")} className={goldBtn}>
          <Plus className="size-4" /> Add
        </button>
      </div>

      {!items.length && FALLBACK[col.id].length > 0 && (
        <div className="mb-4 rounded-2xl border border-dashed border-gold/50 p-5 text-sm">
          <p>This collection is empty, so the site is showing nothing here.</p>
          <button onClick={importBundled} disabled={importing} className={`${ghostBtn} mt-3`}>
            {importing && <LoaderCircle className="size-4 animate-spin" />}
            Import {FALLBACK[col.id].length} {col.label.toLowerCase()} from the bundled data
          </button>
        </div>
      )}

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 p-3">
            <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-bg">
              {item[col.image] && (
                <img src={driveImg(item[col.image], 120)} alt="" loading="lazy" className="size-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.name}</p>
              <p className="truncate text-xs text-muted">
                #{item.order} {col.sub(item) && `· ${col.sub(item)}`}
              </p>
            </div>
            <button onClick={() => setEditing(item)} className="grid size-9 place-items-center rounded-full border border-line hover:border-gold" aria-label={`Edit ${item.name}`}>
              <Pencil className="size-4" />
            </button>
            <AlertDialog.Root>
              <AlertDialog.Trigger className="grid size-9 place-items-center rounded-full border border-line hover:border-red-500 hover:text-red-500" aria-label={`Delete ${item.name}`}>
                <Trash2 className="size-4" />
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="overlay fixed inset-0 z-50 bg-bg/75 backdrop-blur-sm" />
                <AlertDialog.Content className="sheet fixed left-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-line bg-surface-solid p-6 text-ink">
                  <AlertDialog.Title className="font-display text-2xl">Delete {item.name}?</AlertDialog.Title>
                  <AlertDialog.Description className="mt-2 text-sm text-muted">It disappears from the site straight away. This can’t be undone.</AlertDialog.Description>
                  <div className="mt-6 flex justify-end gap-2">
                    <AlertDialog.Cancel className={ghostBtn}>Keep</AlertDialog.Cancel>
                    <AlertDialog.Action onClick={() => remove(item)} className={`${btn} bg-red-600 text-white hover:bg-red-500`}>
                      Delete
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </li>
        ))}
      </ul>

      {editing && (
        <Editor
          col={col}
          item={editing === "new" ? null : editing}
          nextOrder={items.length ? Math.max(...items.map((i) => i.order ?? 0)) + 1 : 0}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </>
  );
}

/* ---------- page ---------- */

export default function Admin() {
  const [theme, toggleTheme] = useTheme();
  const auth = app && getAuth(app);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const meta = Object.assign(document.createElement("meta"), { name: "robots", content: "noindex, nofollow" });
    document.head.append(meta);
    document.title = "Mission control";
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (auth) return onAuthStateChanged(auth, setUser);
  }, [auth]);

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  let body;
  if (!app) {
    body = (
      <main className="mx-auto max-w-lg px-4 py-32">
        <h1 className="gold-text font-display text-4xl">Connect Firebase</h1>
        <p className="mt-4 text-muted">
          Add the VITE_FIREBASE_* values to <code>.env.local</code> and restart the dev server. The README has the steps.
        </p>
      </main>
    );
  } else if (user === undefined) {
    body = <LoaderCircle className="mx-auto mt-40 size-6 animate-spin text-gold" />;
  } else if (!user) {
    body = <Login auth={auth} />;
  } else {
    body = (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="gold-text font-display text-4xl">Mission control</h1>
            <p className="text-sm text-muted">Signed in as {user.email}</p>
          </div>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noreferrer" className={ghostBtn}>
              View site
            </a>
            <button onClick={() => signOut(auth)} className={ghostBtn}>
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </header>
        <Tabs.Root defaultValue="events">
          <Tabs.List className="mb-6 inline-flex gap-1 rounded-full border border-line bg-surface p-1">
            {COLLECTIONS.map((c) => (
              <Tabs.Trigger
                key={c.id}
                value={c.id}
                className="rounded-full px-5 py-2 text-sm font-medium text-muted data-[state=active]:bg-gold data-[state=active]:text-on-gold"
              >
                {c.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {COLLECTIONS.map((c) => (
            <Tabs.Content key={c.id} value={c.id} className="outline-none">
              <Manager col={c} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </main>
    );
  }

  return (
    <div className="min-h-[100svh] bg-bg">
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-40 grid size-11 place-items-center rounded-full border border-line bg-surface-solid text-gold"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <ThemeIcon className="size-[18px]" />
      </button>
      {body}
      <Toaster theme={theme} position="top-center" richColors />
    </div>
  );
}
