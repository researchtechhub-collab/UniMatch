// Location Preferences Step - Student Profile Form
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Home, Car } from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LocationStepProps {
  data: {
    preferredDistricts?: string[];
    requiresHousing?: boolean;
  };
  onUpdate: (updates: { preferredDistricts?: string[]; requiresHousing?: boolean }) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LocationStep({ data, onUpdate, onNext, onBack }: LocationStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const toggleDistrict = (district: string) => {
    const currentDistricts = data.preferredDistricts || [];
    if (currentDistricts.includes(district)) {
      onUpdate({
        preferredDistricts: currentDistricts.filter(d => d !== district)
      });
    } else {
      onUpdate({
        preferredDistricts: [...currentDistricts, district]
      });
    }
  };
  
  const filteredDistricts = BANGLADESH_DISTRICTS.filter(d => 
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Location Preferences</CardTitle>
        <CardDescription>
          Select your preferred locations for studying
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* District Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Preferred Districts (Select all that apply)
          </Label>
          <p className="text-sm text-muted-foreground">
            We'll prioritize universities in these locations
          </p>
          
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          {/* Selected Districts Display */}
          {data.preferredDistricts && data.preferredDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.preferredDistricts.map(district => (
                <span 
                  key={district}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {district}
                  <button
                    onClick={() => toggleDistrict(district)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* Districts List */}
          <ScrollArea className="h-64 border rounded-lg p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredDistricts.map((district) => (
                <div key={district} className="flex items-center space-x-2">
                  <Checkbox
                    id={`district-${district}`}
                    checked={data.preferredDistricts?.includes(district)}
                    onCheckedChange={() => toggleDistrict(district)}
                  />
                  <Label
                    htmlFor={`district-${district}`}
                    className="text-sm cursor-pointer truncate"
                  >
                    {district}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Housing Requirement */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Home className="w-4 h-4" />
            Do you need on-campus housing?
          </Label>
          <div className="flex items-start space-x-3 p-4 border rounded-lg">
            <Checkbox
              id="housing"
              checked={data.requiresHousing}
              onCheckedChange={(checked) => onUpdate({ requiresHousing: checked as boolean })}
            />
            <div className="space-y-1">
              <Label
                htmlFor="housing"
                className="text-sm font-medium cursor-pointer"
              >
                Yes, I need on-campus housing/hostel facilities
              </Label>
              <p className="text-sm text-muted-foreground">
                We'll only recommend universities that provide housing facilities
              </p>
            </div>
          </div>
        </div>
        
        {/* Info Box */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Car className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> If you plan to commute from home, select districts near your 
              residence. Most top private universities are located in Dhaka and nearby areas.
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} size="lg">
            Back
          </Button>
          <Button onClick={onNext} size="lg" className="px-8">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
