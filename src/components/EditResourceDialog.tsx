import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { updateResource } from '@/services/resourceService';
import type { ResourceData } from '@/services/resourceService';
import { Loader2, X } from 'lucide-react';

interface EditResourceDialogProps {
  resource: ResourceData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

export function EditResourceDialog({ resource, open, onOpenChange, onSuccess }: EditResourceDialogProps) {
  const [form, setForm] = useState({
    title: '',
    subject: '',
    semester: '',
    description: '',
    visibility: 'public' as 'public' | 'college' | 'class',
    year: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (resource && open) {
      setForm({
        title: resource.title || '',
        subject: resource.subject || '',
        semester: resource.semester?.toString() || '',
        description: resource.description || '',
        visibility: (resource.visibility as any) || 'public',
        year: resource.year?.toString() || new Date().getFullYear().toString(),
        tags: resource.tags || []
      });
    }
  }, [resource, open]);

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm(p => ({ ...p, tags: [...p.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.subject) {
      toast({ 
        title: 'Validation Error', 
        description: 'Title and subject are required.', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);

    try {
      const result = await updateResource(resource.id, {
        title: form.title,
        description: form.description || undefined,
        visibility: form.visibility,
        subject: form.subject,
        semester: form.semester ? parseInt(form.semester) : undefined,
        year: form.year ? parseInt(form.year) : undefined,
        tags: form.tags.length > 0 ? form.tags.join(', ') : undefined
      } as any);

      if (result.success) {
        toast({ 
          title: 'Success!', 
          description: 'Resource updated successfully.' 
        });
        onOpenChange(false);
        onSuccess();
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast({ 
        title: 'Update Failed', 
        description: error.message || 'An error occurred while updating.',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
          <DialogDescription>
            Update resource information. File cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input 
              id="edit-title" 
              value={form.title} 
              onChange={(e) => update('title', e.target.value)} 
              disabled={loading} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-subject">Subject *</Label>
            <Input 
              id="edit-subject" 
              value={form.subject} 
              onChange={(e) => update('subject', e.target.value)} 
              disabled={loading} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={form.semester} onValueChange={(v) => update('semester', v)} disabled={loading}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Year</Label>
              <Input 
                type="number" 
                value={form.year} 
                onChange={(e) => update('year', e.target.value)} 
                disabled={loading}
                min="2000"
                max="2100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select value={form.visibility} onValueChange={(v) => update('visibility', v as any)} disabled={loading}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Everyone can see</SelectItem>
                <SelectItem value="college">College Only</SelectItem>
                <SelectItem value="class">Class Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea 
              id="edit-description" 
              value={form.description} 
              onChange={(e) => update('description', e.target.value)} 
              disabled={loading} 
              rows={3} 
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Add tags" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                disabled={loading}
              />
              <Button type="button" variant="outline" onClick={addTag} disabled={loading}>
                Add
              </Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="pl-2 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                      disabled={loading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
