// Main App Component for UniMatch Bangladesh
import { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Heart, 
  Shield, 
  Sparkles,
  Github,
  Mail
} from 'lucide-react';
import { AcademicStep } from '@/components/form-steps/AcademicStep';
import { FinancialStep } from '@/components/form-steps/FinancialStep';
import { LocationStep } from '@/components/form-steps/LocationStep';
import { InterestsStep } from '@/components/form-steps/InterestsStep';
import { WeightsStep } from '@/components/form-steps/WeightsStep';
import { ProcessingStep } from '@/components/form-steps/ProcessingStep';
import { ResultsStep } from '@/components/form-steps/ResultsStep';
import { useAppStore } from '@/store/appStore';
import { generateRecommendations } from '@/lib/recommendationEngine';
import type { FormStep, StudentProfile } from '@/types';
import { toast } from 'sonner';

// Progress indicator component
function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = ((currentStep) / totalSteps) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// Hero section component
function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">UniMatch Bangladesh</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
        </div>
      </header>
      
      {/* Hero Content */}
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered University Matching
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Find Your Perfect<br />
                <span className="text-primary">University Match</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Struggling to choose the right private university after HSC? Our AI-powered 
                platform analyzes your profile and recommends the best-matched universities 
                in Bangladesh based on your GPA, budget, and preferences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={onStart} className="px-8">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Find My Universities
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Get personalized university recommendations in just a few simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: <GraduationCap className="w-8 h-8" />,
                  title: 'Share Your Profile',
                  description: 'Tell us about your HSC GPA, budget, preferred locations, and academic interests'
                },
                {
                  icon: <Sparkles className="w-8 h-8" />,
                  title: 'AI Analysis',
                  description: 'Our AI analyzes your profile against 100+ universities and programs'
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: 'Get Matches',
                  description: 'Receive personalized recommendations with match scores (0-100)'
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: 'Make Decision',
                  description: 'Compare pros/cons, fees, and requirements to make an informed choice'
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose UniMatch?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We help you make the best decision for your future
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'UGC Compliant',
                  description: 'We only recommend universities approved by the University Grants Commission. Red-flagged institutions are automatically excluded.',
                  icon: <Shield className="w-6 h-6" />
                },
                {
                  title: 'Completely Free',
                  description: 'Our service is 100% free for students. We never charge for recommendations or access to university information.',
                  icon: <Heart className="w-6 h-6" />
                },
                {
                  title: 'AI-Powered Matching',
                  description: 'Our algorithm considers 10+ factors including fees, GPA requirements, location, facilities, and university reputation.',
                  icon: <Sparkles className="w-6 h-6" />
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 border rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Match?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join thousands of students who have found their perfect university through UniMatch
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={onStart}
              className="px-8"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">UniMatch Bangladesh</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 UniMatch Bangladesh. All rights reserved.</p>
            <p className="mt-1">Helping Bangladeshi students make informed university choices.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main form wizard component
function FormWizard() {
  const { 
    currentStep, 
    setCurrentStep, 
    studentProfile, 
    updateStudentProfile,
    setRecommendations 
  } = useAppStore();
  
  const steps: FormStep[] = ['academic', 'financial', 'location', 'interests', 'weights', 'processing', 'results'];
  const currentStepIndex = steps.indexOf(currentStep);
  
  const handleNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  }, [currentStepIndex, setCurrentStep]);
  
  const handleBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  }, [currentStepIndex, setCurrentStep]);
  
  const handleProcessingComplete = useCallback(() => {
    // Generate recommendations
    const profile: StudentProfile = {
      hscGpa: studentProfile.hscGpa!,
      hscGroup: studentProfile.hscGroup!,
      hscPassingYear: studentProfile.hscPassingYear,
      sscGpa: studentProfile.sscGpa,
      maxBudgetTotal: studentProfile.maxBudgetTotal,
      preferredDistricts: studentProfile.preferredDistricts,
      requiresHousing: studentProfile.requiresHousing || false,
      preferredFaculties: studentProfile.preferredFaculties,
      requiresScholarship: studentProfile.requiresScholarship || false,
      weightAffordability: studentProfile.weightAffordability || 25,
      weightGpaFit: studentProfile.weightGpaFit || 20,
      weightLocation: studentProfile.weightLocation || 15,
      weightQuality: studentProfile.weightQuality || 20,
      weightFacilities: studentProfile.weightFacilities || 10,
      weightReputation: studentProfile.weightReputation || 10
    };
    
    try {
      const recommendations = generateRecommendations(profile, 20);
      setRecommendations(recommendations);
      setCurrentStep('results');
      toast.success(`Found ${recommendations.length} matching universities!`);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    }
  }, [studentProfile, setRecommendations, setCurrentStep]);
  
  const handleRestart = useCallback(() => {
    setCurrentStep('academic');
    updateStudentProfile({
      hscGpa: undefined,
      hscGroup: undefined,
      hscPassingYear: undefined,
      sscGpa: undefined,
      maxBudgetTotal: undefined,
      preferredDistricts: [],
      requiresHousing: false,
      preferredFaculties: [],
      requiresScholarship: false
    });
    setRecommendations([]);
  }, [setCurrentStep, updateStudentProfile, setRecommendations]);
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'academic':
        return (
          <AcademicStep
            data={{
              hscGpa: studentProfile.hscGpa,
              hscGroup: studentProfile.hscGroup,
              hscPassingYear: studentProfile.hscPassingYear,
              sscGpa: studentProfile.sscGpa
            }}
            onUpdate={(updates) => updateStudentProfile(updates)}
            onNext={handleNext}
          />
        );
      case 'financial':
        return (
          <FinancialStep
            data={{
              maxBudgetTotal: studentProfile.maxBudgetTotal,
              requiresScholarship: studentProfile.requiresScholarship
            }}
            onUpdate={(updates) => updateStudentProfile(updates)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'location':
        return (
          <LocationStep
            data={{
              preferredDistricts: studentProfile.preferredDistricts,
              requiresHousing: studentProfile.requiresHousing
            }}
            onUpdate={(updates) => updateStudentProfile(updates)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'interests':
        return (
          <InterestsStep
            data={{
              preferredFaculties: studentProfile.preferredFaculties
            }}
            onUpdate={(updates) => updateStudentProfile(updates)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'weights':
        return (
          <WeightsStep
            data={{
              affordability: studentProfile.weightAffordability || 25,
              gpaFit: studentProfile.weightGpaFit || 20,
              location: studentProfile.weightLocation || 15,
              quality: studentProfile.weightQuality || 20,
              facilities: studentProfile.weightFacilities || 10,
              reputation: studentProfile.weightReputation || 10
            }}
            onUpdate={(weights) => updateStudentProfile({
              weightAffordability: weights.affordability,
              weightGpaFit: weights.gpaFit,
              weightLocation: weights.location,
              weightQuality: weights.quality,
              weightFacilities: weights.facilities,
              weightReputation: weights.reputation
            })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'processing':
        return <ProcessingStep onComplete={handleProcessingComplete} />;
      case 'results':
        return <ResultsStep onRestart={handleRestart} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleRestart}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">UniMatch Bangladesh</span>
          </div>
          {currentStep !== 'results' && currentStep !== 'processing' && (
            <Button variant="ghost" size="sm" onClick={handleRestart}>
              Start Over
            </Button>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentStep !== 'results' && currentStep !== 'processing' && (
          <ProgressIndicator 
            currentStep={currentStepIndex + 1} 
            totalSteps={steps.length - 2} 
          />
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Main App Component
function App() {
  const { currentStep, setCurrentStep, studentProfile, resetStudentProfile } = useAppStore();
  const [hasStarted, setHasStarted] = useState(false);
  
  // Clear any stale data on initial load
  useEffect(() => {
    // Check if we have partial data but user hasn't completed the flow
    const hasPartialData = studentProfile.hscGpa || studentProfile.hscGroup;
    const isOnInitialStep = currentStep === 'academic';
    
    // If we're on academic step with no data, stay on hero
    // If we're on academic step with data but hasn't explicitly started, reset
    if (isOnInitialStep && hasPartialData && !hasStarted) {
      resetStudentProfile();
    }
  }, []);
  
  const handleStart = () => {
    setHasStarted(true);
    setCurrentStep('academic');
  };
  
  // Show hero section if user hasn't explicitly started the form
  if (!hasStarted && currentStep === 'academic') {
    return (
      <>
        <HeroSection onStart={handleStart} />
        <Toaster position="top-center" />
      </>
    );
  }
  
  return (
    <>
      <FormWizard />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
