// MyTrackify brand glyph: one rising stroke from a start node to a reached
// milestone, echoing the apply→offer journey. Also doubles as the list-bullet
// motif so the same idea carries through logo, bullets, and illustrations.

interface TrackMarkProps {
  className?: string;
  /** Stroke weight of the track line. */
  strokeWidth?: number;
  /** Render the milestone/start nodes (off for very small bullet use if desired). */
  nodes?: boolean;
  title?: string;
}

export default function TrackMark({
  className = '',
  strokeWidth = 2,
  nodes = true,
  title,
}: TrackMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {/* Rising track — the journey */}
      <path
        d="M3.5 19C8 20 8.5 12.5 12.5 11S18 6.5 20.5 4.5"
        strokeWidth={strokeWidth}
      />
      {/* Start + milestone nodes */}
      {nodes ? (
        <>
          <circle cx="3.5" cy="19" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="20.5" cy="4.5" r="2.1" fill="currentColor" stroke="none" />
        </>
      ) : null}
    </svg>
  );
}
