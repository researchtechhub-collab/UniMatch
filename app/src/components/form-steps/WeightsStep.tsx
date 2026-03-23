// Weight Preferences Step - Student Profile Form
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings2, Wallet, GraduationCap, MapPin, Award, Building2, Star } from 'lucide-react';
import type { ScoringWeights } from '@/types';
import { DEFAULT_WEIGHTS } from '@/types';

interface WeightsStepProps {
  data: ScoringWeights;
  onUpdate: (weights: ScoringWeights) => void;
  onNext: () => void;
  onBack: () => void;
}

interface WeightConfig {
  key: keyof ScoringWeights;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const weightConfigs: WeightConfig[] = [
  {
    key: 'affordability',
    label: 'Affordability',
    description: 'How important is staying within your budget?',
    icon: <Wallet className="w-5 h-5" />,
    color: 'bg-green-500'
  },
  {
    key: 'gpaFit',
    label: 'GPA Requirements',
    description: 'How important is meeting GPA requirements comfortably?',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'bg-blue-500'
  },
  {
    key: 'location',
    label: 'Location',
    description: 'How important is being in your preferred location?',
    icon: <MapPin className="w-5 h-5" />,
    color: 'bg-orange-500'
  },
  {
    key: 'quality',
    label: 'Academic Quality',
    description: 'How important is academic reputation and UGC status?',
    icon: <Award className="w-5 h-5" />,
    color: 'bg-purple-500'
  },
  {
    key: 'facilities',
    label: 'Facilities',
    description: 'How important are campus facilities and housing?',
    icon: <Building2 className="w-5 h-5" />,
    color: 'bg-cyan-500'
  },
  {
    key: 'reputation',
    label: 'University Reputation',
    description: 'How important is national ranking and prestige?',
    icon: <Star className="w-5 h-5" />,
    color: 'bg-yellow-500'
  }
];

export function WeightsStep({ data, onUpdate, onNext, onBack }: WeightsStepProps) {
  const [localWeights, setLocalWeights] = useState<ScoringWeights>(data);
  const [useDefaults, setUseDefaults] = useState(false);
  
  const handleWeightChange = (key: keyof ScoringWeights, value: number[]) => {
    const newWeights = { ...localWeights, [key]: value[0] };
    setLocalWeights(newWeights);
    onUpdate(newWeights);
  };
  
  const handleReset = () => {
    setLocalWeights(DEFAULT_WEIGHTS);
    onUpdate(DEFAULT_WEIGHTS);
    setUseDefaults(false);
  };
  
  const handleUseDefaults = () => {
    setLocalWeights(DEFAULT_WEIGHTS);
    onUpdate(DEFAULT_WEIGHTS);
    setUseDefaults(true);
  };
  
  const totalWeight = Object.values(localWeights).reduce((a, b) => a + b, 0);
  const isBalanced = totalWeight === 100;
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Settings2 className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Customize Your Preferences</CardTitle>
        <CardDescription>
          Adjust how important each factor is for your university search
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Default Options */}
        <div className="flex gap-3 justify-center">
          <Button
            variant={useDefaults ? "default" : "outline"}
            onClick={handleUseDefaults}
            size="sm"
          >
            Use Default Weights
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            size="sm"
          >
            Reset to Defaults
          </Button>
        </div>
        
        {/* Weight Sliders */}
        <div className="space-y-6">
          {weightConfigs.map((config) => (
            <div key={config.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${config.color} text-white`}>
                    {config.icon}
                  </div>
                  <div>
                    <Label className="text-base font-medium">{config.label}</Label>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary">
                  {localWeights[config.key]}%
                </span>
              </div>
              <Slider
                value={[localWeights[config.key]]}
                onValueChange={(value) => handleWeightChange(config.key, value)}
                max={50}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          ))}
        </div>
        
        {/* Total Weight Indicator */}
        <div className={`p-4 rounded-lg ${isBalanced ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Weight:</span>
            <span className={`text-lg font-bold ${isBalanced ? 'text-green-600' : 'text-yellow-600'}`}>
              {totalWeight}%
            </span>
          </div>
          {!isBalanced && (
            <p className="text-sm text-yellow-700 mt-1">
              {totalWeight > 100 
                ? 'Total exceeds 100%. The weights will be normalized automatically.' 
                : 'Total is less than 100%. Consider increasing some weights.'}
            </p>
          )}
        </div>
        
        {/* Info Box */}
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>How this works:</strong> These weights determine how we rank universities. 
            Higher weights mean that factor has more influence on your match scores. 
            Don't worry about getting it perfect - you can always adjust and re-run your search!
          </p>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} size="lg">
            Back
          </Button>
          <Button onClick={onNext} size="lg" className="px-8">
            Find My Universities
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
