import { Flame, Lock, Shield, Zap } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function LoginPrompt() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
            <Flame className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Welcome to CalorieBurn</CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in to start tracking your fitness journey
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Secure Authentication</h3>
                <p className="text-xs text-muted-foreground">Your data is protected with blockchain-based identity</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Private & Personal</h3>
                <p className="text-xs text-muted-foreground">Only you can see your activity data</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Track Your Progress</h3>
                <p className="text-xs text-muted-foreground">Log activities and monitor calories burned</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={login} 
            disabled={isLoggingIn}
            className="w-full"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              'Sign In to Get Started'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to securely store your fitness data on the Internet Computer
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
