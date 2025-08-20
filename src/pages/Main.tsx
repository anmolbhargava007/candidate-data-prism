import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Users, BarChart3, Briefcase, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import JobDescriptionManager from "@/components/JobDescriptionManager";
import ResumeUploader from "@/components/ResumeUploader";
import AnalysisResults from "@/components/AnalysisResults";

const Main = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

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
            <div className="flex items-center space-x-4">
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
              
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-lg z-50" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm text-gray-900">
                        {user?.user_name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.user_email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-gray-100 text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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