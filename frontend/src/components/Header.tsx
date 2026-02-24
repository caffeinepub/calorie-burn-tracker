import { Flame } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';

export function Header() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CalorieBurn</h1>
            <p className="text-xs text-muted-foreground">Track your fitness journey</p>
          </div>
        </div>

        <div>
          {isAuthenticated ? (
            <Button onClick={clear} variant="outline" size="sm">
              Logout
            </Button>
          ) : (
            <Button onClick={login} disabled={isLoggingIn} size="sm">
              {isLoggingIn ? 'Connecting...' : 'Login'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
