import { useEffect, useState } from "react";

interface Entry {
  file: string;
  number: string;
  title: string;
  lede: string;
}
interface Index {
  lessons: Entry[];
  reference: Entry[];
}

const base = import.meta.env.BASE_URL;

export function Learn() {
  const [index, setIndex] = useState<Index | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${base}learn/index.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Index) => setIndex(data))
      .catch(() => setFailed(true));
  }, []);

  const card = (e: Entry, kind: string) => (
    <a className="card" key={e.file} href={`${base}learn/${e.file}`} target="_blank" rel="noreferrer">
      <div className="kicker">{e.number ? `${kind} ${e.number}` : kind}</div>
      <h3>{e.title}</h3>
      {e.lede && <p>{e.lede}</p>}
    </a>
  );

  return (
    <div className="learn">
      <h1>Learn capacity modeling</h1>
      <p className="lead">
        Short, interactive lessons on the ideas behind this tool — utilisation bands, coupled vs
        fungible capacity, additive vs subtractive modes, and the traps in rolling up intensities.
      </p>

      {failed && (
        <p className="empty">
          Lessons load from <code>learn/index.json</code>, generated at build time by{" "}
          <code>npm run sync:learn</code>. Run a build (or <code>pnpm dev</code>) to populate them.
        </p>
      )}

      {index && index.lessons.length > 0 && (
        <>
          <div className="cards">{index.lessons.map((e) => card(e, "Lesson"))}</div>
        </>
      )}

      {index && index.reference.length > 0 && (
        <>
          <h1 style={{ fontSize: 18, marginTop: 32 }}>Reference sheets</h1>
          <div className="cards">{index.reference.map((e) => card(e, "Reference"))}</div>
        </>
      )}
    </div>
  );
}
