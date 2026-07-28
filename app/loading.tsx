import s from "./states.module.css";

export default function Loading() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px" }}>
      <div className={s.skel} style={{ height: 280, borderRadius: 20 }} />
      <div className={s.skel} style={{ height: 32, width: 300, margin: "40px 0 24px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className={s.skel} style={{ height: 175, borderRadius: 12 }} />
            <div className={s.skel} style={{ height: 18, marginTop: 14, width: "90%" }} />
            <div className={s.skel} style={{ height: 14, marginTop: 10, width: "100%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
