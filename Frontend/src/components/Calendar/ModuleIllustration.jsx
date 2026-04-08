import { MODULES } from "../../data";

export default function ModuleIllustration({ module }) {
  const color = MODULES[module]?.primaryColor ?? "#fff";
  const style = { filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.5))" };

  if (module === "dsa") {
    return (
      <svg width="78" height="62" viewBox="0 0 86 68" aria-hidden="true" style={style}>
        <line x1="43" y1="9" x2="19" y2="34" stroke={color} strokeWidth="1.5" strokeOpacity=".7" />
        <line x1="43" y1="9" x2="67" y2="34" stroke={color} strokeWidth="1.5" strokeOpacity=".7" />
        <line x1="19" y1="34" x2="9" y2="57" stroke={color} strokeWidth="1.2" strokeOpacity=".5" />
        <line x1="19" y1="34" x2="31" y2="57" stroke={color} strokeWidth="1.2" strokeOpacity=".5" />
        <line x1="67" y1="34" x2="55" y2="57" stroke={color} strokeWidth="1.2" strokeOpacity=".5" />
        <line x1="67" y1="34" x2="77" y2="57" stroke={color} strokeWidth="1.2" strokeOpacity=".5" />
        {[
          { cx: 43, cy: 9, r: 8 },
          { cx: 19, cy: 34, r: 6 },
          { cx: 67, cy: 34, r: 6 },
          { cx: 9, cy: 57, r: 5 },
          { cx: 31, cy: 57, r: 5 },
          { cx: 55, cy: 57, r: 5 },
          { cx: 77, cy: 57, r: 5 },
        ].map((node, index) => (
          <circle
            key={index}
            {...node}
            fill={color}
            fillOpacity={index === 0 ? 0.38 : 0.18}
            stroke={color}
            strokeWidth="1.3"
            strokeOpacity=".85"
          />
        ))}
      </svg>
    );
  }

  if (module === "lld") {
    return (
      <svg width="78" height="62" viewBox="0 0 86 68" aria-hidden="true" style={style}>
        <rect x="3" y="3" width="33" height="25" rx="3" fill={color} fillOpacity=".18" stroke={color} strokeWidth="1.2" strokeOpacity=".75" />
        <rect x="50" y="3" width="33" height="25" rx="3" fill={color} fillOpacity=".18" stroke={color} strokeWidth="1.2" strokeOpacity=".75" />
        <rect x="26" y="40" width="34" height="24" rx="3" fill={color} fillOpacity=".28" stroke={color} strokeWidth="1.5" strokeOpacity=".9" />
        <line x1="20" y1="28" x2="20" y2="40" stroke={color} strokeWidth="1" strokeOpacity=".45" strokeDasharray="3 2" />
        <line x1="66" y1="28" x2="66" y2="40" stroke={color} strokeWidth="1" strokeOpacity=".45" strokeDasharray="3 2" />
      </svg>
    );
  }

  return (
    <svg width="78" height="62" viewBox="0 0 86 68" aria-hidden="true" style={style}>
      <ellipse cx="43" cy="12" rx="29" ry="9" fill={color} fillOpacity=".22" stroke={color} strokeWidth="1.3" strokeOpacity=".8" />
      <rect x="14" y="12" width="58" height="20" fill={color} fillOpacity=".12" stroke={color} strokeWidth=".9" strokeOpacity=".45" />
      <ellipse cx="43" cy="32" rx="29" ry="9" fill={color} fillOpacity=".22" stroke={color} strokeWidth="1.3" strokeOpacity=".8" />
      <rect x="14" y="32" width="58" height="14" fill={color} fillOpacity=".08" stroke={color} strokeWidth=".7" strokeOpacity=".3" />
      <ellipse cx="43" cy="46" rx="29" ry="9" fill={color} fillOpacity=".28" stroke={color} strokeWidth="1.3" strokeOpacity=".8" />
    </svg>
  );
}
