import { STAGE_COLORS } from '@/lib/constants';

export default function StageBadge({ stage }) {
  const colors = STAGE_COLORS[stage] || STAGE_COLORS['Applied'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {stage}
    </span>
  );
}
