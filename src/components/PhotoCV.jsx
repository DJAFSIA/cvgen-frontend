import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2, UserRound } from 'lucide-react'
import { profilAPI, errorMessage } from '../services/api'
import { useI18n } from '../i18n'
import { Button } from './ui'

// Cadre d'une photo d'identite (35 x 45 mm) ; l'image envoyee est deux fois plus fine que le cadre final
const CADRE = { l: 189, h: 243 }
const SORTIE = { l: 826, h: 1062 }
const ZOOM_MAX = 3
const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const PAS = 8 // deplacement au clavier, en pixels du cadre

const borne = (v, min, max) => Math.min(max, Math.max(min, v))

/**
 * Photo facultative du CV : choix du fichier, recadrage (souris, doigt ou clavier), envoi, suppression.
 * Le recadrage se fait dans le navigateur ; le serveur reencode l'image et retire ses metadonnees.
 */
export default function PhotoCV({ aPhoto, onChange }) {
  const { t } = useI18n()
  const fichier = useRef(null)
  const glisse = useRef(null)
  const [apercu, setApercu] = useState('') // photo enregistree
  const [image, setImage] = useState(null) // image en cours de recadrage
  const [vue, setVue] = useState({ x: 0, y: 0, zoom: 1 })
  const [busy, setBusy] = useState('')
  const [erreur, setErreur] = useState('')

  // Photo enregistree, lue avec la session (jamais par une adresse publique)
  useEffect(() => {
    if (!aPhoto) return undefined
    let url = ''
    let actif = true
    profilAPI.photo()
      .then((res) => {
        if (!actif) return
        url = URL.createObjectURL(res.data)
        setApercu(url)
      })
      .catch(() => {})
    return () => {
      actif = false
      setApercu('')
      if (url) URL.revokeObjectURL(url)
    }
  }, [aPhoto])

  useEffect(() => () => image?.close?.(), [image])

  // Echelle de base : l'image couvre tout le cadre ; le deplacement ne decouvre jamais le fond
  const echelle = image ? Math.max(CADRE.l / image.width, CADRE.h / image.height) : 1
  const placer = useCallback((suivante) => {
    if (!image) return
    const zoom = borne(suivante.zoom, 1, ZOOM_MAX)
    const l = image.width * echelle * zoom
    const h = image.height * echelle * zoom
    setVue({ zoom, x: borne(suivante.x, (CADRE.l - l) / 2, (l - CADRE.l) / 2), y: borne(suivante.y, (CADRE.h - h) / 2, (h - CADRE.h) / 2) })
  }, [image, echelle])

  const choisir = async (e) => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    setErreur('')
    if (!TYPES.includes(f.type)) return setErreur(t('errors.photo_invalid'))
    try {
      const img = await createImageBitmap(f) // l'orientation de l'appareil est appliquee
      if (img.width < 200 || img.height < 250) {
        img.close()
        return setErreur(t('errors.photo_too_small'))
      }
      setImage(img)
      // cadre un peu au-dessus du centre : le visage y est le plus souvent
      const h = img.height * Math.max(CADRE.l / img.width, CADRE.h / img.height)
      setVue({ x: 0, y: borne((h - CADRE.h) * 0.1, 0, (h - CADRE.h) / 2), zoom: 1 })
    } catch {
      setErreur(t('errors.photo_invalid'))
    }
    return undefined
  }

  const dessiner = useCallback((canvas) => {
    if (!canvas || !image) return
    const k = canvas.width / CADRE.l
    const l = image.width * echelle * vue.zoom
    const h = image.height * echelle * vue.zoom
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(image, ((CADRE.l - l) / 2 + vue.x) * k, ((CADRE.h - h) / 2 + vue.y) * k, l * k, h * k)
  }, [image, echelle, vue])

  const enregistrer = async () => {
    setBusy('envoi')
    setErreur('')
    const canvas = document.createElement('canvas')
    canvas.width = SORTIE.l
    canvas.height = SORTIE.h
    dessiner(canvas)
    try {
      const blob = await new Promise((ok, ko) => canvas.toBlob((b) => (b ? ok(b) : ko(new Error('canvas'))), 'image/jpeg', 0.92))
      const donnees = new FormData()
      donnees.append('file', blob, 'photo.jpg')
      await profilAPI.envoyerPhoto(donnees)
      setImage(null)
      onChange(true)
      // nouvelle photo a la place d'une ancienne : l'apercu est relu
      if (aPhoto) {
        const res = await profilAPI.photo()
        setApercu(URL.createObjectURL(res.data))
      }
    } catch (err) {
      setErreur(errorMessage(err, t, 'profile.photoError'))
    } finally {
      setBusy('')
    }
  }

  const supprimer = async () => {
    setBusy('suppression')
    setErreur('')
    try {
      await profilAPI.supprimerPhoto()
      onChange(false)
    } catch (err) {
      setErreur(errorMessage(err, t, 'profile.photoError'))
    } finally {
      setBusy('')
    }
  }

  const clavier = (e) => {
    const d = { ArrowLeft: [-PAS, 0], ArrowRight: [PAS, 0], ArrowUp: [0, -PAS], ArrowDown: [0, PAS] }[e.key]
    if (!d) return
    e.preventDefault()
    placer({ ...vue, x: vue.x + d[0], y: vue.y + d[1] })
  }

  return (
    <div>
      <p className="text-[13px] font-medium text-ink mb-1.5">{t('profile.photo')}</p>
      <input type="file" ref={fichier} className="hidden" accept={TYPES.join(',')} onChange={choisir} aria-label={t('profile.photoChoose')} />

      {image ? (
        <div className="flex flex-wrap items-start gap-5">
          <div
            role="application"
            tabIndex={0}
            aria-label={t('profile.photoMove')}
            className="relative shrink-0 overflow-hidden rounded-lg border border-line cursor-grab active:cursor-grabbing touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            style={{ width: CADRE.l, height: CADRE.h }}
            onKeyDown={clavier}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              glisse.current = { px: e.clientX, py: e.clientY, x: vue.x, y: vue.y }
            }}
            onPointerMove={(e) => {
              const g = glisse.current
              if (g) placer({ ...vue, x: g.x + e.clientX - g.px, y: g.y + e.clientY - g.py })
            }}
            onPointerUp={() => { glisse.current = null }}
            onPointerCancel={() => { glisse.current = null }}
          >
            <canvas ref={dessiner} width={CADRE.l * 2} height={CADRE.h * 2} className="w-full h-full pointer-events-none" />
          </div>
          <div className="min-w-[200px] flex-1 space-y-4">
            <p className="text-sm text-body">{t('profile.photoHelp')}</p>
            <label className="block text-[13px] font-medium text-ink">
              {t('profile.photoZoom')}
              <input
                type="range" min="1" max={ZOOM_MAX} step="0.01" value={vue.zoom}
                onChange={(e) => placer({ ...vue, zoom: Number(e.target.value) })}
                className="mt-1.5 block w-full accent-brand"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={enregistrer} loading={busy === 'envoi'}>{t('profile.photoSave')}</Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setImage(null)} disabled={busy === 'envoi'}>{t('profile.photoCancel')}</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-5">
          <div className="grid place-items-center shrink-0 overflow-hidden rounded-lg border border-line bg-surface text-slate-400" style={{ width: 84, height: 108 }}>
            {aPhoto && apercu ? <img src={apercu} alt={t('profile.photoAlt')} className="w-full h-full object-cover" /> : <UserRound size={34} strokeWidth={1.4} aria-hidden="true" />}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => fichier.current.click()}>
              <ImagePlus size={15} aria-hidden="true" />{aPhoto ? t('profile.photoReplace') : t('profile.photoChoose')}
            </Button>
            {aPhoto && (
              <Button type="button" size="sm" variant="ghost" onClick={supprimer} loading={busy === 'suppression'}>
                <Trash2 size={15} aria-hidden="true" />{t('profile.photoDelete')}
              </Button>
            )}
          </div>
        </div>
      )}
      {erreur && <p role="alert" className="mt-2 text-sm text-danger">{erreur}</p>}
    </div>
  )
}
