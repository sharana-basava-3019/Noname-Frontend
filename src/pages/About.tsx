import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Share2, Zap, Shield, BookOpen, Target } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            About CampusShare
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Empowering students worldwide to share knowledge, collaborate, and excel together
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                CampusShare is revolutionizing how students access and share academic resources. Our platform bridges the gap between knowledge seekers and knowledge sharers, creating a vibrant community where study materials flow freely and everyone benefits from collective intelligence.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We believe that education should be collaborative, accessible, and rewarding for all participants.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
              <BookOpen className="w-16 h-16 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">Knowledge Sharing</h3>
              <p className="text-slate-600">
                A centralized hub where students can upload and discover academic resources across different subjects and semesters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Why CampusShare?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Share2 className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Easy Resource Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Upload notes, assignments, and study materials with just a few clicks. Support for multiple file types and formats.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle>Smart Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Advanced search and filtering by subject, semester, and file type. Find exactly what you need in seconds.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Connect with students from your college and classes. Share experiences and help each other succeed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Privacy & Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Control who sees your uploads with college-wide and class-specific visibility settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Target className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Accessibility</h3>
              <p className="text-slate-600">
                Making quality educational resources available to every student, regardless of background.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Community</h3>
              <p className="text-slate-600">
                Building a supportive network where students lift each other up and grow together.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Excellence</h3>
              <p className="text-slate-600">
                Constantly improving our platform to deliver the best user experience and features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">📚 Resource Management</h3>
              <ul className="text-slate-600 space-y-2">
                <li>• Upload documents, notes, and study materials</li>
                <li>• Organize by subject, semester, and year</li>
                <li>• Tag resources for easy discovery</li>
                <li>• Track downloads and ratings</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">🔍 Smart Discovery</h3>
              <ul className="text-slate-600 space-y-2">
                <li>• Advanced search and filtering</li>
                <li>• Sort by latest, popular, or most downloaded</li>
                <li>• Personalized recommendations</li>
                <li>• Explore by college and class</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">👥 User Profiles</h3>
              <ul className="text-slate-600 space-y-2">
                <li>• Customizable student profiles</li>
                <li>• Track your uploads and downloads</li>
                <li>• Connect with other students</li>
                <li>• Earn reputation through contributions</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">🏆 Community Recognition</h3>
              <ul className="text-slate-600 space-y-2">
                <li>• Leaderboard showcasing top contributors</li>
                <li>• Ratings and reviews system</li>
                <li>• Achievement badges</li>
                <li>• Recognition for helpful resources</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">CampusShare</h3>
              <p className="text-slate-400">
                Empowering students worldwide to share knowledge and collaborate.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Browse Resources</a></li>
                <li><a href="#" className="hover:text-white transition">Upload Resource</a></li>
                <li><a href="#" className="hover:text-white transition">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">My Profile</a></li>
                <li><a href="#" className="hover:text-white transition">My Uploads</a></li>
                <li><a href="#" className="hover:text-white transition">Settings</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2026 CampusShare. All rights reserved. Empowering students through knowledge sharing.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
