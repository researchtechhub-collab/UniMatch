// Processing Step - Shows loading animation while generating recommendations
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { Brain, Search, Filter, Sparkles } from 'lucide-react';

interface ProcessingStepProps {
  onComplete: () => void;
}

const processingMessages = [
  { text: 'Analyzing your academic profile...', icon: <Brain className="w-5 h-5" /> },
  { text: 'Searching through universities...', icon: <Search className="w-5 h-5" /> },
  { text: 'Matching programs with your interests...', icon: <Filter className="w-5 h-5" /> },
  { text: 'Calculating match scores...', icon: <Sparkles className="w-5 h-5" /> },
  { text: 'Generating personalized recommendations...', icon: <Brain className="w-5 h-5" /> }
];

export function ProcessingStep({ onComplete }: ProcessingStepProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  useEffect(() => {
    // Simulate processing with progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    
    // Rotate messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % processingMessages.length);
    }, 1000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);
  
  const currentMessage = processingMessages[currentMessageIndex];
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-12 h-12 text-primary" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute -top-1 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
              <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-primary/60 rounded-full transform -translate-x-1/2" />
            </div>
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Finding Your Perfect Match</h2>
            <p className="text-muted-foreground">
              Our AI is analyzing hundreds of programs to find the best fit for you
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-right">{progress}%</p>
          </div>
          
          {/* Current Activity */}
          <div className="flex items-center gap-3 text-primary">
            {currentMessage.icon}
            <span className="font-medium animate-pulse">{currentMessage.text}</span>
          </div>
          
          {/* Fun Facts */}
          <div className="bg-muted p-4 rounded-lg max-w-md">
            <p className="text-sm text-muted-foreground">
              <strong>Did you know?</strong> We analyze over 10 factors including 
              tuition fees, GPA requirements, location, UGC compliance, and campus 
              facilities to find your best matches.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
