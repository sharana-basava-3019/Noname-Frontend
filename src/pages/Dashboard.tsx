import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockDashboardData } from '@/data/mockData';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
import EmptyState from '@/components/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Upload, TrendingUp, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [data] = useState(mockDashboardData);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownload = (id: string) => {
    toast({ title: 'Download started', description: `Downloading resource ${id}` });
  };

  const handleBookmark = (id: string) => {
    toast({ title: 'Bookmark updated', description: `Resource ${id} bookmarked` });
  };

  const recentActivity = data.recentUploads.slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-muted-foreground">Here's your academic activity overview.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Points</p>
                    <p className="text-xl font-bold text-foreground">{data.contributionPoints}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Uploads</p>
                    <p className="text-xl font-bold text-foreground">{data.recentUploads.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border hover:bg-muted/50 transition-colors">
                <CardContent className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => navigate('/upload')}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quick Action</p>
                    <p className="text-base font-semibold text-primary">Upload Resource</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Uploads */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" /> Recent Uploads
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/my-uploads')}>View All</Button>
              </CardHeader>
              <CardContent>
                {data.recentUploads.length ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.recentUploads.slice(0, 2).map((r) => (
                      <ResourceCard key={r.id} resource={r} onDownload={handleDownload} onBookmark={handleBookmark} />
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No uploads yet" description="Share your first resource with the campus!" action={<Button onClick={() => navigate('/upload')}>Upload Now</Button>} />
                )}
              </CardContent>
            </Card>
            
            {/* Trending Resources */}
            <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" /> Trending Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.trendingResources.length ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {data.trendingResources.slice(0, 4).map((r) => (
                        <ResourceCard key={r.id} resource={r} onDownload={handleDownload} onBookmark={handleBookmark} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="No trending resources" description="Resources will appear here as they gain popularity." />
                  )}
                </CardContent>
              </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-5">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <EmptyState
                    title="No recent activity"
                    description="Your interactions will appear here."
                  />
                ) : (
                  <ul className="space-y-4 text-sm">
                    {recentActivity.map((item) => (
                      <li key={item.id} className="flex items-start justify-between gap-3">
                        <FileText className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                        <div className="flex-grow min-w-0">
                          <p className="font-medium text-foreground truncate leading-tight">Uploaded {item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
