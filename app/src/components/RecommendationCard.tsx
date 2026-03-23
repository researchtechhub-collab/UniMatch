// Recommendation Card Component - Displays a single university recommendation
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  GraduationCap, 
  Wallet, 
  Building2, 
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import type { Recommendation } from '@/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  isSaved: boolean;
  onToggleSave: () => void;
  rank: number;
}

// Get color based on match score
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-orange-600 bg-orange-50 border-orange-200';
}

// Get UGC status badge
function getUGCStatusBadge(status: string) {
  switch (status) {
    case 'green':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          UGC Approved
        </Badge>
      );
    case 'yellow':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          UGC Warning
        </Badge>
      );
    case 'red':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Not Recommended
        </Badge>
      );
    default:
      return null;
  }
}

export function RecommendationCard({ 
  recommendation, 
  isSaved, 
  onToggleSave,
  rank 
}: RecommendationCardProps) {
  const { university, program, scores, matchExplanation, pros, cons, ugcWarning } = recommendation;
  const [showDetails, setShowDetails] = useState(false);
  
  const scoreColorClass = getScoreColor(scores.overall);
  
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="secondary" className="text-lg px-3 py-1">
          #{rank}
        </Badge>
      </div>
      
      {/* Match Score Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 ${scoreColorClass}`}>
          <span className="text-2xl font-bold">{scores.overall}</span>
          <span className="text-xs">Match</span>
        </div>
      </div>
      
      {/* UGC Warning Banner */}
      {ugcWarning && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-3 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">{ugcWarning}</p>
        </div>
      )}
      
      <CardHeader className="pt-16 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{university.name}</CardTitle>
            <CardDescription className="text-base mt-1">
              {program.name} ({program.degreeType})
            </CardDescription>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {getUGCStatusBadge(university.ugcStatus)}
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {university.district}
          </Badge>
          {university.hasPermanentCampus && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Permanent Campus
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Wallet className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Fee</p>
            <p className="font-semibold">৳{program.totalTuitionFee.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <GraduationCap className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Min GPA</p>
            <p className="font-semibold">{program.minGpaRequirement || 'N/A'}</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Building2 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-semibold">{program.durationYears} Years</p>
          </div>
        </div>
        
        {/* Match Explanation */}
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm">{matchExplanation}</p>
          </div>
        </div>
        
        {/* Score Breakdown */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Match Score Breakdown:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Affordability</span>
              <div className="flex items-center gap-2">
                <Progress value={scores.affordability} className="w-16 h-2" />
                <span className="w-8 text-right">{scores.affordability}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">GPA Fit</span>
              <div className="flex items-center gap-2">
                <Progress value={scores.gpaFit} className="w-16 h-2" />
                <span className="w-8 text-right">{scores.gpaFit}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Location</span>
              <div className="flex items-center gap-2">
                <Progress value={scores.location} className="w-16 h-2" />
                <span className="w-8 text-right">{scores.location}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Quality</span>
              <div className="flex items-center gap-2">
                <Progress value={scores.quality} className="w-16 h-2" />
                <span className="w-8 text-right">{scores.quality}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pros & Cons Preview */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Pros
            </p>
            <ul className="space-y-1">
              {pros.slice(0, 2).map((pro, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-1">
                  <span className="text-green-500">+</span>
                  {pro}
                </li>
              ))}
              {pros.length > 2 && (
                <li className="text-sm text-muted-foreground">+ {pros.length - 2} more</li>
              )}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              Cons
            </p>
            <ul className="space-y-1">
              {cons.slice(0, 2).map((con, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-1">
                  <span className="text-red-500">-</span>
                  {con}
                </li>
              ))}
              {cons.length > 2 && (
                <li className="text-sm text-muted-foreground">+ {cons.length - 2} more</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{university.name}</DialogTitle>
              <DialogDescription>{program.name}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              {/* Full Details Content */}
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 ${scoreColorClass}`}>
                  <span className="text-3xl font-bold">{scores.overall}</span>
                  <span className="text-xs">Match</span>
                </div>
                <div>
                  <p className="font-medium">Overall Match Score</p>
                  <p className="text-sm text-muted-foreground">{matchExplanation}</p>
                </div>
              </div>
              
              {/* All Pros & Cons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Pros ({pros.length})
                  </p>
                  <ul className="space-y-2">
                    {pros.map((pro, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-500 font-bold">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-medium text-red-700 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Cons ({cons.length})
                  </p>
                  <ul className="space-y-2">
                    {cons.map((con, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-500 font-bold">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* University Details */}
              <div className="space-y-3">
                <h4 className="font-medium">University Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p>{university.address || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Website:</span>
                    <p>{university.website || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contact:</span>
                    <p>{university.contactPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Established:</span>
                    <p>{university.establishedYear || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Program Details */}
              <div className="space-y-3">
                <h4 className="font-medium">Program Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Credits:</span>
                    <p>{program.totalCredits || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Intake Capacity:</span>
                    <p>{program.intakeCapacity || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Per Credit Fee:</span>
                    <p>{program.perCreditFee ? `৳${program.perCreditFee}` : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Admission Fee:</span>
                    <p>{program.admissionFee ? `৳${program.admissionFee.toLocaleString()}` : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                {university.website && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(university.website, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                )}
                <Button 
                  variant={isSaved ? "default" : "outline"}
                  onClick={onToggleSave}
                  className="flex-1"
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant={isSaved ? "default" : "outline"}
          size="icon"
          onClick={onToggleSave}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
