import { Badge } from './ui'
import { useI18n } from '../i18n'

const tones = { en_cours: 'brand', generee: 'success', exportee: 'success' }

export default function StatusBadge({ statut }) {
  const { t } = useI18n()
  const key = tones[statut] ? statut : 'en_cours'
  return <Badge tone={tones[key]}>{t(`status.${key}`)}</Badge>
}

export function ScoreBar({ score = 0 }) {
  const value = Math.max(0, Math.min(100, Math.round(score || 0)))
  return (
    <div className="flex items-center gap-3 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold text-ink tabular-nums w-9 text-right">{value}%</span>
    </div>
  )
}
