import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet } from "lucide-react";
import { useState } from "react";

interface AuthButtonProps {
  onLogin: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  user?: {
    email: string;
    walletAddress: string;
  };
}

export function AuthButton({ onLogin, onLogout, isAuthenticated, user }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      onLogin();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connected
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm text-zinc-300">
              <div className="font-mono truncate">
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </div>
            </div>
            <Separator className="bg-zinc-800" />
            <Button 
              variant="outline" 
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Connect Wallet</CardTitle>
        <CardDescription className="text-zinc-400">
          Sign in with Google to start bridging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full bg-[#FF4500] hover:bg-[#FF6B35] text-white"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Sign in with Google'}
        </Button>
      </CardContent>
    </Card>
  );
}
