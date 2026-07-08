// ============================================
// Login Page — Polished, centered layout
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, BarChart3, Users, Building2, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const loggedInUser = await login({ email, password });
      navigate(loggedInUser?.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-dvh relative overflow-hidden flex flex-col" style={{
      background: 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.08) 0%, transparent 50%), #060614',
    }}>
      {/* Animated background orbs */}
      <div className="absolute top-20 left-[15%] w-72 h-72 bg-primary-500/10 rounded-full blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-accent-500/8 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Main content — two-column centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-20">

          {/* Left — Branding */}
          <div className="flex-1 max-w-lg text-center lg:text-left shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6 lg:mb-8 justify-center lg:justify-start">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">MyTrackify</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 lg:mb-5 leading-[1.1] tracking-tight">
              Prepare smarter,<br />
              <span className="text-gradient">not harder.</span>
            </h1>

            <p className="text-surface-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 lg:mb-10 max-w-md mx-auto lg:mx-0">
              Real interview experiences, company insights, and AI-powered readiness analysis — all from students at your own campus.
            </p>

            {/* Feature list */}
            <div className="space-y-2.5 sm:space-y-3 mb-6 lg:mb-10">
              {[
                'Browse 12+ company interview processes',
                '500+ verified student experiences',
                'Personalized readiness scoring',
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-surface-300">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 sm:gap-6 justify-center lg:justify-start">
              {[
                { icon: Users, value: '300+', label: 'Students' },
                { icon: Building2, value: '12', label: 'Companies' },
                { icon: BarChart3, value: '500+', label: 'Experiences' },
                { icon: TrendingUp, value: '85+', label: 'Offers' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-4 h-4 text-primary-400 mx-auto mb-1" />
                  <p className="text-base sm:text-lg font-bold text-white leading-none">{value}</p>
                  <p className="text-[10px] text-surface-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login Card */}
          <div className="w-full max-w-[400px] shrink-0">
            <div className="rounded-2xl border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>

              <div className="mb-6 lg:mb-7">
                <h2 className="text-xl font-bold text-white mb-1 tracking-tight">Welcome back</h2>
                <p className="text-surface-400 text-sm">Sign in to your placement dashboard</p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5 animate-slide-up">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1.5 uppercase tracking-wider" htmlFor="login-email">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@college.edu"
                      className="input-dark w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1.5 uppercase tracking-wider" htmlFor="login-password">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-dark w-full pl-10 pr-10 py-2.5 rounded-lg text-sm"
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-200 transition-colors" tabIndex={-1}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} id="login-submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 mt-6">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-surface-500 mt-6">
                New to MyTrackify?{' '}
                <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
