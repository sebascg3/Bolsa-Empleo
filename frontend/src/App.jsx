import { useEffect, useRef, useState } from 'react'
import './App.css'
import HomeScreen from './screens/HomeScreen'
import SearchScreen from './screens/SearchScreen'
import LoginScreen from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import RegisterOferenteScreen from './screens/RegisterOferenteScreen'
import RegisterCompanyScreen from './screens/RegisterCompanyScreen'
import CompanyScreen from './screens/CompanyScreen'
import OferenteScreen from './screens/OferenteScreen'
import AdminScreen from './screens/AdminScreen'
import { clearStoredToken, getStoredToken, requestJSON, setStoredToken } from './lib/api'

const validScreens = new Set([
  'home',
  'search',
  'login',
  'dashboard',
  'register-oferente',
  'register-empresa',
  'empresa',
  'oferente',
  'admin',
])

function getScreenFromHash() {
  const raw = window.location.hash.replace('#', '').trim()
  return validScreens.has(raw) ? raw : 'home'
}

function App() {
  const [screen, setScreen] = useState(getScreenFromHash)
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const screenRef = useRef(screen)

  useEffect(() => {
    screenRef.current = screen
  }, [screen])

  useEffect(() => {
    const onHashChange = () => setScreen(getScreenFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    async function syncUser() {
      if (!token) {
        setUser(null)
        clearStoredToken()
        return
      }

      try {
        const current = await requestJSON('/auth/me', { token })
        setUser(current)
      } catch (error) {
        clearStoredToken()
        setToken('')
        setUser(null)
        setMessage(error instanceof Error ? error.message : 'La sesión expiró.')
        if (screenRef.current === 'dashboard') {
          window.location.hash = '#login'
        }
      }
    }

    void syncUser()
  }, [token])

  function navigate(nextScreen) {
    window.location.hash = `#${nextScreen}`
    setScreen(nextScreen)
  }

  function handleLoginSuccess(auth) {
    setStoredToken(auth.token)
    setToken(auth.token)
    setUser(auth.user)
    setMessage('Sesión iniciada correctamente.')
    if (auth.user?.rol === 'ADMIN') {
      navigate('admin')
    } else if (auth.user?.rol === 'EMPRESA') {
      navigate('empresa')
    } else if (auth.user?.rol === 'OFERENTE') {
      navigate('oferente')
    } else {
      navigate('dashboard')
    }
  }

  function handleLogout() {
    clearStoredToken()
    setToken('')
    setUser(null)
    setMessage('Sesión cerrada.')
    navigate('home')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('home')}>
          Bolsa de Empleo
        </button>

        <nav className="topnav">
          <button onClick={() => navigate('home')}>Inicio</button>
          <button onClick={() => navigate('search')}>Buscar puestos</button>
          <button onClick={() => navigate('register-oferente')}>Registro oferente</button>
          <button onClick={() => navigate('register-empresa')}>Registro empresa</button>
          <button onClick={() => navigate('dashboard')}>Dashboard</button>
          {user?.rol === 'EMPRESA' ? <button onClick={() => navigate('empresa')}>Empresa</button> : null}
          {user?.rol === 'OFERENTE' ? <button onClick={() => navigate('oferente')}>Oferente</button> : null}
          {user?.rol === 'ADMIN' ? <button onClick={() => navigate('admin')}>Admin</button> : null}
          {token ? (
            <button className="nav-cta" onClick={handleLogout}>
              Salir
            </button>
          ) : (
            <button className="nav-cta" onClick={() => navigate('login')}>
              Entrar
            </button>
          )}
        </nav>
      </header>

      {message ? <p className="global-message">{message}</p> : null}

      {screen === 'home' ? <HomeScreen onNavigate={navigate} token={token} /> : null}
      {screen === 'search' ? <SearchScreen token={token} /> : null}
      {screen === 'register-oferente' ? <RegisterOferenteScreen onNavigate={navigate} /> : null}
      {screen === 'register-empresa' ? <RegisterCompanyScreen onNavigate={navigate} /> : null}
      {screen === 'login' ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />
      ) : null}
      {screen === 'dashboard' ? (
        <DashboardScreen token={token} user={user} onNavigate={navigate} onLogout={handleLogout} />
      ) : null}
      {screen === 'empresa' ? <CompanyScreen token={token} onNavigate={navigate} /> : null}
      {screen === 'oferente' ? <OferenteScreen token={token} onNavigate={navigate} /> : null}
      {screen === 'admin' ? <AdminScreen token={token} onNavigate={navigate} /> : null}
    </main>
  )
}

export default App
