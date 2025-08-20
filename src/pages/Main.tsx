import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, BarChart3, Briefcase } from "lucide-react";
import JobDescriptionManager from "@/components/JobDescriptionManager";
import ResumeUploader from "@/components/ResumeUploader";
import AnalysisResults from "@/components/AnalysisResults";

const Main = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-xl">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HR Recruitment Hub</h1>
                <p className="text-gray-600">AI-Powered Resume Analysis & Job Matching</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <FileText className="h-4 w-4 mr-1" />
                Smart Analysis
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Users className="h-4 w-4 mr-1" />
                Bulk Processing
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="job-descriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border">
            <TabsTrigger value="job-descriptions" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Job Descriptions</span>
            </TabsTrigger>
            <TabsTrigger value="resume-upload" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Resume Upload</span>
            </TabsTrigger>
            <TabsTrigger value="analysis-results" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analysis Results</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="job-descriptions" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Manage Job Descriptions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <JobDescriptionManager 
                  onJobSelect={setSelectedJobId}
                  selectedJobId={selectedJobId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume-upload" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Upload & Analyze Resumes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResumeUploader 
                  selectedJobId={selectedJobId}
                  onAnalysisComplete={setAnalysisData}
                  isAnalyzing={isAnalyzing}
                  setIsAnalyzing={setIsAnalyzing}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis-results" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Candidate Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <AnalysisResults 
                  analysisData={analysisData}
                  isAnalyzing={isAnalyzing}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Main;