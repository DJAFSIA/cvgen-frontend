import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

const buttonStyles = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-sm',
  secondary: 'bg-white text-ink border border-line hover:bg-surface shadow-sm',
  ghost: 'text-ink hover:bg-surface',
  dark: 'bg-ink text-white hover:bg-[#13365c]',
}
const buttonSizes = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

export function Button({ variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${buttonStyles[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white border border-line rounded-xl2 shadow-card ${className}`} {...props}>
      {children}
    </div>
  )
}

const fieldClasses =
  'w-full bg-white border border-line rounded-md px-3 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition'

export function Field({ label, hint, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-ink mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted mt-1.5">{hint}</p>}
    </div>
  )
}

export function Input({ className = '', ...props }) {
  return <input className={`${fieldClasses} h-10 ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`${fieldClasses} py-2.5 resize-y ${className}`} {...props} />
}

const alertStyles = {
  error: { box: 'bg-danger-soft text-danger border-danger/20', Icon: AlertCircle },
  success: { box: 'bg-success-soft text-success border-success/20', Icon: CheckCircle2 },
  warn: { box: 'bg-warn-soft text-warn border-warn/20', Icon: AlertCircle },
}

export function Alert({ tone = 'error', title, children, action }) {
  const { box, Icon } = alertStyles[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 border rounded-lg px-4 py-3 text-sm ${box}`}>
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <p className={title ? 'mt-0.5 opacity-90' : ''}>{children}</p>}
      </div>
      {action}
    </div>
  )
}

export function Badge({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'bg-surface text-body border-line',
    brand: 'bg-brand-soft text-brand-dark border-brand/20',
    success: 'bg-success-soft text-success border-success/20',
    warn: 'bg-warn-soft text-warn border-warn/20',
  }
  return <span className={`inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export function Spinner({ label }) {
  return (
    <div className="flex items-center justify-center gap-2 text-muted text-sm py-10" role="status">
      <Loader2 size={18} className="animate-spin" aria-hidden="true" /> {label}
    </div>
  )
}
