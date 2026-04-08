export default function BinderStrip() {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden select-none"
      style={{ height: "36px", background: "#161616" }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-[16px] px-4">
        {Array.from({ length: 26 }).map((_, index) => <BinderRing key={index} />)}
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg,rgba(255,255,255,0.08) 0%,transparent 50%,rgba(0,0,0,0.25) 100%)",
        }}
      />
    </div>
  );
}

function BinderRing() {
  return (
    <div className="flex flex-col items-center" style={{ width: "11px" }}>
      <div
        style={{
          width: "11px",
          height: "6px",
          borderRadius: "5px 5px 0 0",
          border: "2px solid #585858",
          borderBottom: "none",
          background: "linear-gradient(150deg,#909090 0%,#363636 100%)",
        }}
      />
      <div style={{ height: "3px" }} />
      <div
        style={{
          width: "11px",
          height: "6px",
          borderRadius: "0 0 5px 5px",
          border: "2px solid #585858",
          borderTop: "none",
          background: "linear-gradient(150deg,#363636 0%,#808080 100%)",
        }}
      />
    </div>
  );
}
