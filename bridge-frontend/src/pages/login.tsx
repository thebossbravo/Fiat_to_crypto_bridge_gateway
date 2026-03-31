import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '@/contexts/theme-context';
import { LoginForm } from '../components/login-form';
import { SignupForm } from '../components/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogin = async (email: string, password: string) => {
    try {
      // TODO: Implement login API call
      console.log('Login:', { email, password });
      // Navigate to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
      // TODO: Implement signup API call
      console.log('Signup:', { email, password });
      // Navigate to dashboard on successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login');
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} flex items-center justify-center p-6`}>
      <div className="w-full max-w-md">
        <Card className={theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl font-bold flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <div className="w-8 h-8 bg-[#FF4500] rounded-sm rotate-45"></div>
              Bridge Protocol
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === 'login' ? (
              <LoginForm 
                onSubmit={handleLogin}
                onGoogleClick={handleGoogleLogin}
              />
            ) : (
              <SignupForm 
                onSubmit={handleSignup}
                onGoogleClick={handleGoogleLogin}
              />
            )}
            
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Button
                  variant="ghost"
                  className={theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {mode === 'login' ? 'Need an account?' : 'Have an account?'}
                </Button>
              </div>
              <div className="text-center">
                <Button
                  variant="ghost"
                  className={theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
