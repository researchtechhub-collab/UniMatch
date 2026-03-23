// Results Step - Displays recommendation results
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  RotateCcw, 
  Filter, 
  Search, 
  TrendingUp, 
  Download
} from 'lucide-react';
import { RecommendationCard } from '@/components/RecommendationCard';
import { useAppStore } from '@/store/appStore';

type SortOption = 'match' | 'fees-low' | 'fees-high' | 'ranking';

interface ResultsStepProps {
  onRestart: () => void;
}

export function ResultsStep({ onRestart }: ResultsStepProps) {
  const { 
    recommendations, 
    savedRecommendations, 
    toggleSaveRecommendation,
    studentProfile 
  } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort recommendations
  const filteredRecommendations = useMemo(() => {
    let result = [...recommendations];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.university.name.toLowerCase().includes(term) ||
        r.program.name.toLowerCase().includes(term) ||
        r.university.district.toLowerCase().includes(term)
      );
    }
    
    // Apply minimum score filter
    result = result.filter(r => r.scores.overall >= minScore);
    
    // Apply sorting
    switch (sortBy) {
      case 'match':
        result.sort((a, b) => b.scores.overall - a.scores.overall);
        break;
      case 'fees-low':
        result.sort((a, b) => a.program.totalTuitionFee - b.program.totalTuitionFee);
        break;
      case 'fees-high':
        result.sort((a, b) => b.program.totalTuitionFee - a.program.totalTuitionFee);
        break;
      case 'ranking':
        result.sort((a, b) => (a.university.rankingNational || 999) - (b.university.rankingNational || 999));
        break;
    }
    
    return result;
  }, [recommendations, searchTerm, minScore, sortBy]);
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (recommendations.length === 0) return null;
    
    const scores = recommendations.map(r => r.scores.overall);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highMatches = recommendations.filter(r => r.scores.overall >= 70).length;
    const affordableMatches = recommendations.filter(r => 
      studentProfile.maxBudgetTotal && 
      r.program.totalTuitionFee <= studentProfile.maxBudgetTotal
    ).length;
    
    return {
      totalMatches: recommendations.length,
      averageScore: avgScore,
      highMatches,
      affordableMatches,
      topUniversity: recommendations[0]?.university.name
    };
  }, [recommendations, studentProfile.maxBudgetTotal]);
  
  const handleSaveToggle = (recommendationId: string) => {
    toggleSaveRecommendation(recommendationId);
  };
  
  const handleExport = () => {
    // Export recommendations to JSON
    const dataStr = JSON.stringify(recommendations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'university-recommendations.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  if (recommendations.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Recommendations Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any matching universities with your current criteria. 
            Try adjusting your preferences.
          </p>
          <Button onClick={onRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Your Personalized Recommendations</CardTitle>
          <CardDescription>
            Based on your profile, we found {stats?.totalMatches} matching universities
          </CardDescription>
        </CardHeader>
        
        {/* Statistics */}
        {stats && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{stats.totalMatches}</p>
                <p className="text-sm text-muted-foreground">Total Matches</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{stats.averageScore}</p>
                <p className="text-sm text-muted-foreground">Avg. Match Score</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.highMatches}</p>
                <p className="text-sm text-muted-foreground">High Matches (70+)</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.affordableMatches}</p>
                <p className="text-sm text-muted-foreground">Within Budget</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search universities or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="fees-low">Fees: Low to High</SelectItem>
                <SelectItem value="fees-high">Fees: High to Low</SelectItem>
                <SelectItem value="ranking">Ranking</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter Toggle */}
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-primary/10' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            {/* Export */}
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div>
                <Label className="flex items-center justify-between">
                  <span>Minimum Match Score: {minScore}</span>
                </Label>
                <Slider
                  value={[minScore]}
                  onValueChange={(v) => setMinScore(v[0])}
                  max={100}
                  step={10}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredRecommendations.length} of {recommendations.length} recommendations
        </p>
        {savedRecommendations.length > 0 && (
          <Badge variant="secondary">
            {savedRecommendations.length} Saved
          </Badge>
        )}
      </div>
      
      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecommendations.map((recommendation, index) => (
          <RecommendationCard
            key={`${recommendation.university.id}-${recommendation.program.id}`}
            recommendation={recommendation}
            isSaved={savedRecommendations.includes(`${recommendation.university.id}-${recommendation.program.id}`)}
            onToggleSave={() => handleSaveToggle(`${recommendation.university.id}-${recommendation.program.id}`)}
            rank={index + 1}
          />
        ))}
      </div>
      
      {/* No Results After Filtering */}
      {filteredRecommendations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No results match your filters</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
      
      {/* Footer Actions */}
      <div className="flex justify-center gap-4 pt-8">
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Start New Search
        </Button>
      </div>
    </div>
  );
}
