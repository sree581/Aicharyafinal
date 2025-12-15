import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export function NeedHelpPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Need Help?</h1>
        <p className="text-gray-600">Get in touch with our support team</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="mb-1">Email Support</div>
                <a 
                  href="mailto:240911@tkmce.ac.in" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  240911@tkmce.ac.in
                </a>
                <p className="text-xs text-gray-600 mt-1">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="bg-green-100 p-3 rounded-full">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="mb-1">Phone Support</div>
                <a 
                  href="tel:+91-8891472969" 
                  className="text-sm text-green-600 hover:underline"
                >
                  +91-8891472969
                </a>
                <p className="text-xs text-gray-600 mt-1">
                  Monday - Friday: 9:00 AM - 9:00 PM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="bg-purple-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="mb-1">Office Address</div>
                <p className="text-sm text-gray-700">
                  TKM College of Engineering<br />
                  Karicode, Peroor<br />
                  Kollam,kerala
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="bg-orange-100 p-3 rounded-full">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="mb-1">Website</div>
                <a 
                  href="https://Aicharya.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-600 hover:underline"
                >
                  www.Aicharya.com
                </a>
                <p className="text-xs text-gray-600 mt-1">
                  Visit our website for more resources
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}