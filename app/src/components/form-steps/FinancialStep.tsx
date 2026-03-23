// Financial Constraints Step - Student Profile Form
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Wallet, PiggyBank, GraduationCap } from 'lucide-react';
import { BUDGET_RANGES } from '@/types';

interface FinancialStepProps {
  data: {
    maxBudgetTotal?: number;
    requiresScholarship?: boolean;
  };
  onUpdate: (updates: { maxBudgetTotal?: number; requiresScholarship?: boolean }) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FinancialStep({ data, onUpdate, onNext, onBack }: FinancialStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.maxBudgetTotal) {
      newErrors.maxBudgetTotal = 'Please select your budget range';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Financial Constraints</CardTitle>
        <CardDescription>
          Help us find universities that fit your budget and financial situation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Budget Range Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <PiggyBank className="w-4 h-4" />
            What is your total budget for the entire program?
          </Label>
          <p className="text-sm text-muted-foreground">
            Include tuition fees, admission fees, and other academic expenses
          </p>
          <RadioGroup
            value={data.maxBudgetTotal?.toString()}
            onValueChange={(value) => onUpdate({ maxBudgetTotal: parseInt(value) })}
            className="grid grid-cols-1 gap-3"
          >
            {BUDGET_RANGES.map((budget) => (
              <div key={budget.value}>
                <RadioGroupItem
                  value={budget.value.toString()}
                  id={`budget-${budget.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`budget-${budget.value}`}
                  className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <span className="font-medium">{budget.label}</span>
                  {data.maxBudgetTotal === budget.value && (
                    <span className="text-primary text-sm">Selected</span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.maxBudgetTotal && (
            <p className="text-sm text-destructive">{errors.maxBudgetTotal}</p>
          )}
        </div>
        
        {/* Scholarship Requirement */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Do you need a scholarship or financial aid?
          </Label>
          <div className="flex items-start space-x-3 p-4 border rounded-lg">
            <Checkbox
              id="scholarship"
              checked={data.requiresScholarship}
              onCheckedChange={(checked) => onUpdate({ requiresScholarship: checked as boolean })}
            />
            <div className="space-y-1">
              <Label
                htmlFor="scholarship"
                className="text-sm font-medium cursor-pointer"
              >
                Yes, I need scholarship/financial aid
              </Label>
              <p className="text-sm text-muted-foreground">
                We'll prioritize universities with better scholarship opportunities
              </p>
            </div>
          </div>
        </div>
        
        {/* Info Box */}
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Total program cost includes tuition fees for the entire duration, 
            admission fees, semester fees, and other mandatory academic expenses. Living expenses 
            and housing costs are considered separately.
          </p>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} size="lg">
            Back
          </Button>
          <Button onClick={handleNext} size="lg" className="px-8">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
