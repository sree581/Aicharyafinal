import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, Upload, Trash2, Database } from "lucide-react";
import { exportAllData, importData, clearAllData, getAllQuizHistory } from "../lib/storage";
import { getAllUsers } from "../lib/auth";
import { toast } from "sonner@2.0.3";

export function DataManager() {
  const [showData, setShowData] = useState(false);

  const handleExport = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Aicharya-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          try {
            const success = importData(event.target.result);
            if (success) {
              toast.success("Data imported successfully! Please refresh the page.");
            } else {
              toast.error("Failed to import data");
            }
          } catch (error) {
            toast.error("Invalid backup file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure? This will delete ALL data including user accounts and quiz history. This action cannot be undone!")) {
      clearAllData();
      toast.success("All data cleared. Please refresh the page.");
    }
  };

  const users = getAllUsers();
  const quizData = getAllQuizHistory();
  const totalQuizzes = Object.values(quizData).reduce((sum, history) => sum + history.length, 0);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Manager
          </CardTitle>
          <CardDescription>
            Manage your localStorage data - backup, restore, or clear all data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-600">Registered Users</div>
              <div className="text-2xl">{users.length}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-600">Total Quizzes</div>
              <div className="text-2xl">{totalQuizzes}</div>
            </div>
          </div>

          {/* Subject Breakdown */}
          <div className="space-y-2">
            <div className="text-sm">Quiz History by Subject:</div>
            <div className="flex gap-2">
              <Badge>Java: {quizData.java?.length || 0}</Badge>
              <Badge>Data Structure: {quizData.datastructure?.length || 0}</Badge>
              <Badge>Maths: {quizData.maths?.length || 0}</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={handleImport} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button onClick={() => setShowData(!showData)} variant="outline">
              <Database className="h-4 w-4 mr-2" />
              {showData ? 'Hide' : 'Show'} Data
            </Button>
            <Button onClick={handleClearAll} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>

          {/* Raw Data View */}
          {showData && (
            <div className="mt-4">
              <div className="text-sm mb-2">Raw localStorage Data:</div>
              <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                {exportAllData()}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
