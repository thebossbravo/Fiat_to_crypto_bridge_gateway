import { useState } from 'react';
import { LoginForm } from '../components/login-form';
import { SignupForm } from '../components/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleLogin = (email: string, password: string) => {
    // TODO: Implement login logic
    console.log('Login:', { email, password });
  };

  const handleSignup = (email: string, password: string) => {
    // TODO: Implement signup logic
    console.log('Signup:', { email, password });
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-[#FF4500] rounded-sm rotate-45"></div>
              Bridge Protocol
            </CardTitle>
            <CardDescription className="text-zinc-400">
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
            
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
