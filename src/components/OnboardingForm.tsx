import { useState } from 'react';
import BlueprintDashboard from './BlueprintDashboard';

export interface FormData {
  // Step 1: The Basics
  companyName: string;
  contactEmail: string;
  industry: string;
  // Step 2: The Big Idea
  mainGoal: string;
  monetization: string;
  audience: string;
  // Step 3: Preferences & Timeline
  platform: 'web' | 'mobile' | 'both' | '';
  aesthetic: string;
  timeline: 'urgent' | 'standard' | 'flexible' | '';
  // Step 4: Technical Specs (Optional)
  features: string[];
  integrations: string;
}

type Step = 1 | 2 | 3 | 4;

export default function OnboardingForm() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [projectData, setProjectData] = useState<any>(null);
  const [errors, setErrors] = useState({
    companyName: '',
    email: '',
    industry: '',
    mainGoal: '',
  });
  const [form, setForm] = useState<FormData>({
    companyName: '',
    contactEmail: '',
    industry: '',
    mainGoal: '',
    monetization: '',
    audience: '',
    platform: '',
    aesthetic: '',
    timeline: '',
    features: [],
    integrations: '',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field: keyof Omit<FormData, 'features' | 'platform' | 'timeline'>, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({
      ...prev,
      [field === 'contactEmail' ? 'email' : field]: '',
    }));
  };

  const isStepValid = (): boolean => {
    if (step === 1) {
      return form.companyName.trim().length > 0 &&
             form.contactEmail.trim().length > 0 &&
             form.industry.trim().length > 0;
    }
    if (step === 2) {
      return form.mainGoal.trim().length > 10 && 
             form.monetization.trim().length > 0 &&
             form.audience.trim().length > 0;
    }
    if (step === 3) {
      return form.platform.trim().length > 0 &&
             form.aesthetic.trim().length > 0 &&
             form.timeline.trim().length > 0;
    }
    if (step === 4) {
      return true; // Tech details are completely optional for non-tech clients!
    }
    return false;
  };

  const handleNext = () => {
    if (step === 1) {
      const nextErrors = { companyName: '', email: '', industry: '', mainGoal: '' };
      if (!form.companyName.trim()) nextErrors.companyName = 'Company name is required.';
      if (!emailRegex.test(form.contactEmail.trim())) nextErrors.email = 'Enter a valid email address.';
      if (!form.industry.trim()) nextErrors.industry = 'Please select an industry.';
      setErrors(nextErrors);
      if (nextErrors.companyName || nextErrors.email || nextErrors.industry) return;
    }
    if (step === 2) {
      if (form.mainGoal.trim().length <= 10) {
        setErrors(prev => ({ ...prev, mainGoal: 'Please describe your idea in a bit more detail (at least 10 characters).' }));
        return;
      }
    }
    if (step < 4) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = async () => {
    if (!isStepValid() || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('http://localhost:5000/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProjectData(data.project);
        setIsSubmitting(false);
        setIsComplete(true);
      } else {
        setSubmitError(data.error || 'Failed to generate blueprint');
        setIsSubmitting(false);
      }
    } catch (error) {
      setSubmitError('Unable to reach the server. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-8">
        <div className="max-w-lg w-full rounded-3xl border border-purple-600/20 bg-neutral-900/95 p-10 text-center shadow-2xl">
          {submitError ? (
            <>
              <p className="text-sm uppercase tracking-[0.3em] text-red-400 mb-6">Error</p>
              <p className="text-neutral-300 mb-6">{submitError}</p>
              <button onClick={() => { setIsSubmitting(false); setSubmitError(''); }} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all">Try Again</button>
            </>
          ) : (
            <>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-300 mb-6">Forging customized system architecture...</p>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-purple-500/40 bg-purple-600/10 text-purple-200">
                <span className="animate-spin block h-8 w-8 rounded-full border-4 border-t-transparent border-purple-300" />
              </div>
              <p className="mt-6 text-neutral-300">Calculating your project roadmap based on your ideal timeline...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (isComplete) {
    return <BlueprintDashboard projectData={projectData} onReset={() => { setIsComplete(false); setStep(1); }} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <ProgressBar currentStep={step} totalSteps={4} />

        <div className="mt-12">
          {step === 1 && <StepOne form={form} onChange={handleChange} errors={errors} />}
          {step === 2 && <StepTwo form={form} onChange={handleChange} errors={errors} />}
          {step === 3 && (
            <StepThree 
              form={form} 
              onChange={handleChange} 
              setPlatform={(platform) => setForm(p => ({ ...p, platform }))}
              setTimeline={(timeline) => setForm(p => ({ ...p, timeline }))}
            />
          )}
          {step === 4 && (
            <StepFour 
              form={form} 
              onChange={handleChange} 
              toggleFeature={(feature) => setForm(p => ({
                ...p,
                features: p.features.includes(feature) ? p.features.filter(f => f !== feature) : [...p.features, feature]
              }))}
            />
          )}
        </div>

        <div className="mt-12 flex justify-between items-center">
          <button onClick={handleBack} disabled={step === 1} className="px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 text-neutral-300">Back</button>
          <div className="text-sm text-neutral-500">Step {step} of 4</div>
          {step < 4 ? (
            <button onClick={handleNext} disabled={!isStepValid()} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition-all">Next</button>
          ) : (
            <button onClick={handleSubmit} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all">Forge System Scope</button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const stepsTitles = ["The Basics", "The Big Idea", "Preferences", "Technical (Optional)"];
  return (
    <div className="w-full">
      <div className="flex justify-between mb-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`flex-1 h-1 mx-1 rounded-full transition-all ${i + 1 <= currentStep ? 'bg-purple-600' : 'bg-neutral-800'}`} />
        ))}
      </div>
      <div className="text-xs text-neutral-500">{stepsTitles[currentStep - 1]}</div>
    </div>
  );
}

function StepOne({ form, onChange, errors }: { form: FormData; onChange: any; errors: any }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Company Name</label>
        <input type="text" value={form.companyName} onChange={e => onChange('companyName', e.target.value)} placeholder="Enter your company or idea name" className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors" />
        {errors.companyName && <p className="mt-2 text-sm text-red-500">{errors.companyName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Contact Email</label>
        <input type="email" value={form.contactEmail} onChange={e => onChange('contactEmail', e.target.value)} placeholder="your.email@company.com" className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors" />
        {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Industry</label>
        <select value={form.industry} onChange={e => onChange('industry', e.target.value)} className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors cursor-pointer">
          <option value="">Select an industry</option>
          <option value="tech">Technology / SaaS</option>
          <option value="finance">Finance / FinTech</option>
          <option value="healthcare">Healthcare</option>
          <option value="retail">Retail / E-Commerce</option>
          <option value="other">Other</option>
        </select>
        {errors.industry && <p className="mt-2 text-sm text-red-500">{errors.industry}</p>}
      </div>
    </div>
  );
}

function StepTwo({ form, onChange, errors }: { form: FormData; onChange: any; errors: any }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">What is the main thing you want users to achieve on your platform?</label>
        <textarea value={form.mainGoal} onChange={e => onChange('mainGoal', e.target.value)} placeholder="e.g., I want people to be able to order fresh catering platters and pick a delivery time slot directly on the site." rows={4} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors resize-none" />
        {errors.mainGoal && <p className="mt-2 text-sm text-red-500">{errors.mainGoal}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Who is your target audience?</label>
        <input type="text" value={form.audience} onChange={e => onChange('audience', e.target.value)} placeholder="e.g., Local offices, event planner companies, busy parents" className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">How do you plan to make money or extract value from this platform?</label>
        <select value={form.monetization} onChange={e => onChange('monetization', e.target.value)} className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors cursor-pointer">
          <option value="">Select a method</option>
          <option value="e-commerce">One-time standard purchases / E-commerce sales</option>
          <option value="subscription">Monthly or annual recurring subscriptions</option>
          <option value="free">Completely free / Educational or informational profile page</option>
          <option value="freemium">Free to access, but with options to pay for upgrades</option>
        </select>
      </div>
    </div>
  );
}

function StepThree({ form, onChange, setPlatform, setTimeline }: { form: FormData; onChange: any; setPlatform: any; setTimeline: any }) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">Ideal Project Delivery Timeline</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { value: 'urgent', label: '⚡ Urgent', desc: 'As soon as possible (1-2 weeks)' },
            { value: 'standard', label: '🚀 Standard', desc: 'Within a month (4 weeks)' },
            { value: 'flexible', label: '📅 Flexible', desc: '2-3 months or more' },
          ].map(opt => (
            <button key={opt.value} type="button" onClick={() => setTimeline(opt.value)} className={`rounded-2xl border p-4 text-left transition-all ${form.timeline === opt.value ? 'border-purple-500 bg-purple-600/15' : 'border-neutral-800 bg-neutral-900 hover:border-purple-500/60'}`}>
              <div className="text-sm font-semibold text-white">{opt.label}</div>
              <div className="mt-1 text-xs text-neutral-400">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">Target Platform Type</label>
        <div className="flex gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-2">
          {['web', 'mobile', 'both'].map(option => (
            <button key={option} type="button" onClick={() => setPlatform(option)} className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition ${form.platform === option ? 'border-purple-500 bg-purple-600/15 text-white' : 'border-transparent text-neutral-300 hover:border-purple-500/40'}`}>{option.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Preferred Brand Look & Feel</label>
        <select value={form.aesthetic} onChange={e => onChange('aesthetic', e.target.value)} className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors cursor-pointer">
          <option value="">Select an aesthetic</option>
          <option value="Minimalist Dark">Minimalist Dark / Futuristic</option>
          <option value="Bright & Playful">Bright, Energetic & Friendly</option>
          <option value="Corporate Clean">Corporate, Secure & Professional</option>
        </select>
      </div>
    </div>
  );
}

function StepFour({ form, onChange, toggleFeature }: { form: FormData; onChange: any; toggleFeature: any }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/10 text-xs text-purple-300">
        ✨ <strong>Optional Step:</strong> If you are unsure about the choices below, you can leave them blank! The Noluforge system engine will automatically architect the best options for you based on your ideas from the previous steps.
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">Do you know if you need any specific structural features?</label>
        <div className="grid gap-3 sm:grid-cols-2">
          {['Authentication', 'Payment Integration', 'Database Storage', 'Real-time Dashboard'].map(option => (
            <button key={option} type="button" onClick={() => toggleFeature(option)} className={`rounded-xl border p-4 text-left transition-all ${form.features.includes(option) ? 'border-purple-500 bg-purple-600/15' : 'border-neutral-800 bg-neutral-900'}`}>
              <div className="text-sm font-semibold text-white">{option}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">List any external software or integrations you already use or want linked:</label>
        <textarea value={form.integrations} onChange={e => onChange('integrations', e.target.value)} placeholder="e.g., Stripe, WhatsApp Business, Google Sheets, QuickBooks" rows={3} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors resize-none" />
      </div>
    </div>
  );
}