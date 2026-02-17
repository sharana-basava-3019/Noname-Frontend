import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { EditResourceDialog } from '@/components/EditResourceDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Star, Calendar, User, FileText, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getResourceById } from '@/services/resourceService';
import type { ResourceData } from '@/services/resourceService';
import { mockResources } from '@/data/mockData';

const ResourceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [resource, setResource] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadResource();
  }, [id]);

  const loadResource = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getResourceById(parseInt(id));
      if (result.success && result.data) {
        setResource(result.data);
      } else {
        // Fallback to mock data if backend doesn't have the resource
        const mockResource = mockResources.find(r => r.id === id);
        if (mockResource) {
          // Convert mock resource to ResourceData format
          const mockResourceData: ResourceData = {
            id: parseInt(id),
            title: mockResource.title,
            description: mockResource.description || '',
            subject: mockResource.subject,
            file_url: mockResource.fileUrl,
            file_name: mockResource.fileName,
            file_size: mockResource.fileSize,
            file_type: mockResource.type,
            semester: mockResource.semester.toString(),
            year: new Date(mockResource.createdAt).getFullYear(),
            visibility: mockResource.visibility || 'public',
            tags: [],
            downloads: mockResource.downloads,
            rating: mockResource.rating,
            user_id: parseInt(mockResource.uploadedBy?.id || '1'),
            uploader_name: mockResource.uploadedBy?.name || 'Unknown',
            created_at: mockResource.createdAt,
            updated_at: mockResource.updatedAt,
          };
          setResource(mockResourceData);
        } else {
          setError(result.error || 'Resource not found');
        }
      }
    } catch (err: any) {
      console.error('Error loading resource:', err);
      // Try mock data as fallback
      const mockResource = mockResources.find(r => r.id === id);
      if (mockResource) {
        const mockResourceData: ResourceData = {
          id: parseInt(id),
          title: mockResource.title,
          description: mockResource.description || '',
          subject: mockResource.subject,
          file_url: mockResource.fileUrl,
          file_name: mockResource.fileName,
          file_size: mockResource.fileSize,
          file_type: mockResource.type,
          semester: mockResource.semester.toString(),
          year: new Date(mockResource.createdAt).getFullYear(),
          visibility: mockResource.visibility || 'public',
          tags: [],
          downloads: mockResource.downloads,
          rating: mockResource.rating,
          user_id: parseInt(mockResource.uploadedBy?.id || '1'),
          uploader_name: mockResource.uploadedBy?.name || 'Unknown',
          created_at: mockResource.createdAt,
          updated_at: mockResource.updatedAt,
        };
        setResource(mockResourceData);
      } else {
        setError(err.message || 'Failed to load resource');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AppLayout><LoadingSpinner /></AppLayout>;
  }

  if (error || !resource) {
    return <AppLayout><ErrorMessage message={error || 'Resource not found'} /></AppLayout>;
  }

  const isOwner = user && resource.user_id === user.id;

  const handleRate = (rating: number) => {
    setUserRating(rating);
    toast({ title: `Rated ${rating} stars` });
    // TODO: Connect to rating API
  };

  const handleDownload = () => {
    // File download is handled through the API
    window.open(resource.file_url, '_blank');
    toast({ title: 'Download started', description: `Downloading ${resource.file_name}` });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{resource.subject || 'No subject'}</p>
              </div>
              <div className="flex gap-2">
                {isOwner && (
                  <Button variant="outline" size="icon" onClick={() => setEditDialogOpen(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {resource.description && (
              <p className="text-foreground">{resource.description}</p>
            )}
            
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="capitalize">{resource.visibility}</Badge>
                {resource.semester && <Badge variant="secondary">Semester {resource.semester}</Badge>}
                {resource.year && <Badge variant="outline">Year {resource.year}</Badge>}
                <Badge variant="outline" className="capitalize">{resource.file_type}</Badge>
              </div>
              
              {resource.tags && resource.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{resource.uploader_name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>{resource.download_count} downloads</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>
                  {resource.avg_rating ? parseFloat(resource.avg_rating).toFixed(1) : '0.0'} 
                  ({resource.rating_count || 0})
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(resource.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Rate this resource</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRate(star)} className="p-1 transition-colors">
                    <Star className={`h-6 w-6 ${star <= userRating ? 'fill-primary text-primary' : 'text-border'}`} />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" /> File Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">File Name:</span>
                <span className="font-medium">{resource.file_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">File Size:</span>
                <span className="font-medium">{(resource.file_size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">{resource.file_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views:</span>
                <span className="font-medium">{resource.view_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      {isOwner && resource && (
        <EditResourceDialog
          resource={resource}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={loadResource}
        />
      )}
    </AppLayout>
  );
};

export default ResourceDetails;
