import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, inscription } = useAuth()
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({ email: '', mot_de_passe: '' })
  const [registerData, setRegisterData] = useState({
    nom: '', prenom: '', email: '', mot_de_passe: '', confirm_passe: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(loginData.email, loginData.mot_de_passe)
      navigate('/dashboard')
    } catch {
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (registerData.mot_de_passe !== registerData.confirm_passe) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { confirm_passe, ...data } = registerData
      await inscription(data)
      navigate('/dashboard')
    } catch {
      setError("Erreur lors de l'inscription. Email déjà utilisé ?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">

      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0px) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(20px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
        @keyframes floatCard { 0%,100%{transform:translateY(0px);opacity:0.6} 50%{transform:translateY(-14px);opacity:1} }
      `}</style>

      {/* Fond animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{position:'absolute',bottom:0,left:'50%',width:'200%',height:'55%',backgroundImage:'linear-gradient(rgba(127,119,221,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(127,119,221,0.12) 1px,transparent 1px)',backgroundSize:'60px 60px',transform:'translateX(-50%) perspective(500px) rotateX(60deg)',transformOrigin:'bottom center',maskImage:'linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 100%)',WebkitMaskImage:'linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 100%)'}}/>
        <div style={{position:'absolute',top:'10%',left:'15%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(83,74,183,0.25) 0%,transparent 70%)',animation:'float1 8s ease-in-out infinite'}}/>
        <div style={{position:'absolute',top:'20%',right:'10%',width:250,height:250,borderRadius:'50%',background:'radial-gradient(circle,rgba(127,119,221,0.2) 0%,transparent 70%)',animation:'float2 10s ease-in-out infinite'}}/>
        <div style={{position:'absolute',bottom:'20%',left:'8%',width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(29,158,117,0.15) 0%,transparent 70%)',animation:'float3 12s ease-in-out infinite'}}/>
        {[{top:'12%',left:'6%',rot:'-15deg',delay:'0s'},{top:'35%',right:'5%',rot:'10deg',delay:'2s'},{top:'62%',left:'4%',rot:'-8deg',delay:'4s'},{top:'72%',right:'7%',rot:'15deg',delay:'1s'}].map((p,i)=>(
          <div key={i} style={{position:'absolute',top:p.top,left:p.left,right:p.right,width:65,height:85,background:'rgba(255,255,255,0.03)',border:'0.5px solid rgba(127,119,221,0.3)',borderRadius:8,transform:`rotate(${p.rot})`,animation:`floatCard 6s ease-in-out infinite`,animationDelay:p.delay,padding:8,display:'flex',flexDirection:'column',gap:5}}>
            <div style={{width:'60%',height:4,background:'rgba(127,119,221,0.5)',borderRadius:2}}/>
            <div style={{width:'90%',height:3,background:'rgba(255,255,255,0.1)',borderRadius:2}}/>
            <div style={{width:'80%',height:3,background:'rgba(255,255,255,0.1)',borderRadius:2}}/>
            <div style={{width:'70%',height:3,background:'rgba(255,255,255,0.08)',borderRadius:2}}/>
            <div style={{width:'85%',height:3,background:'rgba(255,255,255,0.06)',borderRadius:2}}/>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">CV<span className="text-primary-light">Gen</span></h1>
          <p className="text-gray-400 mt-2 text-sm">Plateforme intelligente de candidature</p>
        </div>

        <div style={{background:'rgba(255,255,255,0.05)',backdropFilter:'blur(20px)',border:'0.5px solid rgba(255,255,255,0.12)',borderRadius:20,padding:32}}>
          <div className="flex mb-6 bg-white/5 rounded-xl p-1">
            <button onClick={()=>{setTab('login');setError('')}} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab==='login'?'bg-primary text-white':'text-gray-400 hover:text-white'}`}>Connexion</button>
            <button onClick={()=>{setTab('register');setError('')}} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab==='register'?'bg-primary text-white':'text-gray-400 hover:text-white'}`}>Inscription</button>
          </div>

          {error && <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Adresse email</label>
                <input type="email" placeholder="exemple@email.com" value={loginData.email} onChange={e=>setLoginData({...loginData,email:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-light" required/>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Mot de passe</label>
                <input type="password" placeholder="••••••••" value={loginData.mot_de_passe} onChange={e=>setLoginData({...loginData,mot_de_passe:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-light" required/>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50">{loading?'Connexion...':'Se connecter'}</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Prénom</label>
                  <input type="text" placeholder="Jean" value={registerData.prenom} onChange={e=>setRegisterData({...registerData,prenom:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-light" required/>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Nom</label>
                  <input type="text" placeholder="Dupont" value={registerData.nom} onChange={e=>setRegisterData({...registerData,nom:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-light" required/>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Adresse email</label>
                <input type="email" placeholder="jean@email.com" value={registerData.email} onChange={e=>setRegisterData({...registerData,email:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-light" required/>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Mot de passe</label>
                <input type="password" placeholder="••••••••" value={registerData.mot_de_passe} onChange={e=>setRegisterData({...registerData,mot_de_passe:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-light" required/>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Confirmer le mot de passe</label>
                <input type="password" placeholder="••••••••" value={registerData.confirm_passe} onChange={e=>setRegisterData({...registerData,confirm_passe:e.target.value})}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors ${
                    registerData.confirm_passe && registerData.mot_de_passe !== registerData.confirm_passe ? 'border-red-500/50' :
                    registerData.confirm_passe && registerData.mot_de_passe === registerData.confirm_passe ? 'border-green-500/50' : 'border-white/10 focus:border-primary-light'
                  }`} required/>
                {registerData.confirm_passe && registerData.mot_de_passe !== registerData.confirm_passe && <p className="text-red-400 text-xs mt-1">Les mots de passe ne correspondent pas</p>}
                {registerData.confirm_passe && registerData.mot_de_passe === registerData.confirm_passe && <p className="text-green-400 text-xs mt-1">✓ Les mots de passe correspondent</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50">{loading?'Création...':'Créer mon compte'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}