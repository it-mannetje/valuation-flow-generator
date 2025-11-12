import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminDashboardComponent from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Auth check result:', { session: !!session, error });
        
        if (!session) {
          console.log('No session, redirecting to /admin');
          navigate('/admin');
          return;
        }
        
        console.log('Auth successful, loading dashboard');
        setLoading(false);
      } catch (err) {
        console.error('Auth check error:', err);
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate('/admin');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out.",
      });
    } else {
      toast({
        title: "Logged out",
        description: "Successfully logged out.",
      });
      navigate('/admin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <AdminDashboardComponent />
      </main>
    </div>
  );
};

export default AdminDashboard;