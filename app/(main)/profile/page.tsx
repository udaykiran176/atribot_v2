
import {Logout} from "@/components/logout";
import { getCurrentUser } from "@/server/users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart } from "lucide-react";


export default async function ProfilePage() {
  const { currentUser } = await getCurrentUser();
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderDisplay = (gender: string | null) => {
    if (!gender) return "Not provided";
    const genderMap: { [key: string]: string } = {
      'male': 'Male',
      'female': 'Female',
    };
    return genderMap[gender] || gender;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Parent Information
              </CardTitle>
              <CardDescription>
                Your account details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{currentUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{currentUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <p className="text-gray-900">{currentUser.phoneNumber || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Account Created</label>
                <p className="text-gray-900">{formatDate(currentUser.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Child Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Child Information
              </CardTitle>
              <CardDescription>
                Your child &apos; s details for personalized learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Child&apos;s Name</label>
                <p className="text-gray-900">{currentUser.childName || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="text-gray-900">{formatDate(currentUser.childDob)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <p className="text-gray-900">{getGenderDisplay(currentUser.childGender)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Class/Grade</label>
                <p className="text-gray-900">
                  {currentUser.childClass ? `Class ${currentUser.childClass}` : "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">School Name</label>
                <p className="text-gray-900">{currentUser.schoolname || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Logout />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

