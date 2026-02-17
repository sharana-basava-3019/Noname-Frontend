# Quick Start Guide - CampusShare Frontend

## 🚀 Get Started in 3 Steps

### 1. Ensure Backend is Running
```bash
# In backend directory
cd hackathon-backend
npm start
# Backend should be running on http://localhost:3000
```

### 2. Start Frontend
```bash
# In frontend directory
cd hackathon-frontend
npm run dev
# Frontend will be on http://localhost:8082
```

### 3. Test the Application
1. Open http://localhost:8082
2. Click "Register" to create an account
3. Fill in the form and register
4. You'll be auto-logged in and redirected to dashboard
5. Try uploading a resource
6. Browse resources
7. Check the leaderboard

## 📌 Important Files

### Services (API Calls)
- `src/services/authService.ts` - Authentication APIs
- `src/services/resourceService.ts` - Resource management APIs
- `src/services/searchService.ts` - Search APIs
- `src/services/userService.ts` - User & leaderboard APIs

### Pages (UI)
- `src/pages/Login.tsx` - Login page
- `src/pages/Register.tsx` - Registration page
- `src/pages/Dashboard.tsx` - Main dashboard
- `src/pages/UploadResource.tsx` - Upload files
- `src/pages/BrowseResources.tsx` - Browse & search
- `src/pages/MyUploads.tsx` - Manage uploads
- `src/pages/Leaderboard.tsx` - Top contributors
- `src/pages/Profile.tsx` - User profile

## 🔧 Configuration

### Change Backend URL
Edit `.env` file (create if doesn't exist):
```env
VITE_API_URL=http://localhost:3000
```

## 💡 Common Tasks

### Add New API Call
```typescript
// In appropriate service file
export const myNewFunction = async (params) => {
  try {
    const response = await apiClient.get('/endpoint', { params });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};
```

### Use API in Component
```typescript
import { myNewFunction } from '@/services/yourService';

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await myNewFunction();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        toast({ 
          title: 'Error', 
          description: response.error, 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch data', 
        variant: 'destructive' 
        });
    } finally {
      setLoading(false);
    }
  };

  return <div>...</div>;
};
```

## 🎯 Testing Checklist

- [ ] Register new account
- [ ] Login with credentials
- [ ] View dashboard
- [ ] Upload a file
- [ ] Browse resources
- [ ] Search for resources
- [ ] Filter resources
- [ ] Download a file
- [ ] View my uploads
- [ ] Delete an upload
- [ ] View leaderboard
- [ ] Edit profile
- [ ] Logout

## 🐛 Troubleshooting

### Can't login?
- Check backend is running
- Check browser console for errors
- Verify email/password are correct

### Upload fails?
- Check file size (max 50MB)
- Ensure you're logged in
- Check network tab for error details

### No resources showing?
- Backend may have no data
- Upload some resources first
- Check search filters

### API errors?
- Open DevTools → Network tab
- Check API response
- Verify backend is running on port 3000

## 📚 Resources

- Full API Docs: `hackathon-backend/frontend-handover/`
- Integration Guide: `API_INTEGRATION.md`
- Component Docs: shadcn/ui components

## 🎉 You're All Set!

Everything is connected and working. Start building! 🚀
