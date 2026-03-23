// Academic Background Step - Student Profile Form
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { HSC_GROUP_OPTIONS, GPA_RANGES } from '@/types';
import type { HSCGroup } from '@/types';

interface AcademicStepProps {
  data: {
    hscGpa?: number;
    hscGroup?: HSCGroup;
    hscPassingYear?: number;
    sscGpa?: number;
  };
  onUpdate: (updates: { hscGpa?: number; hscGroup?: HSCGroup; hscPassingYear?: number; sscGpa?: number }) => void;
  onNext: () => void;
}

export function AcademicStep({ data, onUpdate, onNext }: AcademicStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const currentYear = new Date().getFullYear();
  const passingYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.hscGpa) {
      newErrors.hscGpa = 'Please select your HSC GPA';
    }
    
    if (!data.hscGroup) {
      newErrors.hscGroup = 'Please select your HSC group';
    }
    
    if (!data.hscPassingYear) {
      newErrors.hscPassingYear = 'Please select your passing year';
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
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Academic Background</CardTitle>
        <CardDescription>
          Tell us about your educational qualifications to help us find the best matches
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* HSC GPA Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            What is your HSC GPA?
          </Label>
          <RadioGroup
            value={data.hscGpa?.toString()}
            onValueChange={(value) => onUpdate({ hscGpa: parseFloat(value) })}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {GPA_RANGES.map((gpa) => (
              <div key={gpa.value}>
                <RadioGroupItem
                  value={gpa.value.toString()}
                  id={`gpa-${gpa.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`gpa-${gpa.value}`}
                  className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  {gpa.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.hscGpa && (
            <p className="text-sm text-destructive">{errors.hscGpa}</p>
          )}
        </div>
        
        {/* HSC Group Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Which group did you study in HSC?
          </Label>
          <RadioGroup
            value={data.hscGroup}
            onValueChange={(value) => onUpdate({ hscGroup: value as HSCGroup })}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {HSC_GROUP_OPTIONS.map((group) => (
              <div key={group.value}>
                <RadioGroupItem
                  value={group.value}
                  id={`group-${group.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`group-${group.value}`}
                  className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  {group.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.hscGroup && (
            <p className="text-sm text-destructive">{errors.hscGroup}</p>
          )}
        </div>
        
        {/* HSC Passing Year */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            HSC Passing Year
          </Label>
          <RadioGroup
            value={data.hscPassingYear?.toString()}
            onValueChange={(value) => onUpdate({ hscPassingYear: parseInt(value) })}
            className="flex flex-wrap gap-3"
          >
            {passingYears.map((year) => (
              <div key={year}>
                <RadioGroupItem
                  value={year.toString()}
                  id={`year-${year}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`year-${year}`}
                  className="flex items-center justify-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  {year}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.hscPassingYear && (
            <p className="text-sm text-destructive">{errors.hscPassingYear}</p>
          )}
        </div>
        
        {/* SSC GPA (Optional) */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            SSC GPA (Optional)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="1"
            max="5"
            placeholder="Enter your SSC GPA (optional)"
            value={data.sscGpa || ''}
            onChange={(e) => onUpdate({ sscGpa: parseFloat(e.target.value) || undefined })}
            className="max-w-xs"
          />
          <p className="text-sm text-muted-foreground">
            This helps us better understand your academic consistency
          </p>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} size="lg" className="px-8">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
