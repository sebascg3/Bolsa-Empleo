import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
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

const routePaths = {
  home: '/home',
  search: '/search',
  login: '/login',
  dashboard: '/dashboard',
  'register-oferente': '/register-oferente',
  'register-empresa': '/register-empresa',
  empresa: '/empresa',
  oferente: '/oferente',
  admin: '/admin',
}

function getRoleHomePath(role) {
  if (role === 'ADMIN') return routePaths.admin
  if (role === 'EMPRESA') return routePaths.empresa
  if (role === 'OFERENTE') return routePaths.oferente
  return routePaths.dashboard
}

function toPath(target) {
  if (routePaths[target]) {
    return routePaths[target]
  }

  if (typeof target === 'string' && target.startsWith('/')) {
    return target
  }

  return `/${String(target).replace(/^#+/, '').replace(/^\//, '')}`
}

function LoadingState({ label }) {
  return (
    <section className="page-section">
      <p className="info-banner">{label}</p>
    </section>
  )
}

function RequireAuth({ token, isLoading, children }) {
  if (isLoading) {
    return <LoadingState label="Verificando sesión..." />
  }

  if (!token) {
    return <Navigate to={routePaths.login} replace />
  }

  return children
}

function RequireRole({ token, isLoading, user, roles, children }) {
  if (isLoading) {
    return <LoadingState label="Verificando permisos..." />
  }

  if (!token) {
    return <Navigate to={routePaths.login} replace />
  }

  if (!user) {
    return <LoadingState label="Cargando usuario..." />
  }

  if (!roles.includes(user.rol)) {
    return <Navigate to={getRoleHomePath(user.rol)} replace />
  }

  return children
}

function AppRouter() {
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [isLoadingSession, setIsLoadingSession] = useState(Boolean(getStoredToken()))

  const currentPath = useMemo(() => {
    const raw = location.pathname.replace(/\/+$/, '')
    return raw || '/'
  }, [location.pathname])

  useEffect(() => {
    let active = true

    async function syncUser() {
      if (!token) {
        clearStoredToken()
        if (active) {
          setUser(null)
          setIsLoadingSession(false)
        }
        return
      }

      if (active) {
        setIsLoadingSession(true)
      }

      try {
        const current = await requestJSON('/auth/me', { token })
        if (active) {
          setUser(current)
          setMessage('')
        }
      } catch (error) {
        clearStoredToken()
        if (active) {
          setToken('')
          setUser(null)
          setMessage(error instanceof Error ? error.message : 'La sesión expiró.')
          if (currentPath === routePaths.dashboard || currentPath === routePaths.empresa || currentPath === routePaths.oferente || currentPath === routePaths.admin) {
            navigate(routePaths.login, { replace: true })
          }
        }
      } finally {
        if (active) {
          setIsLoadingSession(false)
        }
      }
    }

    void syncUser()
    return () => {
      active = false
    }
  }, [currentPath, navigate, token])

  function goTo(target) {
    navigate(toPath(target))
  }

  function handleLoginSuccess(auth) {
    setStoredToken(auth.token)
    setToken(auth.token)
    setUser(auth.user)
    setMessage('Sesión iniciada correctamente.')
    goTo(getRoleHomePath(auth.user?.rol))
  }

  function handleLogout() {
    clearStoredToken()
    setToken('')
    setUser(null)
    setMessage('Sesión cerrada.')
    navigate(routePaths.home, { replace: true })
  }

  const topbarButtons = (
    <>
      <button type="button" onClick={() => goTo('home')}>Inicio</button>
      <button type="button" onClick={() => goTo('search')}>Buscar puestos</button>
      <button type="button" onClick={() => goTo('register-oferente')}>Registro oferente</button>
      <button type="button" onClick={() => goTo('register-empresa')}>Registro empresa</button>
      <button type="button" onClick={() => goTo('dashboard')}>Dashboard</button>
      {user?.rol === 'EMPRESA' ? <button type="button" onClick={() => goTo('empresa')}>Empresa</button> : null}
      {user?.rol === 'OFERENTE' ? <button type="button" onClick={() => goTo('oferente')}>Oferente</button> : null}
      {user?.rol === 'ADMIN' ? <button type="button" onClick={() => goTo('admin')}>Admin</button> : null}
      {token ? (
        <button type="button" className="nav-cta" onClick={handleLogout}>
          Salir
        </button>
      ) : (
        <button type="button" className="nav-cta" onClick={() => goTo('login')}>
          Entrar
        </button>
      )}
    </>
  )

  return (
    <main className="app-shell">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => goTo('home')}>
          Bolsa de Empleo
        </button>

        <nav className="topnav">{topbarButtons}</nav>
      </header>

      {message ? <p className="global-message">{message}</p> : null}

      <Routes>
        <Route path="/" element={<Navigate to={routePaths.home} replace />} />
        <Route path={routePaths.home} element={<HomeScreen onNavigate={goTo} token={token} />} />
        <Route path={routePaths.search} element={<SearchScreen token={token} />} />
        <Route path={routePaths['register-oferente']} element={<RegisterOferenteScreen onNavigate={goTo} />} />
        <Route path={routePaths['register-empresa']} element={<RegisterCompanyScreen onNavigate={goTo} />} />
        <Route path={routePaths.login} element={<LoginScreen onLoginSuccess={handleLoginSuccess} onNavigate={goTo} />} />
        <Route
          path={routePaths.dashboard}
          element={(
            <RequireAuth token={token} isLoading={isLoadingSession}>
              <DashboardScreen token={token} user={user} onNavigate={goTo} onLogout={handleLogout} />
            </RequireAuth>
          )}
        />
        <Route
          path={routePaths.empresa}
          element={(
            <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={[ 'EMPRESA' ]}>
              <CompanyScreen token={token} onNavigate={goTo} />
            </RequireRole>
          )}
        />
        <Route
          path={routePaths.oferente}
          element={(
            <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={[ 'OFERENTE' ]}>
              <OferenteScreen token={token} onNavigate={goTo} />
            </RequireRole>
          )}
        />
        <Route
          path={routePaths.admin}
          element={(
            <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={[ 'ADMIN' ]}>
              <AdminScreen token={token} onNavigate={goTo} />
            </RequireRole>
          )}
        />
        <Route path="*" element={<Navigate to={routePaths.home} replace />} />
      </Routes>
    </main>
  )
}

function App() {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  )
}

export default App
