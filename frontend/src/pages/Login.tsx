import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { TransitionLink } from '../components/transition/TransitionProvider';
import MagneticLink from '../components/landing/MagneticLink';
import MagneticButton from '../components/common/MagneticButton';
import Reveal from '../components/landing/Reveal';
import ParticleField from '../components/landing/ParticleField';
import TrackMark from '../components/brand/TrackMark';

export default function Login() {
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  // a quick shake grabs attention when login fails
  useEffect(() => {
    if (!error) return;
    const showId = setTimeout(() => setShake(true), 0);
    const hideId = setTimeout(() => setShake(false), 450);
    return () => {
      clearTimeout(showId);
      clearTimeout(hideId);
    };
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const loggedInUser = await login({ email, password });
      navigate(loggedInUser?.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch {
      // auth state already reflects the failure
    }
  };

  return (
    <div className="min-h-dvh relative overflow-hidden flex flex-col bg-surface-950" style={{
      background: 'radial-gradient(ellipse at 30% 20%, rgba(245,158,11,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(245,158,11,0.07) 0%, transparent 50%), #0c0a08',
    }}>
      {/* Interactive particle depth */}
      <ParticleField className="pointer-events-none absolute inset-0 opacity-40" />

      {/* Ambient orbs */}
      <div className="absolute top-20 left-[15%] w-72 h-72 bg-primary-500/10 rounded-full blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-accent-500/10 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Back to landing */}
      <MagneticLink
        to="/"
        strength={0.4}
        className="fixed top-6 left-6 z-50 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-surface-200 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </MagneticLink>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-20 overflow-y-auto">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left — Branding */}
          <Reveal as="div" className="flex-1 max-w-lg text-center lg:text-left shrink-0">
            <TransitionLink to="/" className="flex items-center gap-3 mb-6 lg:mb-8 justify-center lg:justify-start group transition-opacity hover:opacity-90">
              <div className="w-11 h-11 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <TrackMark className="w-6 h-6 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">MyTrackify</span>
            </TransitionLink>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-5 leading-[1.1] tracking-tight">
              Know every offer<br />
              <span className="text-gradient">before you interview.</span>
            </h1>

            <p className="text-surface-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 lg:mb-10 max-w-md mx-auto lg:mx-0">
              Real interview experiences, company insights, and AI-powered readiness analysis — all from students at your own campus.
            </p>

            <div className="space-y-2.5 sm:space-y-3 mb-8 lg:mb-12">
              {[
                'Browse 12+ company interview processes',
                '500+ verified student experiences',
                'Personalized readiness scoring',
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 justify-center lg:justify-start">
                  <TrackMark className="w-4 h-4 text-primary-400 flex-shrink-0" strokeWidth={2.4} />
                  <span className="text-xs sm:text-sm text-surface-300">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-stretch gap-0 justify-center lg:justify-start divide-x divide-white/10">
              {[
                { value: '300+', label: 'Students' },
                { value: '12', label: 'Companies' },
                { value: '500+', label: 'Experiences' },
                { value: '85+', label: 'Offers' },
              ].map(({ value, label }) => (
                <div key={label} className="px-4 sm:px-5 first:pl-0 last:pr-0 text-center lg:text-left">
                  <p className="font-display text-2xl sm:text-3xl font-semibold text-primary-400 leading-none">{value}</p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-surface-500 mt-1.5">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right — Login Card */}
          <Reveal as="div" className="w-full max-w-[420px] shrink-0">
            <div className="rounded-2xl border border-white/10 bg-surface-900 p-8 shadow-2xl shadow-black/40">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
                <p className="text-surface-300 text-sm">Sign in to your placement dashboard</p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5 animate-slide-up">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-2 uppercase tracking-wider" htmlFor="login-email">
                    Email
                  </label>
                  <div className={`flex items-center gap-3 rounded-lg border border-surface-600 bg-surface-950/60 px-3.5 py-2.5 transition-colors focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/30 ${shake ? 'animate-shake' : ''}`}>
                    <Mail className="h-5 w-5 shrink-0 text-surface-400" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@college.edu"
                      className="w-full flex-1 bg-transparent text-sm text-surface-100 placeholder:text-surface-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-2 uppercase tracking-wider" htmlFor="login-password">
                    Password
                  </label>
                  <div className={`flex items-center gap-3 rounded-lg border border-surface-600 bg-surface-950/60 px-3.5 py-2.5 transition-colors focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/30 ${shake ? 'animate-shake' : ''}`}>
                    <Lock className="h-5 w-5 shrink-0 text-surface-400" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full flex-1 bg-transparent text-sm text-surface-100 placeholder:text-surface-500 outline-none"
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0 text-surface-400 hover:text-surface-200 hover:bg-surface-700/60 rounded-md p-1 transition-colors" tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  disabled={isLoading}
                  id="login-submit"
                  className="w-full mt-1 py-2.5 px-4 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </MagneticButton>
              </form>

              <p className="text-center text-sm text-surface-400 mt-6">
                New to MyTrackify?{' '}
                <TransitionLink to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors hover:underline underline-offset-4">
                  Create account
                </TransitionLink>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
