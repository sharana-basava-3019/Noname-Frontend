import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, Loader2, FileUp, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadResource } from '@/services/resourceService';
import { Badge } from '@/components/ui/badge';

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

const UploadResource = () => {
  const [form, setForm] = useState({ 
    title: '', 
    subject: '', 
    semester: '', 
    description: '',
    visibility: 'public' as 'public' | 'college' | 'class',
    year: new Date().getFullYear().toString(),
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    const { title, subject, semester, visibility, year } = form;

    if (!title || !subject || !semester || !file) {
      toast({ title: 'Validation Error', description: 'Please fill all required fields and select a file.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Simulate upload progress (since we can't track actual multipart upload progress easily)
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 200);

      const result = await uploadResource({
        file,
        title,
        description: form.description || undefined,
        visibility,
        subject,
        semester: parseInt(semester),
        year: parseInt(year),
        tags: form.tags.length > 0 ? form.tags.join(', ') : undefined
      });

      clearInterval(progressInterval);
      console.log('Upload result:', result);
      setProgress(100);

      if (result.success) {
        toast({ 
          title: 'Upload Successful!', 
          description: 'Your resource has been shared with the community.' 
        });
        // Navigate with replace to force a clean navigation
        setTimeout(() => {
          navigate('/my-uploads', { replace: true });
          window.dispatchEvent(new Event('uploads-changed'));
        }, 1000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Upload Failed', 
        description: error.message || 'An error occurred while uploading.',
        variant: 'destructive' 
      });
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-5 w-5 text-primary" /> Upload Resource
            </CardTitle>
            <CardDescription>Share your study materials with the campus community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Data Structures Notes Unit 1" 
                  value={form.title} 
                  onChange={(e) => update('title', e.target.value)} 
                  disabled={loading} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input 
                  id="subject" 
                  placeholder="e.g., Data Structures & Algorithms" 
                  value={form.subject} 
                  onChange={(e) => update('subject', e.target.value)} 
                  disabled={loading} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Semester *</Label>
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
                    placeholder="2024" 
                    value={form.year} 
                    onChange={(e) => update('year', e.target.value)} 
                    disabled={loading}
                    min="2000"
                    max="2100"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Visibility *</Label>
                <Select value={form.visibility} onValueChange={(v) => update('visibility', v as any)} disabled={loading}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Everyone can see</SelectItem>
                    <SelectItem value="college">College Only - Your college students</SelectItem>
                    <SelectItem value="class">Class Only - Your classmates only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief description of the resource..." 
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
                    placeholder="Add tags (e.g., algorithms, sorting)" 
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
              <div className="space-y-2">
                <Label>File * (PDF, DOC, DOCX, PPT, PPTX, Images - Max 50MB)</Label>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors" 
                  onClick={() => !loading && fileRef.current?.click()}
                >
                  <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{file ? file.name : 'Click to select a file'}</p>
                  {file && <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
                </div>
                <input 
                  ref={fileRef} 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
                  disabled={loading}
                />
              </div>

              {loading && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">{progress}% uploaded</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UploadIcon className="h-4 w-4 mr-2" />}
                {loading ? 'Uploading...' : 'Upload Resource'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UploadResource;
