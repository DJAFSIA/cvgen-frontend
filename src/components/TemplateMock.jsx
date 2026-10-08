/** Miniature schematique d'un modele de CV (classique, moderne, ats). */
export default function TemplateMock({ kind }) {
  const bar = (w) => <div className="h-1.5 rounded bg-slate-200" style={{ width: w }} />
  return (
    <div className="bg-white border border-line rounded-lg shadow-card overflow-hidden aspect-[3/4] w-full" aria-hidden="true">
      {kind === 'moderne' && (
        <div className="h-[22%] bg-[#243b53] p-3 space-y-1.5">
          <div className="h-2.5 w-1/2 rounded bg-white/90" />
          <div className="h-1.5 w-1/3 rounded bg-white/50" />
        </div>
      )}
      <div className="p-3 space-y-2.5">
        {kind === 'classique' && (
          <div className="text-center space-y-1.5 pb-2 border-b-2 border-ink">
            <div className="h-2.5 w-1/2 mx-auto rounded bg-ink" />
            {bar('35%')}
          </div>
        )}
        {kind === 'ats' && (
          <div className="space-y-1.5">
            <div className="h-2.5 w-1/2 rounded bg-black" />
            {bar('45%')}
          </div>
        )}
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className={`h-1.5 w-1/3 rounded ${kind === 'moderne' ? 'bg-brand' : 'bg-ink'}`} />
            {bar('95%')}
            {bar('88%')}
            {kind === 'moderne' && i === 2 && (
              <div className="flex gap-1 pt-1">
                {[0, 1, 2].map((j) => <span key={j} className="h-3 w-8 rounded-full bg-brand-soft" />)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
