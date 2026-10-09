import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './ui'

export default function PasswordInput({ id, value, onChange, autoComplete, t, ...props }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="pr-10"
        required
        {...props}
      />
      <button
        type="button"
        onClick={() => setShown(!shown)}
        aria-label={shown ? t('auth.hide') : t('auth.show')}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
      >
        {shown ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  )
}
