import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { HashRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import SearchScreen from './screens/SearchScreen.jsx'
import DashboardScreen from './screens/DashboardScreen.jsx'
import RegisterOferenteScreen from './screens/RegisterOferenteScreen.jsx'
import RegisterCompanyScreen from './screens/RegisterCompanyScreen.jsx'
import CompanyScreen from './screens/CompanyScreen.jsx'
import CompanyJobsScreen from './screens/CompanyJobsScreen.jsx'
import CompanyCandidatesScreen from './screens/CompanyCandidatesScreen.jsx'
import CompanyCandidateProfileScreen from './screens/CompanyCandidateProfileScreen.jsx'
import CompanyPublishScreen from './screens/CompanyPublishScreen.jsx'
import OferenteScreen from './screens/OferenteScreen.jsx'
import OferenteSkillsScreen from './screens/OferenteSkillsScreen.jsx'
import OferenteCvScreen from './screens/OferenteCvScreen.jsx'
import OferentePhotoScreen from './screens/OferentePhotoScreen.jsx'
import AdminScreen from './screens/AdminScreen.jsx'
import AdminCompaniesScreen from './screens/AdminCompaniesScreen.jsx'
import AdminApplicantsScreen from './screens/AdminApplicantsScreen.jsx'
import AdminCharacteristicsScreen from './screens/AdminCharacteristicsScreen.jsx'
import AdminReportsScreen from './screens/AdminReportsScreen.jsx'
import { clearStoredToken, getStoredToken, requestJSON, setStoredToken } from './lib/api.js'
import LoginModal from './components/LoginModal.jsx'

const routePaths = {
  home: '/home',
  search: '/search',
  dashboard: '/dashboard',
  'register-oferente': '/register-oferente',
  'register-empresa': '/register-empresa',

  empresa: '/empresa',
  'empresa-jobs': '/empresa/mis-puestos',
  'empresa-publish': '/empresa/publicar-puesto',
  'empresa-candidates': '/empresa/puestos/:puestoId/candidatos',
  'empresa-candidate-profile': '/empresa/candidatos/:candidateId',

  oferente: '/oferente',
  'oferente-skills': '/oferente/mis-habilidades',
  'oferente-cv': '/oferente/mi-cv',
  'oferente-photo': '/oferente/mi-foto',

  admin: '/admin',
  'admin-companies': '/admin/empresas-pendientes',
  'admin-applicants': '/admin/oferentes-pendientes',
  'admin-characteristics': '/admin/caracteristicas',
  'admin-reports': '/admin/reportes',
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

const protectedPaths = [
  routePaths.dashboard,

  routePaths.empresa,
  routePaths['empresa-jobs'],
  routePaths['empresa-publish'],
  routePaths['empresa-candidates'],
  routePaths['empresa-candidate-profile'],

  routePaths.oferente,
  routePaths['oferente-skills'],
  routePaths['oferente-cv'],
  routePaths['oferente-photo'],

  routePaths.admin,
  routePaths['admin-companies'],
  routePaths['admin-applicants'],
  routePaths['admin-characteristics'],
  routePaths['admin-reports'],
]

function isProtectedPath(path) {
  return protectedPaths.some((protectedPath) => {
    const normalizedProtectedPath = protectedPath.replace(/:\w+/g, '')
    return path === protectedPath || path.startsWith(`${normalizedProtectedPath}`)
  })
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
    return <Navigate to={routePaths.home} replace />
  }

  return children
}

function RequireRole({ token, isLoading, user, roles, children }) {
  if (isLoading) {
    return <LoadingState label="Verificando permisos..." />
  }

  if (!token) {
    return <Navigate to={routePaths.home} replace />
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
  const [showLogin, setShowLogin] = useState(false)

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

          if (isProtectedPath(currentPath)) {
            navigate(routePaths.home, { replace: true })
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
    setShowLogin(false)
    goTo(getRoleHomePath(auth.user?.rol))
  }

  function handleLogout() {
    clearStoredToken()
    setToken('')
    setUser(null)
    setMessage('Sesión cerrada.')
    navigate(routePaths.home, { replace: true })
  }

  const navLinkClass = ({ isActive }) => (isActive ? 'topnav-link is-active' : 'topnav-link')

  const navItems = useMemo(() => [
    { key: 'home', label: 'Inicio', path: routePaths.home, show: () => !token },
    { key: 'search', label: 'Buscar puestos', path: routePaths.search, show: () => !token },
    { key: 'register-oferente', label: 'Registro oferente', path: routePaths['register-oferente'], show: () => !token },
    { key: 'register-empresa', label: 'Registro empresa', path: routePaths['register-empresa'], show: () => !token },

    { key: 'empresa', label: 'Dashboard', path: routePaths.empresa, show: () => user?.rol === 'EMPRESA' },
    { key: 'empresa-jobs', label: 'Mis puestos', path: routePaths['empresa-jobs'], show: () => user?.rol === 'EMPRESA' },
    { key: 'empresa-publish', label: 'Publicar puesto', path: routePaths['empresa-publish'], show: () => user?.rol === 'EMPRESA' },

    { key: 'oferente', label: 'Dashboard', path: routePaths.oferente, show: () => user?.rol === 'OFERENTE' },
    { key: 'oferente-skills', label: 'Mis habilidades', path: routePaths['oferente-skills'], show: () => user?.rol === 'OFERENTE' },
    { key: 'oferente-cv', label: 'Mi CV', path: routePaths['oferente-cv'], show: () => user?.rol === 'OFERENTE' },
    { key: 'oferente-photo', label: 'Mi foto', path: routePaths['oferente-photo'], show: () => user?.rol === 'OFERENTE' },

    { key: 'admin', label: 'Dashboard', path: routePaths.admin, show: () => user?.rol === 'ADMIN' },
    { key: 'admin-companies', label: 'Empresas pendientes', path: routePaths['admin-companies'], show: () => user?.rol === 'ADMIN' },
    { key: 'admin-applicants', label: 'Oferentes pendientes', path: routePaths['admin-applicants'], show: () => user?.rol === 'ADMIN' },
    { key: 'admin-characteristics', label: 'Características', path: routePaths['admin-characteristics'], show: () => user?.rol === 'ADMIN' },
    { key: 'admin-reports', label: 'Reportes', path: routePaths['admin-reports'], show: () => user?.rol === 'ADMIN' },
  ], [token, user])

  const visibleNav = useMemo(() => navItems.filter((item) => item.show()), [navItems])

  return (
      <main className="app-shell">
        <header className="topbar">
          <Link to={routePaths.home} className="brand">
            <span className="brand-mark">BE</span>
            <span>
            <strong>Bolsa de Empleo</strong>
          </span>
          </Link>

          <nav className="topnav" aria-label="Navegación principal">
            {visibleNav.map((item) => (
                <NavLink
                    key={item.key}
                    to={item.path}
                    end
                    className={navLinkClass}
                >
                  {item.label}
                </NavLink>
            ))}

            {token ? (
                <button type="button" className="nav-cta" onClick={handleLogout}>
                  Salir
                </button>
            ) : (
                <button type="button" className="nav-cta" onClick={() => setShowLogin(true)}>
                  Entrar
                </button>
            )}
          </nav>
        </header>

        {message ? <p className="global-message">{message}</p> : null}

        <Routes>
          <Route path="/" element={<Navigate to={routePaths.home} replace />} />
          <Route path={routePaths.home} element={<HomeScreen onNavigate={goTo} token={token} />} />
          <Route path={routePaths.search} element={<SearchScreen token={token} />} />

          <Route path={routePaths['register-oferente']} element={<RegisterOferenteScreen onNavigate={goTo} />} />
          <Route path={routePaths['register-empresa']} element={<RegisterCompanyScreen onNavigate={goTo} />} />

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
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['EMPRESA']}>
                    <CompanyScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['empresa-candidates']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['EMPRESA']}>
                    <CompanyCandidatesScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['empresa-candidate-profile']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['EMPRESA']}>
                    <CompanyCandidateProfileScreen token={token} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['empresa-jobs']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['EMPRESA']}>
                    <CompanyJobsScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['empresa-publish']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['EMPRESA']}>
                    <CompanyPublishScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths.oferente}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['OFERENTE']}>
                    <OferenteScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['oferente-skills']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['OFERENTE']}>
                    <OferenteSkillsScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['oferente-cv']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['OFERENTE']}>
                    <OferenteCvScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['oferente-photo']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['OFERENTE']}>
                    <OferentePhotoScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths.admin}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['ADMIN']}>
                    <AdminScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['admin-companies']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['ADMIN']}>
                    <AdminCompaniesScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['admin-applicants']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['ADMIN']}>
                    <AdminApplicantsScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['admin-characteristics']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['ADMIN']}>
                    <AdminCharacteristicsScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route
              path={routePaths['admin-reports']}
              element={(
                  <RequireRole token={token} isLoading={isLoadingSession} user={user} roles={['ADMIN']}>
                    <AdminReportsScreen token={token} onNavigate={goTo} />
                  </RequireRole>
              )}
          />

          <Route path="*" element={<Navigate to={routePaths.home} replace />} />
        </Routes>

        {showLogin ? (
            <LoginModal
                onLoginSuccess={handleLoginSuccess}
                onClose={() => setShowLogin(false)}
            />
        ) : null}
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