import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User, Mail, GraduationCap, Calendar, Edit2, Save, X } from "lucide-react";
import { getCurrentUser, updateUserProfile, ClassType } from "../lib/auth";
import { toast } from "sonner@2.0.3";

export function ProfilePage() {
  const user = getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [classType, setClassType] = useState<ClassType>(user?.classType || "BTech");

  if (!user) {
    return <div>Please login to view profile</div>;
  }

  const handleSave = () => {
    const result = updateUserProfile({ name, classType });
    if (result.success) {
      toast.success(result.message);
      setIsEditing(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setClassType(user.classType);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="h-4 w-4" />
                <span>Class: {user.classType}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={classType}
                  onValueChange={(value) => setClassType(value as ClassType)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="class" className={!isEditing ? "bg-gray-50" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                    <SelectItem value="BTech">BTech</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}