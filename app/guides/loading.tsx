import g from "./page.module.css";
import s from "../states.module.css";

export default function Loading() {
  return (
    <>
      <div className={g.head}>
        <div className={g.wrap}>
          <div style={{ padding: "16px 0" }}>
            <div className={s.skel} style={{ width: 180, height: 14 }} />
          </div>
        </div>
        <div className={g.hero} style={{ background: "#EBF3FF" }}>
          <div className={g.wrap}>
            <div className={s.skel} style={{ width: 110, height: 26, borderRadius: 999, marginBottom: 18 }} />
            <div className={s.skel} style={{ width: 240, height: 44, maxWidth: "70%" }} />
            <div className={s.skel} style={{ width: 460, height: 18, marginTop: 14, maxWidth: "90%" }} />
          </div>
        </div>
        <div className={g.wrap}>
          <div style={{ display: "flex", gap: 8, padding: "16px 0" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div className={s.skel} key={i} style={{ width: 76, height: 32, borderRadius: 8 }} />
            ))}
          </div>
        </div>
      </div>
      <div className={g.wrap}>
        <div className={g.grid} style={{ marginTop: 40 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div className={g.card} key={i} style={{ cursor: "default" }}>
              <div className={`${g.thumb} ${s.skel}`} />
              <div className={g.cbody}>
                <div className={s.skel} style={{ height: 21, width: "90%" }} />
                <div className={s.skel} style={{ height: 14, width: "100%" }} />
                <div className={s.skel} style={{ height: 14, width: "65%" }} />
                <div className={s.skel} style={{ height: 22, width: 80, marginTop: 8, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
