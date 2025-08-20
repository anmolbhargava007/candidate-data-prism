
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Star, Award, BookOpen, Briefcase, Target, TrendingUp, Loader2 } from "lucide-react";

interface AnalysisResultsProps {
  analysisData: any;
  isAnalyzing: boolean;
}

const AnalysisResults = ({ analysisData, isAnalyzing }: AnalysisResultsProps) => {
  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <h3 className="text-lg font-medium text-gray-800">Analyzing Candidates...</h3>
          <p className="text-gray-600">Please wait while we process the resumes</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-600 mb-2">No Analysis Results Yet</h4>
        <p className="text-gray-500">Upload resumes and run analysis to see results here</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Job Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Target className="h-5 w-5" />
            <span>Job Analysis Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{analysisData.job_title}</h3>
            <Badge className="bg-blue-100 text-blue-800">
              {analysisData.candidates?.length || 0} Candidates Analyzed
            </Badge>
          </div>
          
          {analysisData.job_requirements && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  Experience Required
                </h4>
                <Badge variant="secondary">
                  {analysisData.job_requirements.experience_required}+ years
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Level
                </h4>
                <Badge variant="secondary">
                  {analysisData.job_requirements.level}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Top Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {analysisData.job_requirements.required_skills?.slice(0, 3).map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidates Results */}
      {analysisData.candidates && analysisData.candidates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <User className="h-5 w-5 mr-2 text-green-600" />
            Candidate Analysis Results
          </h3>

          <div className="grid gap-6">
            {analysisData.candidates.map((candidate: any, index: number) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {candidate.candidate_name || 'Unknown Candidate'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {candidate.candidate_email || 'No email provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.overall_rating?.score || 0)}`}>
                        <Star className="h-4 w-4 mr-1" />
                        {candidate.overall_rating?.score || 0}/10
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <Tabs defaultValue="scores" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="scores">Scores</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="recommendations">Insights</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="scores" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Overall Score */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall</span>
                            <span className="text-sm font-bold">{candidate.overall_rating?.score || 0}/10</span>
                          </div>
                          <Progress 
                            value={(candidate.overall_rating?.score || 0) * 10} 
                            className="h-2"
                          />
                        </div>
                        
                        {/* Skills Score */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Skills</span>
                            <span className="text-sm font-bold">{candidate.skills_rating?.score || 0}/10</span>
                          </div>
                          <Progress 
                            value={(candidate.skills_rating?.score || 0) * 10} 
                            className="h-2"
                          />
                        </div>
                        
                        {/* Education Score */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Education</span>
                            <span className="text-sm font-bold">{candidate.education_rating?.score || 0}/10</span>
                          </div>
                          <Progress 
                            value={(candidate.education_rating?.score || 0) * 10} 
                            className="h-2"
                          />
                        </div>
                        
                        {/* Experience Score */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Experience</span>
                            <span className="text-sm font-bold">{candidate.experience_rating?.score || 0}/10</span>
                          </div>
                          <Progress 
                            value={(candidate.experience_rating?.score || 0) * 10} 
                            className="h-2"
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-800">Overall Assessment</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {candidate.overall_rating?.reason || 'No detailed assessment available.'}
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="skills" className="space-y-4 mt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">Skills Assessment</h4>
                          <Badge className={getScoreColor(candidate.skills_rating?.score || 0)}>
                            {candidate.skills_rating?.score || 0}/10
                          </Badge>
                        </div>
                        
                        {candidate.parsed_skills && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-700 mb-2">Identified Skills</h5>
                            <p className="text-sm text-gray-600 whitespace-pre-line">
                              {candidate.parsed_skills}
                            </p>
                          </div>
                        )}
                        
                        {candidate.skills_rating?.reason && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Skills Analysis</h5>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {candidate.skills_rating.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="education" className="space-y-4 mt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">Education Assessment</h4>
                          <Badge className={getScoreColor(candidate.education_rating?.score || 0)}>
                            {candidate.education_rating?.score || 0}/10
                          </Badge>
                        </div>
                        
                        {candidate.parsed_education && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Educational Background
                            </h5>
                            <p className="text-sm text-gray-600 whitespace-pre-line">
                              {candidate.parsed_education}
                            </p>
                          </div>
                        )}
                        
                        {candidate.education_rating?.reason && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Education Analysis</h5>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {candidate.education_rating.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="recommendations" className="space-y-4 mt-6">
                      <div className="space-y-4">
                        {candidate.best_suited_roles && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              Best Suited Roles
                            </h5>
                            <p className="text-sm text-blue-700 leading-relaxed">
                              {candidate.best_suited_roles}
                            </p>
                          </div>
                        )}
                        
                        {candidate.parsed_experience && (
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h5 className="font-medium text-green-800 mb-2 flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              Experience Summary
                            </h5>
                            <p className="text-sm text-green-700 whitespace-pre-line">
                              {candidate.parsed_experience}
                            </p>
                          </div>
                        )}
                        
                        {candidate.experience_rating?.reason && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Experience Analysis</h5>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {candidate.experience_rating.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
