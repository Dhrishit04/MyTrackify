import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare, Building2, Plus, Trash2, Star, CheckCircle, ArrowLeft, ArrowRight, Sparkles, Search, Calendar, Flag } from 'lucide-react';
import { companies } from '../services/mockData';
import { experienceService } from '../services/experienceService';
import { availableTopics, roundTypes } from '../services/mockData';
import type { LogRoundData } from '../types';
import Reveal from '../components/landing/Reveal';
import RevealText from '../components/landing/RevealText';
import MagneticButton from '../components/common/MagneticButton';
import { useLenis } from 'lenis/react';

const emptyRound: LogRoundData = {
  roundNumber: 1,
  roundType: 'Online Assessment',
  outcome: 'Passed',
  difficulty: 3,
  questionsAsked: '',
  topics: [],
  preparationTips: '',
};

export default function LogExperience() {
  const navigate = useNavigate();
  const lenis = useLenis();
  const [step, setStep] = useState(1);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [applicationType, setApplicationType] = useState<'On-Campus' | 'Off-Campus'>('On-Campus');
  const [applicationDate, setApplicationDate] = useState('');
  const [finalOutcome, setFinalOutcome] = useState<string>('In Progress');
  const [rounds, setRounds] = useState<LogRoundData[]>([{ ...emptyRound }]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Track scroll for parallax effects
  useEffect(() => {
    if (!lenis) return;
    let rafId: number;
    const updateProgress = () => {
      const scrollY = lenis.scroll;
      const viewportHeight = window.innerHeight;
      const progress = Math.min(1, scrollY / (viewportHeight * 2));
      setScrollProgress(progress);
      rafId = requestAnimationFrame(updateProgress);
    };
    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis]);

  const addRound = () => {
    setRounds(prev => [...prev, { ...emptyRound, roundNumber: prev.length + 1 }]);
  };

  const removeRound = (index: number) => {
    if (rounds.length > 1) {
      setRounds(prev => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, roundNumber: i + 1 })));
    }
  };

  const updateRound = (index: number, field: keyof LogRoundData, value: string | number | string[]) => {
    setRounds(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const toggleTopic = (roundIndex: number, topic: string) => {
    setRounds(prev => prev.map((r, i) => {
      if (i !== roundIndex) return r;
      const topics = r.topics.includes(topic)
        ? r.topics.filter(t => t !== topic)
        : [...r.topics, topic];
      return { ...r, topics };
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!companyId) newErrors.company = 'Please select a company';
      if (!applicationDate) newErrors.date = 'Please enter the application date';
    }
    if (step === 2) {
      rounds.forEach((round, i) => {
        if (round.questionsAsked.length < 50) {
          newErrors[`round-${i}-questions`] = 'Please provide detailed questions (min 50 characters)';
        }
        if (round.topics.length === 0) {
          newErrors[`round-${i}-topics`] = 'Please select at least one topic';
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (!validate() || !companyId) return;
    setSubmitting(true);
    try {
      await experienceService.logExperience({
        companyId,
        applicationType,
        applicationDate,
        finalOutcome: finalOutcome as 'Selected' | 'Rejected' | 'In Progress' | 'Withdrew',
        rounds,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-slide-up relative">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-success-500/10 rounded-full blur-[100px] animate-float" />
        </div>
        <div className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <CheckCircle className="w-10 h-10 text-success-400" />
        </div>
        <RevealText as="h2" className="text-2xl font-bold text-white mb-3" text="Experience Logged! 🎉" mode="words" stagger={40} />
        <p className="text-surface-300 mb-8 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          Thank you for sharing your interview experience. You're helping future batches prepare better.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <MagneticButton onClick={() => navigate('/companies')} className="px-6 py-2.5 rounded-xl border border-white/10 text-surface-200 hover:bg-surface-800 transition-colors text-sm font-medium">
            Browse Companies
          </MagneticButton>
          <MagneticButton onClick={() => { setSubmitted(false); setStep(1); setCompanyId(null); setRounds([{ ...emptyRound }]); }} className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium transition-all hover:shadow-primary-500/25">
            Log Another
          </MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto space-y-6 animate-fade-in relative" style={{ willChange: 'transform' }}>
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/3 via-transparent to-accent-500/3 animate-pulse-soft" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/5 rounded-full blur-[150px] animate-float" style={{ transform: 'translateY(' + scrollProgress * 30 + 'px)' }} />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s', transform: 'translateY(' + scrollProgress * -30 + 'px)' }} />
      </div>

      {/* Header */}
      <Reveal delay={0} style={{ opacity: 0.3 + scrollProgress * 0.7, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 animate-slide-up">
            <PenSquare className="w-6 h-6 text-primary-400" />
            Log Interview Experience
          </h1>
          <p className="text-surface-400 mt-1 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>Help future batches prepare better by sharing your experience</p>
        </div>
      </Reveal>

      {/* Progress Bar */}
      <Reveal delay={100} style={{ opacity: 0.2 + scrollProgress * 0.8, transform: 'translateY(' + 20 * (1 - scrollProgress) + 'px)' }}>
        <div className="flex items-center gap-2">
          {['Company', 'Round Details', 'Review'].map((label, i) => (
            <Reveal key={i} delay={i * 80} className="flex items-center gap-2 flex-1 animate-slide-in-right" style={{ animationFillMode: 'both' }}>
              <div className={`flex items-center gap-2 flex-1 ${i + 1 <= step ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  i + 1 < step ? 'bg-success-500 text-white' : i + 1 === step ? 'bg-primary-600 text-white animate-pulse-soft' : 'bg-surface-700 text-surface-400'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className="text-xs font-medium text-surface-300 hidden sm:block">{label}</span>
                {i < 2 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-success-500' : 'bg-surface-700'}`} />}
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Step Content */}
      <Reveal delay={150} style={{ opacity: 0.1 + scrollProgress * 0.9, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        <div className="glass-strong rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Step 1: Company Selection */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in relative z-10">
              <RevealText as="h2" className="text-lg font-semibold text-white" text="Select Company & Details" mode="words" stagger={35} />

              {/* Company Search */}
              <Reveal delay={0} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary-400" />
                    Company *
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies..."
                    className="input-dark w-full px-4 py-2.5 rounded-xl text-sm mb-2"
                    id="company-search"
                  />
                  {errors.company && <p className="text-danger-400 text-xs mt-1 animate-shake">{errors.company}</p>}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {filteredCompanies.map((c, idx) => (
                      <Reveal key={c.id} delay={idx * 30} className="animate-scale-in" style={{ animationFillMode: 'both' }}>
                        <button
                          onClick={() => { setCompanyId(c.id); setSearchQuery(c.name); }}
                          className={`p-3 rounded-xl text-left text-sm transition-all duration-300 ${
                            companyId === c.id
                              ? 'bg-primary-600/20 border border-primary-500/30 text-primary-300 shadow-lg shadow-primary-500/10'
                              : 'bg-surface-800/50 border border-white/5 text-surface-200 hover:bg-surface-700/50 hover:border-white/10 hover:scale-102'
                          }`}>
                          <p className="font-medium truncate">{c.name}</p>
                          <p className="text-xs text-surface-400">{c.sector}</p>
                        </button>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Application Type */}
              <Reveal delay={100} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-primary-400" />
                    Application Type
                  </label>
                  <div className="flex gap-3">
                    {['On-Campus', 'Off-Campus'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setApplicationType(type as 'On-Campus' | 'Off-Campus')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                          applicationType === type
                            ? 'bg-primary-600/20 border border-primary-500/30 text-primary-300 shadow-lg shadow-primary-500/10'
                            : 'bg-surface-800/50 border border-white/5 text-surface-300 hover:bg-surface-700/50 hover:border-white/10 hover:scale-102'
                        }`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Date & Outcome */}
              <Reveal delay={200} className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationFillMode: 'both' }}>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    Application Date *
                  </label>
                  <input type="date" value={applicationDate} onChange={(e) => setApplicationDate(e.target.value)}
                    className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" id="app-date" />
                  {errors.date && <p className="text-danger-400 text-xs mt-1 animate-shake">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-primary-400" />
                    Final Outcome
                  </label>
                  <select value={finalOutcome} onChange={(e) => setFinalOutcome(e.target.value)}
                    className="input-dark w-full px-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer" id="outcome-select">
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Withdrew">Withdrew</option>
                  </select>
                </div>
              </Reveal>
            </div>
          )}

          {/* Step 2: Round Details */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in relative z-10">
              <Reveal delay={0} className="flex items-center justify-between animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                <RevealText as="h2" className="text-lg font-semibold text-white" text="Round Details" mode="words" stagger={35} />
                <MagneticButton onClick={addRound} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600/20 text-primary-300 text-xs font-medium hover:bg-primary-600/30 transition-colors" id="add-round-btn">
                  <Plus className="w-3.5 h-3.5" /> Add Round
                </MagneticButton>
              </Reveal>

              {rounds.map((round, i) => (
                <Reveal key={i} delay={i * 100} className="p-5 rounded-xl bg-surface-800/30 border border-white/5 space-y-4 animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                  <div className="flex items-center justify-between">
                    <RevealText as="h3" className="text-sm font-semibold text-primary-300" text={`Round ${round.roundNumber}`} mode="chars" stagger={30} />
                    {rounds.length > 1 && (
                      <button onClick={() => removeRound(i)} className="text-danger-400 hover:text-danger-300 p-1 transition-colors group">
                        <Trash2 className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Reveal delay={0} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
                      <label className="block text-xs font-medium text-surface-300 mb-1">Round Type</label>
                      <select value={round.roundType} onChange={(e) => updateRound(i, 'roundType', e.target.value)}
                        className="input-dark w-full px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer">
                        {roundTypes.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                      </select>
                    </Reveal>
                    <Reveal delay={50} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
                      <label className="block text-xs font-medium text-surface-300 mb-1">Outcome</label>
                      <select value={round.outcome} onChange={(e) => updateRound(i, 'outcome', e.target.value)}
                        className="input-dark w-full px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer">
                        <option value="Passed">Passed</option>
                        <option value="Failed">Failed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </Reveal>
                  </div>

                  {/* Difficulty */}
                  <Reveal delay={100} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
                    <label className="block text-xs font-medium text-surface-300 mb-2">Difficulty</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => updateRound(i, 'difficulty', star)} type="button" className="p-0.5 group">
                          <Star className={`w-6 h-6 transition-all duration-300 ${star <= round.difficulty ? 'text-warning-400 fill-current group-hover:scale-125' : 'text-surface-600 group-hover:scale-110'}`} />
                        </button>
                      ))}
                      <span className="text-xs text-surface-400 ml-2">{round.difficulty}/5</span>
                    </div>
                  </Reveal>

                  {/* Questions */}
                  <Reveal delay={150} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
                    <label className="block text-xs font-medium text-surface-300 mb-1">
                      Questions Asked * <span className="text-surface-500">({round.questionsAsked.length}/50 min)</span>
                    </label>
                    <textarea value={round.questionsAsked} onChange={(e) => updateRound(i, 'questionsAsked', e.target.value)}
                      placeholder="Describe the questions asked in detail..."
                      className="input-dark w-full px-3 py-2 rounded-lg text-sm min-h-[100px] resize-y" />
                    {errors[`round-${i}-questions`] && <p className="text-danger-400 text-xs mt-1 animate-shake">{errors[`round-${i}-questions`]}</p>}
                  </Reveal>

                  {/* Topics */}
                  <Reveal delay={200} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
                    <label className="block text-xs font-medium text-surface-300 mb-2 flex items-center gap-2">
                      Topics * {errors[`round-${i}-topics`] && <span className="text-danger-400">({errors[`round-${i}-topics`]})</span>}
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {availableTopics.map((topic) => (
                        <button key={topic} type="button" onClick={() => toggleTopic(i, topic)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                            round.topics.includes(topic)
                              ? 'bg-primary-600/25 text-primary-300 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                              : 'bg-surface-800/60 text-surface-400 border border-white/5 hover:text-surface-200 hover:border-white/10 hover:scale-105'
                          }`}>
                          {topic}
                        </button>
                      ))}
                    </div>
                  </Reveal>

                  {/* Tips */}
                  <Reveal delay={250} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Preparation Tips (Optional)</label>
                    <textarea value={round.preparationTips} onChange={(e) => updateRound(i, 'preparationTips', e.target.value)}
                      placeholder="Any advice for future candidates..."
                      className="input-dark w-full px-3 py-2 rounded-lg text-sm min-h-[60px] resize-y" />
                  </Reveal>
                </Reveal>
              ))}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in relative z-10">
              <Reveal delay={0} className="animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                <RevealText as="h2" className="text-lg font-semibold text-white flex items-center gap-2" text="Review Your Experience" mode="words" stagger={35} />
                <Sparkles className="w-5 h-5 text-primary-400 animate-float" />
              </Reveal>

              <Reveal delay={100} className="p-4 rounded-xl bg-surface-800/30 border border-white/5 animate-scale-in" style={{ animationFillMode: 'both' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-primary-400 animate-float-slow" />
                  <span className="font-semibold text-white">{companies.find(c => c.id === companyId)?.name || 'Unknown'}</span>
                  <span className="text-xs text-surface-400">{applicationType} · {applicationDate}</span>
                </div>
                <p className="text-sm text-surface-300">Outcome: <span className="font-medium text-surface-100">{finalOutcome}</span></p>
                <p className="text-sm text-surface-300 mt-1">Rounds logged: <span className="font-medium text-surface-100">{rounds.length}</span></p>
              </Reveal>

              {rounds.map((round, i) => (
                <Reveal key={i} delay={i * 80 + 200} className="p-4 rounded-xl bg-surface-800/20 border border-white/5 animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                  <div className="flex items-center justify-between mb-2">
                    <RevealText as="h4" className="text-sm font-semibold text-primary-300" text={`Round ${round.roundNumber}: ${round.roundType}`} mode="chars" stagger={25} />
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${round.outcome === 'Passed' ? 'text-success-400' : round.outcome === 'Failed' ? 'text-danger-400' : 'text-surface-400'}`}>
                        {round.outcome}
                      </span>
                      <div className="flex">{[...Array(round.difficulty)].map((_, s) => <Star key={s} className="w-3 h-3 text-warning-400 fill-current animate-bounce-gentle" style={{ animationDelay: s * 80 + 'ms' }} />)}</div>
                    </div>
                  </div>
                  <p className="text-xs text-surface-300 line-clamp-2 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>{round.questionsAsked}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {round.topics.map(t => <span key={t} className="text-xs px-2 py-0.5 bg-primary-500/10 text-primary-300 rounded animate-scale-in" style={{ animationDelay: round.topics.indexOf(t) * 50 + 200 + 'ms', animationFillMode: 'both' }}>{t}</span>)}
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <Reveal delay={step === 3 ? 300 : 200} className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5 animate-slide-up" style={{ animationFillMode: 'both' }}>
            {step > 1 && (
              <button onClick={() => setStep(prev => prev - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-surface-200 hover:bg-surface-800 transition-colors text-sm font-medium group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <MagneticButton onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all shadow-lg hover:shadow-primary-500/25" id="next-step-btn">
                Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
            ) : (
              <MagneticButton onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-success-600 to-success-500 hover:from-success-500 hover:to-success-400 text-white text-sm font-semibold transition-all shadow-lg disabled:opacity-50" id="submit-experience-btn">
                {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Submit Experience
              </MagneticButton>
            )}
          </Reveal>
        </div>
      </Reveal>
    </div>
  );
}
