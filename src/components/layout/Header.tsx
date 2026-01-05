import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe, TrendingUp, BarChart3, RefreshCw, Star, LogIn, LogOut, User } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: '/', label: t('nav.dashboard'), icon: TrendingUp },
    { path: '/compare', label: t('nav.compare'), icon: BarChart3 },
    { path: '/converter', label: t('nav.converter'), icon: RefreshCw },
    { path: '/watchlist', label: t('nav.watchlist'), icon: Star },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'es', label: 'Español' },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-card border-b border-border/50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary"
            >
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">{t('dashboard.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('dashboard.subtitle')}</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'gap-2 transition-all duration-300',
                        isActive && 'bg-primary/10 text-primary'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={cn(
                      'cursor-pointer',
                      i18n.language === lang.code && 'bg-primary/10 text-primary'
                    )}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative overflow-hidden"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </motion.div>
              </Button>
            </motion.div>

            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Signed in</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/auth')}
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden items-center gap-1 mt-3 overflow-x-auto scrollbar-thin pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-1.5 whitespace-nowrap',
                    isActive && 'bg-primary/10 text-primary'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
