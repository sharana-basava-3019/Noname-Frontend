import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LandingNav } from '@/components/LandingNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen,
  Upload,
  Search,
  Star,
  Download,
  Users,
  TrendingUp,
  FileText,
  Award,
  Shield,
  Zap,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { searchResources } from '@/services/searchService';
import { getResources } from '@/services/resourceService';
import type { Resource } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Featured resources state
  const [featuredResources, setFeaturedResources] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  // Load featured resources on mount
  useEffect(() => {
    loadFeaturedResources();
  }, []);

  const loadFeaturedResources = async () => {
    setLoadingResources(true);
    try {
      const response = await getResources({ sort_by: 'download_count', order: 'DESC', limit: 6 });
      setFeaturedResources(response.data?.slice(0, 6) || []);
    } catch (error) {
      console.error('Failed to load featured resources:', error);
    } finally {
      setLoadingResources(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedSubject) params.set('subject', selectedSubject);
    if (selectedSemester) params.set('semester', selectedSemester);
    if (selectedType) params.set('type', selectedType);

    navigate(`/resources?${params.toString()}`);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);

    // Simulate contact form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message sent!',
      description: "We'll get back to you soon.",
    });

    setContactForm({ name: '', email: '', message: '' });
    setSubmittingContact(false);
  };

  const categories = [
    { icon: FileText, name: 'Notes', count: '500+', color: 'bg-blue-100 text-blue-600' },
    { icon: BookOpen, name: 'Question Papers', count: '300+', color: 'bg-purple-100 text-purple-600' },
    { icon: Award, name: 'Assignments', count: '200+', color: 'bg-green-100 text-green-600' },
    { icon: Users, name: 'Projects', count: '150+', color: 'bg-orange-100 text-orange-600' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find exactly what you need with advanced filters for subject, semester, and type.',
    },
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Share your notes and resources with the community in just a few clicks.',
    },
    {
      icon: Star,
      title: 'Quality Ratings',
      description: 'Community-driven ratings help you find the best resources quickly.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Earn contribution points and climb the leaderboard as you share.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures you get your resources instantly.',
    },
  ];

  const howItWorksSteps = [
    {
      step: '1',
      title: 'Sign Up',
      description: 'Create your free account in seconds using your college email.',
    },
    {
      step: '2',
      title: 'Browse or Upload',
      description: 'Search for resources you need or share your own study materials.',
    },
    {
      step: '3',
      title: 'Collaborate',
      description: 'Rate resources, provide feedback, and help fellow students succeed.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/10 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Share Knowledge,
              <span className="block text-primary mt-2">Empower Students</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              The ultimate platform for college students to share and discover study materials, notes,
              assignments, and question papers.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/resources">
                    <Button size="lg" className="text-lg px-8">
                      <Search className="mr-2 h-5 w-5" />
                      Browse Resources
                    </Button>
                  </Link>
                  <Link to="/upload">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Resource
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="text-lg px-8">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/resources">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      <Search className="mr-2 h-5 w-5" />
                      Explore Resources
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-gray-600 mt-1">Resources</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">5K+</div>
                <div className="text-gray-600 mt-1">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-gray-600 mt-1">Colleges</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.8★</div>
                <div className="text-gray-600 mt-1">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Find What You Need</h2>
            <p className="mt-4 text-lg text-gray-600">
              Search through thousands of resources with advanced filters
            </p>
          </div>

          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search for notes, papers, assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="lg">
                    <Search className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="Data Structures & Algorithms">DSA</SelectItem>
                      <SelectItem value="Database Management Systems">DBMS</SelectItem>
                      <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                      <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Resource Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="paper">Question Papers</SelectItem>
                      <SelectItem value="assignment">Assignments</SelectItem>
                      <SelectItem value="book">Books</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popular Resources</h2>
            <p className="mt-4 text-lg text-gray-600">
              Most downloaded and highly rated study materials
            </p>
          </div>

          {loadingResources ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/resources/${resource.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{resource.title}</CardTitle>
                        <CardDescription className="mt-1">{resource.subject || 'General'}</CardDescription>
                      </div>
                      <Badge variant="secondary">{resource.file_type || 'file'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {resource.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center text-yellow-600">
                          <Star className="h-4 w-4 fill-current mr-1" />
                          {resource.avg_rating ? parseFloat(resource.avg_rating).toFixed(1) : '0.0'}
                        </span>
                        <span className="flex items-center text-gray-600">
                          <Download className="h-4 w-4 mr-1" />
                          {resource.download_count || 0}
                        </span>
                      </div>
                      {resource.semester && (
                        <span className="text-gray-500">Sem {resource.semester}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/resources">
              <Button size="lg" variant="outline">
                View All Resources
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-4 text-lg text-gray-600">Quick access to different types of resources</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/resources?type=${category.name.toLowerCase()}`}
                  className="group"
                >
                  <Card className="text-center hover:shadow-lg transition-all group-hover:scale-105">
                    <CardContent className="pt-8 pb-6">
                      <div className={`inline-flex p-4 rounded-full ${category.color} mb-4`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-gray-600 text-sm">{category.count} resources</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need for effective academic collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-none shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorksSteps.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white font-bold text-2xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-primary/20 -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Thousands of Students?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Start sharing and discovering quality study materials today. It's completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/resources">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-transparent border-white text-white hover:bg-white/10"
                >
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About EduShare</h2>
              <p className="text-lg text-gray-600 mb-4">
                EduShare is a student-driven platform designed to democratize access to quality educational
                resources. We believe that knowledge should be freely shared among students to foster a
                collaborative learning environment.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Founded by students, for students, our mission is to make academic excellence accessible to
                everyone through the power of community collaboration.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">100% student-focused platform</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Quality-verified resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Active community support</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-2xl">5,000+</div>
                      <div className="text-gray-600">Active Students</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-2xl">10,000+</div>
                      <div className="text-gray-600">Study Resources</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-2xl">50+</div>
                      <div className="text-gray-600">Partner Colleges</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
              <p className="mt-4 text-lg text-gray-600">
                Have questions? We'd love to hear from you.
              </p>
            </div>

            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your.email@college.edu"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={submittingContact}>
                    {submittingContact ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl text-white">EduShare</span>
              </div>
              <p className="text-sm text-gray-400">
                Empowering students through collaborative learning and resource sharing.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="hover:text-primary transition-colors">
                    Browse Resources
                  </Link>
                </li>
                <li>
                  <Link to="/upload" className="hover:text-primary transition-colors">
                    Upload
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="hover:text-primary transition-colors">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#contact" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="mailto:support@edushare.com"
                  className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} EduShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
