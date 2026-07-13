import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, GraduationCap, BookOpen, ArrowRight, ArrowLeft, Shield, BarChart3 } from 'lucide-react';
import { TransitionLink } from '../components/transition/TransitionProvider';
import MagneticLink from '../components/landing/MagneticLink';
import MagneticButton from '../components/common/MagneticButton';
import Reveal from '../components/landing/Reveal';
import ParticleField from '../components/landing/ParticleField';
import TrackMark from '../components/brand/TrackMark';

const branches = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Other',
];

const cgpaRanges = ['9.0-10.0', '8.5-9.0', '8.0-8.5', '7.5-8.0', '7.0-7.5', '6.5-7.0', '6.0-6.5', 'Below 6.0'];

export default function Register() {
  const { register, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    collegeId: '',
    graduationYear: 2025,
    branch: '',
    cgpaRange: '',
  });
  const [localError, setLocalError] = useState('');
  const [shake, setShake] = useState(false);

  // a shake flags the step where validation failed
  useEffect(() => {
    if (!localError && !error) return;
    const showId = setTimeout(() => setShake(true), 0);
    const hideId = setTimeout(() => setShake(false), 450);
    return () => {
      clearTimeout(showId);
      clearTimeout(hideId);
    };
  }, [localError, error]);

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLocalError('');
    clearError();
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password) {
        setLocalError('Please fill in all fields');
        return;
      }
      if (formData.password.length < 6) {
        setLocalError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch || !formData.cgpaRange) {
      setLocalError('Please fill in all fields');
      return;
    }
    try {
      await register({
        email: formData.email,
        password: formData.password,
        collegeId: formData.collegeId,
        graduationYear: formData.graduationYear,
        branch: formData.branch,
        cgpaRange: formData.cgpaRange,
      });
      navigate('/dashboard');
    } catch {
      // auth state already reflects the failure
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-dvh flex flex-col md:flex-row overflow-y-auto">
      {/* Back to landing */}
      <MagneticLink
        to="/"
        strength={0.4}
        className="fixed top-6 left-6 z-50 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-surface-200 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </MagneticLink>

      {/* Left — Branding Panel */}
      <div className="relative md:w-[55%] min-h-[200px] md:min-h-0 flex-shrink-0 flex items-start md:items-center justify-center p-6 md:p-12 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 30% 40%, rgba(245,158,11,0.16) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(245,158,11,0.09) 0%, transparent 50%), #0c0a08',
        }}>
        {/* Interactive particle depth */}
        <ParticleField className="pointer-events-none absolute inset-0 opacity-40" />

        {/* Animated orbs */}
        <div className="absolute top-16 right-16 w-56 h-56 bg-primary-500/20 rounded-full blur-[80px] animate-float pointer-events-none" />
        <div className="absolute bottom-20 left-12 w-48 h-48 bg-accent-500/15 rounded-full blur-[70px] animate-float pointer-events-none" style={{ animationDelay: '3s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

        <Reveal className="relative z-10 max-w-md w-full overflow-y-auto max-h-full py-4">
          {/* Logo */}
          <TransitionLink to="/" className="flex items-center gap-3 mb-8 lg:mb-10 group transition-opacity hover:opacity-90">
            <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-xl shadow-primary-500/20">
              <TrackMark className="w-7 h-7 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">MyTrackify</h1>
              <p className="text-surface-400 text-xs tracking-wide">Placement Intelligence Platform</p>
            </div>
          </TransitionLink>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
            Join the placement<br />
            <span className="text-gradient">intelligence network.</span>
          </h2>

          <p className="text-surface-300 text-sm sm:text-base mb-8 lg:mb-10 leading-relaxed max-w-sm">
            Your anonymized experiences help juniors prepare smarter. Together, we turn individual knowledge into collective intelligence.
          </p>

          {/* Benefit cards */}
          <div className="space-y-3">
            {[
              { icon: Shield, text: 'Fully anonymous — your identity is never revealed' },
              { icon: BarChart3, text: 'Get personalized readiness scores for your target companies' },
              { icon: TrackMark, text: 'Access 500+ verified interview experiences' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  {text.includes('500+') ? (
                    <TrackMark className="w-4 h-4 text-primary-400" strokeWidth={2.4} />
                  ) : (
                    <Icon className="w-4 h-4 text-primary-400" />
                  )}
                </div>
                <p className="text-sm text-surface-300">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Right — Registration Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-surface-950 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/5 to-transparent pointer-events-none" />

        <Reveal className="w-full max-w-sm relative z-10 py-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  s <= step
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'bg-surface-800/60 text-surface-500 border border-white/[0.06]'
                }`}>
                  {s < step ? <TrackMark className="w-4 h-4" strokeWidth={2.6} /> : s}
                </div>
                {s < 2 && (
                  <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-surface-800/60">
                    <div className={`h-full rounded-full transition-all duration-500 ${
                      step > 1 ? 'w-full bg-primary-500' : 'w-0'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-5 lg:mb-6">
            <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
              {step === 1 ? 'Create your account' : 'Academic details'}
            </h2>
            <p className="text-surface-400 text-sm">
              {step === 1 ? 'Start your placement journey' : 'Help us personalize your experience'}
            </p>
          </div>

          {displayError && (
            <div className="mb-5 p-3.5 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm animate-slide-up flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-danger-400 rounded-full flex-shrink-0" />
              {displayError}
            </div>
          )}

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {step === 1 && (
              <div className={`space-y-4 animate-fade-in ${shake ? 'animate-shake' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2" htmlFor="reg-email">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                    <input id="reg-email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)}
                      placeholder="you@college.edu" className="input-dark w-full pl-11 pr-4 py-3 rounded-xl text-sm" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2" htmlFor="reg-college-id">College ID</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                    <input id="reg-college-id" type="text" value={formData.collegeId} onChange={(e) => updateField('collegeId', e.target.value)}
                      placeholder="CS2025042" className="input-dark w-full pl-11 pr-4 py-3 rounded-xl text-sm" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2" htmlFor="reg-password">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                    <input id="reg-password" type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Min 6 characters" className="input-dark w-full pl-11 pr-4 py-3 rounded-xl text-sm" required minLength={6} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2" htmlFor="reg-confirm-password">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                    <input id="reg-confirm-password" type="password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)}
                      placeholder="••••••••" className="input-dark w-full pl-11 pr-4 py-3 rounded-xl text-sm" required />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={`space-y-4 animate-fade-in ${shake ? 'animate-shake' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2" htmlFor="reg-year">Graduation Year</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                    <select id="reg-year" value={formData.graduationYear} onChange={(e) => updateField('graduationYear', parseInt(e.target.value))}
                      className="input-dark w-full pl-11 pr-4 py-3 rounded-xl text-sm appearance-none cursor-pointer">
                      {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2" htmlFor="reg-branch">Branch</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                    <select id="reg-branch" value={formData.branch} onChange={(e) => updateField('branch', e.target.value)}
                      className="input-dark w-full pl-11 pr-4 py-3 rounded-xl text-sm appearance-none cursor-pointer" required>
                      <option value="">Select branch</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2" htmlFor="reg-cgpa">CGPA Range</label>
                  <div className="relative group">
                    <BarChart3 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                    <select id="reg-cgpa" value={formData.cgpaRange} onChange={(e) => updateField('cgpaRange', e.target.value)}
                      className="input-dark w-full pl-11 pr-4 py-3 rounded-xl text-sm appearance-none cursor-pointer" required>
                      <option value="">Select range</option>
                      {cgpaRanges.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              {step > 1 && (
                <button type="button" onClick={() => setStep(prev => prev - 1)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] text-surface-200 hover:bg-surface-800/50 transition-all text-sm font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <MagneticButton type="submit" disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30"
                id="register-submit">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>{step === 2 ? 'Create Account' : 'Next'} <ArrowRight className="w-4 h-4" /></>
                )}
              </MagneticButton>
            </div>
          </form>

          <div className="mt-6 lg:mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-center text-sm text-surface-400">
              Already have an account?{' '}
              <TransitionLink to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in →</TransitionLink>
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
