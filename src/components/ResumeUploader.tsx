
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, User, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CandidateInfo {
  name: string;
  email: string;
  resume: File;
}

interface ResumeUploaderProps {
  selectedJobId: string;
  onAnalysisComplete: (data: any) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const ResumeUploader = ({ selectedJobId, onAnalysisComplete, isAnalyzing, setIsAnalyzing }: ResumeUploaderProps) => {
  const [candidates, setCandidates] = useState<CandidateInfo[]>([]);
  const [currentName, setCurrentName] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (!currentName || !currentEmail) {
      toast({
        title: "Missing Information",
        description: "Please enter candidate name and email before uploading",
        variant: "destructive",
      });
      return;
    }

    if (!currentEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    const newCandidates: CandidateInfo[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === "application/pdf") {
        newCandidates.push({
          name: currentName,
          email: currentEmail,
          resume: file,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF file`,
          variant: "destructive",
        });
      }
    });

    if (newCandidates.length > 0) {
      setCandidates([...candidates, ...newCandidates]);
      setCurrentName("");
      setCurrentEmail("");
      
      toast({
        title: "Resumes uploaded",
        description: `${newCandidates.length} resume(s) added successfully`,
      });
    }

    // Clear the file input
    event.target.value = "";
  };

  const removeCandidate = (index: number) => {
    const updated = candidates.filter((_, i) => i !== index);
    setCandidates(updated);
    
    toast({
      title: "Resume removed",
      description: "Candidate has been removed from the list",
    });
  };

  const handleAnalysis = async () => {
    if (!selectedJobId) {
      toast({
        title: "No Job Selected",
        description: "Please select a job description first",
        variant: "destructive",
      });
      return;
    }

    if (candidates.length === 0) {
      toast({
        title: "No Resumes",
        description: "Please upload at least one resume",
        variant: "destructive",
      });
      return;
    }

    // Get the selected job from localStorage
    const savedJobs = localStorage.getItem("jobDescriptions");
    if (!savedJobs) {
      toast({
        title: "Job Not Found",
        description: "Selected job description not found",
        variant: "destructive",
      });
      return;
    }

    const jobs = JSON.parse(savedJobs);
    const selectedJob = jobs.find((job: any) => job.id === selectedJobId);

    if (!selectedJob) {
      toast({
        title: "Job Not Found",
        description: "Selected job description not found",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Prepare FormData for API call
      const formData = new FormData();
      formData.append('job_title', selectedJob.title);
      formData.append('jd_file', selectedJob.file);
      
      // Add all resume files
      candidates.forEach((candidate) => {
        formData.append('resume_files', candidate.resume);
      });

      console.log("Starting analysis for job:", selectedJob.title);
      console.log("Number of candidates:", candidates.length);

      // Make API call
      const response = await fetch('http://localhost:8001/evaluate-candidates/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Analysis result:", result);

      // Add candidate names and emails to the result
      if (result.candidates) {
        result.candidates = result.candidates.map((candidate: any, index: number) => ({
          ...candidate,
          candidate_name: candidates[index]?.name || 'Unknown',
          candidate_email: candidates[index]?.email || 'Unknown',
        }));
      }

      onAnalysisComplete(result);
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${candidates.length} candidates`,
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resumes. Please check if the API server is running.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
        <div>
          <Label htmlFor="candidate-name" className="text-sm font-medium text-gray-700">
            Candidate Name
          </Label>
          <Input
            id="candidate-name"
            placeholder="Enter full name..."
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="candidate-email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <Input
            id="candidate-email"
            type="email"
            placeholder="Enter email..."
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Upload Resume(s)
          </Label>
          <div className="mt-1">
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="resume-upload"
            />
            <Button
              onClick={() => document.getElementById("resume-upload")?.click()}
              disabled={!currentName || !currentEmail}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload PDF Resume(s)
            </Button>
          </div>
        </div>
      </div>

      {/* Status Info */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Job Selected:</span>
            {selectedJobId ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Select Job First
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-green-600" />
            <span className="font-medium">Candidates:</span>
            <Badge variant="secondary">
              {candidates.length} uploaded
            </Badge>
          </div>
        </div>

        <Button
          onClick={handleAnalysis}
          disabled={!selectedJobId || candidates.length === 0 || isAnalyzing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Start Analysis
            </>
          )}
        </Button>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                <span className="font-medium text-purple-800">
                  Analyzing {candidates.length} candidates...
                </span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-sm text-purple-700">
                Please wait while we process resumes and match them against the job requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates List */}
      {candidates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <User className="h-5 w-5 mr-2 text-green-600" />
            Uploaded Candidates ({candidates.length})
          </h3>
          
          <div className="grid gap-3">
            {candidates.map((candidate, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{candidate.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {candidate.email}
                        </span>
                        <span>{candidate.resume.name}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCandidate(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {candidates.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No Candidates Yet</h4>
          <p className="text-gray-500">Add candidate information and upload resumes to begin</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
