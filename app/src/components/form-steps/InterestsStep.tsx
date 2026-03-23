// Academic Interests Step - Student Profile Form
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Lightbulb, Target } from 'lucide-react';
import { FACULTY_OPTIONS } from '@/types';
import type { Faculty } from '@/types';

interface InterestsStepProps {
  data: {
    preferredFaculties?: Faculty[];
  };
  onUpdate: (updates: { preferredFaculties?: Faculty[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InterestsStep({ data, onUpdate, onNext, onBack }: InterestsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const toggleFaculty = (faculty: Faculty) => {
    const currentFaculties = data.preferredFaculties || [];
    if (currentFaculties.includes(faculty)) {
      onUpdate({
        preferredFaculties: currentFaculties.filter(f => f !== faculty)
      });
    } else {
      onUpdate({
        preferredFaculties: [...currentFaculties, faculty]
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.preferredFaculties || data.preferredFaculties.length === 0) {
      newErrors.preferredFaculties = 'Please select at least one faculty/field of interest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };
  
  // Faculty descriptions for better context
  const facultyDescriptions: Record<Faculty, string> = {
    engineering: 'Computer Science, Electrical, Civil, Mechanical, etc.',
    business: 'Management, Marketing, Finance, Accounting, etc.',
    science: 'Physics, Chemistry, Mathematics, Biology, etc.',
    arts: 'English, History, Philosophy, Languages, etc.',
    social_science: 'Economics, Sociology, Psychology, Political Science, etc.',
    law: 'LLB, Legal Studies',
    medicine: 'MBBS, Nursing, Public Health, etc.',
    pharmacy: 'Pharmaceutical Sciences',
    architecture: 'Architecture, Interior Design, etc.'
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Academic Interests</CardTitle>
        <CardDescription>
          Select the fields of study you're interested in
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Faculty Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Which faculties/fields interest you? (Select all that apply)
          </Label>
          <p className="text-sm text-muted-foreground">
            You can select multiple options. We'll show you relevant programs from these fields.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {FACULTY_OPTIONS.map((faculty) => (
              <div
                key={faculty.value}
                className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  data.preferredFaculties?.includes(faculty.value)
                    ? 'border-primary bg-primary/5'
                    : 'border hover:border-primary/50'
                }`}
                onClick={() => toggleFaculty(faculty.value)}
              >
                <Checkbox
                  checked={data.preferredFaculties?.includes(faculty.value)}
                  onCheckedChange={() => toggleFaculty(faculty.value)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label className="text-base font-medium cursor-pointer">
                    {faculty.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {facultyDescriptions[faculty.value]}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {errors.preferredFaculties && (
            <p className="text-sm text-destructive">{errors.preferredFaculties}</p>
          )}
        </div>
        
        {/* Selected Faculties Summary */}
        {data.preferredFaculties && data.preferredFaculties.length > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-medium">Your Selections:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.preferredFaculties.map(facultyValue => {
                const faculty = FACULTY_OPTIONS.find(f => f.value === facultyValue);
                return faculty ? (
                  <span 
                    key={facultyValue}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {faculty.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
        
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
