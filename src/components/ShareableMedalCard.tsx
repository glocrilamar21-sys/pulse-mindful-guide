import { forwardRef } from "react";
import { Medal } from "@/components/games/Medal";
import type { MedalTier } from "@/lib/medals";

export interface ShareableEntry {
  key: string;
  title: string;
  detail: string | null;
  tier: MedalTier;
}

interface Props {
  entries: ShareableEntry[];
  earnedCount: number;
  totalCount: number;
  goldCount: number;
  /** Pre-translated lines / labels — kept locale-agnostic via props. */
  labels: {
    title: string;
    showcaseTitle: string;
    locked: string;
    goldsLine: string;
    totalLine: string;
    caption: string;
  };
}

/**
 * Off-screen 1080×1350 card used solely as a render target for html-to-image.
 * Uses inline styles to avoid Tailwind font-loading edge cases during canvas conversion.
 */
export const ShareableMedalCard = forwardRef<HTMLDivElement, Props>(
  ({ entries, earnedCount, totalCount, goldCount, labels }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1350,
          padding: 72,
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #6d28d9 50%, #be185d 100%)",
          color: "#ffffff",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          display: "flex",
          flexDirection: "column",
          gap: 36,
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Decorative blobs */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(255,255,255,0.2), transparent)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -250,
            left: -150,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(255,215,0,0.18), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 4,
              opacity: 0.85,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            🧠 Pulse
          </div>
          <h1
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 900,
              margin: 0,
              letterSpacing: -1.5,
            }}
          >
            {labels.title}
          </h1>
        </div>

        {/* Stats row */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: 24,
          }}
        >
          <StatBox value={earnedCount} suffix={`/ ${totalCount}`} label={labels.totalLine} />
          <StatBox value={goldCount} suffix="" label={labels.goldsLine} highlight />
        </div>

        {/* Medal list */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flex: 1,
          }}
        >
          {entries.map((e) => {
            const earned = e.tier !== null;
            return (
              <div
                key={e.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "20px 28px",
                  borderRadius: 24,
                  background: earned
                    ? "rgba(255,255,255,0.16)"
                    : "rgba(255,255,255,0.06)",
                  border: earned
                    ? "2px solid rgba(255,255,255,0.25)"
                    : "2px solid rgba(255,255,255,0.08)",
                  opacity: earned ? 1 : 0.55,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, flexShrink: 0 }}>
                  {earned ? (
                    <Medal tier={e.tier} size="lg" />
                  ) : (
                    <span style={{ fontSize: 36, opacity: 0.5 }} aria-hidden>
                      🔒
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      lineHeight: 1.1,
                      marginBottom: 4,
                    }}
                  >
                    {e.title}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      opacity: 0.8,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {e.detail ?? labels.locked}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Caption */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: 24,
            opacity: 0.85,
            fontWeight: 500,
            textAlign: "center",
            paddingTop: 12,
          }}
        >
          {labels.caption}
        </div>
      </div>
    );
  },
);

ShareableMedalCard.displayName = "ShareableMedalCard";

function StatBox({
  value,
  suffix,
  label,
  highlight,
}: {
  value: number;
  suffix: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px 28px",
        borderRadius: 24,
        background: highlight ? "rgba(255,215,0,0.18)" : "rgba(255,255,255,0.12)",
        border: highlight
          ? "2px solid rgba(255,215,0,0.4)"
          : "2px solid rgba(255,255,255,0.18)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{value}</span>
        {suffix && (
          <span style={{ fontSize: 28, fontWeight: 700, opacity: 0.7 }}>{suffix}</span>
        )}
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, opacity: 0.85, marginTop: 6 }}>
        {label}
      </div>
    </div>
  );
}
