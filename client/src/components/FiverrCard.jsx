import React, { useEffect, useState } from "react";
import "./FiverrCard.css";

const STATS = [
  {
    key: "years",
    label: "YEARS FREELANCING",
    target: 3,
    suffix: "+",
    prefix: "",
  },
  { key: "level", label: "SELLER LEVEL", target: 2, suffix: "", prefix: "Lv" },
];

export default function FiverrCard({ yearsFreelancing = 3, sellerLevel = 2 }) {
  const [displayVals, setDisplayVals] = useState({ years: 0, level: 0 });

  useEffect(() => {
    const timers = [];
    const intervals = [];
    const duration = 1200;
    const steps = 32;

    setDisplayVals({ years: 0, level: 0 });

    STATS.forEach((stat, index) => {
      const timer = window.setTimeout(
        () => {
          let step = 0;
          const interval = window.setInterval(() => {
            step += 1;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3);
            const target =
              stat.key === "years" ? yearsFreelancing : sellerLevel;

            setDisplayVals((current) => ({
              ...current,
              [stat.key]: Math.round(eased * target),
            }));

            if (step >= steps) {
              window.clearInterval(interval);
            }
          }, duration / steps);

          intervals.push(interval);
        },
        index * 160 + 400,
      );

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      intervals.forEach((interval) => window.clearInterval(interval));
    };
  }, [sellerLevel, yearsFreelancing]);

  return (
    <article className="fiverr-card" aria-label="Fiverr seller card">
      <span className="fiverr-card__dot-grid" aria-hidden="true" />
      <span
        className="fiverr-card__orb fiverr-card__orb--top"
        aria-hidden="true"
      />
      <span
        className="fiverr-card__orb fiverr-card__orb--bottom"
        aria-hidden="true"
      />
      <span className="fiverr-card__border" aria-hidden="true" />

      <div className="fiverr-card__content">
        <header className="fiverr-card__header">
          <div className="fiverr-card__logo" aria-hidden="true">
            fiverr.
          </div>

          <div className="fiverr-card__header-copy">
            <div className="fiverr-card__badge-row">
              <span className="fv-sdot fv-sdot--small" aria-hidden="true" />
              <span className="fiverr-card__badge">FIVERR SELLER</span>
            </div>
            <h3 className="fiverr-card__title">Level {sellerLevel} Seller</h3>
          </div>
        </header>

        <section className="fiverr-card__stats" aria-label="Seller statistics">
          {STATS.map((stat) => (
            <div key={stat.key} className="fiverr-card__stat">
              <span className="fiverr-card__stat-label">{stat.label}</span>
              <span className="fiverr-card__stat-value" id={`sv-${stat.key}`}>
                {stat.prefix}
                {displayVals[stat.key]}
                {stat.suffix}
              </span>
            </div>
          ))}
        </section>
      </div>
    </article>
  );
}
