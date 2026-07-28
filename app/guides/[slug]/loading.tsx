import d from "./page.module.css";
import s from "../../states.module.css";

export default function Loading() {
  return (
    <>
      <div className={d.artHead}>
        <div className={d.wrap}>
          <div className={s.skel} style={{ width: 90, height: 26, borderRadius: 999 }} />
          <div className={s.skel} style={{ width: "70%", height: 42, marginTop: 18 }} />
          <div className={s.skel} style={{ width: "45%", height: 42, marginTop: 10 }} />
          <div className={s.skel} style={{ width: 320, height: 18, marginTop: 24, maxWidth: "90%" }} />
        </div>
      </div>
      <div className={d.artHero}>
        <div className={d.wrap}>
          <div className={`${d.heroImg} ${s.skel}`} />
        </div>
      </div>
      <div className={d.wrap}>
        <div className={d.layout}>
          <div>
            <div className={s.skel} style={{ height: 28, width: "55%", margin: "0 0 24px" }} />
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                className={s.skel}
                key={i}
                style={{ height: 16, width: i % 3 === 2 ? "45%" : "100%", margin: "0 0 16px" }}
              />
            ))}
          </div>
          <div />
        </div>
      </div>
    </>
  );
}
