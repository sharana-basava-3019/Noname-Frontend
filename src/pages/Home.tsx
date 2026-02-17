import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  Search, 
  Trophy, 
  BookOpen, 
  TrendingUp, 
  Users,
  FileText,
  Star,
  Download,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Upload,
      title: 'Upload Resources',
      description: 'Share your notes, assignments, and study materials with fellow students.',
      link: '/upload',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Search,
      title: 'Browse Library',
      description: 'Access thousands of resources uploaded by students across all branches.',
      link: '/resources',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Trophy,
      title: 'Leaderboard',
      description: 'Compete with peers and earn points for sharing quality content.',
      link: '/leaderboard',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      icon: Users,
      title: 'Your Uploads',
      description: 'Manage all your uploaded resources and track their performance.',
      link: '/my-uploads',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const stats = [
    { icon: FileText, label: 'Resources', value: '5,000+', color: 'text-blue-500' },
    { icon: Users, label: 'Students', value: '1,200+', color: 'text-green-500' },
    { icon: Download, label: 'Downloads', value: '50,000+', color: 'text-orange-500' },
    { icon: Star, label: 'Avg Rating', value: '4.6', color: 'text-yellow-500' }
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to CampusShare{user?.name && `, ${user.name.split(' ')[0]}`}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your one-stop platform for sharing and discovering academic resources. 
            Collaborate with fellow students and excel in your studies together.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link to="/dashboard">
                <TrendingUp className="h-5 w-5 mr-2" />
                View Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/upload">
                <Upload className="h-5 w-5 mr-2" />
                Upload Resource
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Explore Features</h2>
            <p className="text-muted-foreground">Everything you need for academic success</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <Link to={feature.link}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center justify-between">
                          {feature.title}
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Upload your first resource to earn contribution points
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Browse resources by branch, semester, or subject to find what you need
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Rate and review resources to help other students
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Check the leaderboard to see top contributors
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Home;
