import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import EmptyState from '@/components/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, FolderOpen, Star, Download } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getMyResources, deleteResource } from '@/services/resourceService';
import type { ResourceData } from '@/services/resourceService';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EditResourceDialog } from '@/components/EditResourceDialog';

const MyUploads = () => {
  const [uploads, setUploads] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<ResourceData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    loadMyUploads();
    
    // Listen for upload events
    const handleUploadsChanged = () => {
      console.log('Uploads changed event received, reloading...');
      loadMyUploads();
    };
    
    window.addEventListener('uploads-changed', handleUploadsChanged);
    
    return () => {
      window.removeEventListener('uploads-changed', handleUploadsChanged);
    };
  }, [location.key]); // Reload whenever location changes (including navigating to the same route)

  const loadMyUploads = async () => {
    setLoading(true);
    try {
      console.log('Fetching my resources...');
      const result = await getMyResources({ sort_by: 'created_at', order: 'DESC' });
      console.log('My resources result:', result);
      if (result.success && result.data) {
        console.log('Setting uploads:', result.data.length, 'items');
        setUploads(result.data);
      } else {
        console.error('Failed to load resources:', result.error);
        setUploads([]);
      }
    } catch (error) {
      console.error('Error loading uploads:', error);
      setUploads([]);
      toast({ 
        title: 'Error', 
        description: 'Failed to load your uploads', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteResource(id);
      if (result.success) {
        setUploads((prev) => prev.filter((r) => r.id !== id));
        toast({ title: 'Resource deleted successfully' });
      } else {
        throw new Error(result.error || 'Delete failed');
      }
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to delete resource',
        variant: 'destructive' 
      });
    }
  };

  if (loading) {
    return <AppLayout><LoadingSpinner /></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Uploads</h1>
            <p className="text-muted-foreground">Manage your shared resources</p>
          </div>
          <Button onClick={() => navigate('/upload')}>Upload New</Button>
        </div>

        {uploads.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-16 w-16" />}
            title="No uploads yet"
            description="Start sharing resources with your campus community."
            action={<Button onClick={() => navigate('/upload')}>Upload Your First Resource</Button>}
          />
        ) : (
          <div className="space-y-3">
            {uploads.map((r) => (
              <Card key={r.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/resources/${r.id}`)}>
                      <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">{r.title}</h3>
                      <p className="text-sm text-muted-foreground">{r.subject || 'No subject'}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge variant="secondary" className="text-xs capitalize">{r.visibility}</Badge>
                        {r.semester && <Badge variant="secondary" className="text-xs">Sem {r.semester}</Badge>}
                        {r.file_type && <Badge variant="outline" className="text-xs capitalize">{r.file_type}</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          {r.avg_rating ? parseFloat(r.avg_rating).toFixed(1) : '0.0'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {r.download_count || 0}
                        </span>
                        <span>{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => setEditingResource(r)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{r.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(r.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingResource && (
        <EditResourceDialog
          resource={editingResource}
          open={!!editingResource}
          onOpenChange={(open) => !open && setEditingResource(null)}
          onSuccess={() => {
            setEditingResource(null);
            loadMyUploads();
          }}
        />
      )}
    </AppLayout>
  );
};

export default MyUploads;
