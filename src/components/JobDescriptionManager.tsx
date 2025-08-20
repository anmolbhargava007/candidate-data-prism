
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Edit, Save, X, FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobDescription {
  id: string;
  title: string;
  file: File;
  uploadDate: string;
}

interface JobDescriptionManagerProps {
  onJobSelect: (jobId: string) => void;
  selectedJobId: string;
}

const JobDescriptionManager = ({ onJobSelect, selectedJobId }: JobDescriptionManagerProps) => {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [editingJobId, setEditingJobId] = useState<string>("");
  const [editTitle, setEditTitle] = useState("");
  const { toast } = useToast();

  // Load saved JDs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("jobDescriptions");
    if (saved) {
      setJobDescriptions(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  const saveToStorage = (jobs: JobDescription[]) => {
    localStorage.setItem("jobDescriptions", JSON.stringify(jobs));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    const jobId = `job_${Date.now()}`;
    const newJob: JobDescription = {
      id: jobId,
      title: newJobTitle || file.name.replace('.pdf', ''),
      file: file,
      uploadDate: new Date().toLocaleDateString(),
    };

    const updatedJobs = [...jobDescriptions, newJob];
    setJobDescriptions(updatedJobs);
    saveToStorage(updatedJobs);
    setNewJobTitle("");
    
    toast({
      title: "Job Description uploaded",
      description: `${newJob.title} has been added successfully`,
    });

    // Auto-select the newly uploaded job
    onJobSelect(jobId);
  };

  const handleTitleEdit = (jobId: string, currentTitle: string) => {
    setEditingJobId(jobId);
    setEditTitle(currentTitle);
  };

  const saveTitleEdit = () => {
    const updatedJobs = jobDescriptions.map(job =>
      job.id === editingJobId ? { ...job, title: editTitle } : job
    );
    setJobDescriptions(updatedJobs);
    saveToStorage(updatedJobs);
    setEditingJobId("");
    setEditTitle("");
    
    toast({
      title: "Title updated",
      description: "Job title has been updated successfully",
    });
  };

  const cancelEdit = () => {
    setEditingJobId("");
    setEditTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="job-title" className="text-sm font-medium text-gray-700">
              Job Title (Optional)
            </Label>
            <Input
              id="job-title"
              placeholder="Enter job title..."
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="jd-upload" className="text-sm font-medium text-gray-700">
              Upload Job Description (PDF)
            </Label>
            <div className="mt-1">
              <input
                id="jd-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById("jd-upload")?.click()}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Job Description
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Select Existing Job Description
            </Label>
            <Select value={selectedJobId} onValueChange={onJobSelect}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a job description..." />
              </SelectTrigger>
              <SelectContent>
                {jobDescriptions.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Job Descriptions List */}
      {jobDescriptions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Uploaded Job Descriptions ({jobDescriptions.length})
          </h3>
          
          <div className="grid gap-4">
            {jobDescriptions.map((job) => (
              <Card 
                key={job.id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  selectedJobId === job.id ? 'ring-2 ring-blue-500 shadow-md' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingJobId === job.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            size="sm" 
                            onClick={saveTitleEdit}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={cancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-800">{job.title}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTitleEdit(job.id, job.title)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              Uploaded: {job.uploadDate}
                            </Badge>
                            {selectedJobId === job.id && (
                              <Badge className="text-xs bg-blue-100 text-blue-800">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => onJobSelect(job.id)}
                      variant={selectedJobId === job.id ? "default" : "outline"}
                      size="sm"
                      className={selectedJobId === job.id ? 
                        "bg-blue-600 hover:bg-blue-700" : 
                        "hover:bg-blue-50"
                      }
                    >
                      {selectedJobId === job.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {jobDescriptions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No Job Descriptions Yet</h4>
          <p className="text-gray-500">Upload your first job description to get started</p>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionManager;
