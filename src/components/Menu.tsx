import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  IconButton,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Paper,
  CircularProgress,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Fade,
  Alert,
  Fab,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { MenuItem, MenuGroup, Language } from '../types/MenuItem';
import { useLanguage } from '../contexts/LanguageContext';
import { menuService } from '../services/menuService';

const languageNames = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
};

const allGroupsText = {
  pt: 'Todos os Grupos',
  en: 'All Groups',
  es: 'Todos los Grupos',
};

// Function to translate text using a mock translation service
// In a real application, you would use a proper translation API
const translateText = async (text: string, targetLang: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock translations (you should replace this with a real translation API)
  const mockTranslations: Record<string, Record<string, string>> = {
    en: {
      'Básicos': 'Basics',
      'Pratos que abraçam': 'Comforting dishes',
      'Arroz, feijão e bife': 'Rice, beans and steak',
      'O clássico almoço brasileiro': 'The classic Brazilian lunch',
    },
    es: {
      'Básicos': 'Básicos',
      'Pratos que abraçam': 'Platos que abrazan',
      'Arroz, feijão e bife': 'Arroz, frijoles y bistec',
      'O clássico almoço brasileiro': 'El clásico almuerzo brasileño',
    },
  };

  return mockTranslations[targetLang]?.[text] || text;
};

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Fade in={visible}>
      <Fab
        color="primary"
        size="small"
        aria-label="scroll back to top"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Fade>
  );
};

const Menu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentLanguage, setLanguage } = useLanguage();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [groups, items] = await Promise.all([
          menuService.getGroups(),
          menuService.getItems()
        ]);
        
        setMenuGroups(groups);
        setMenuItems(items.filter(item => item.isAvailable));
      } catch (error) {
        console.error('Error fetching menu:', error);
        setError('Failed to load the menu. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const translateContent = async () => {
      if (currentLanguage === 'pt') return;
      setIsTranslating(true);

      try {
        // Translate groups
        const translatedGroups = await Promise.all(
          menuGroups.map(async (group) => {
            if (group.translations?.[currentLanguage]) {
              return group; // Use cached translation
            }
            
            const translatedName = await translateText(group.name, currentLanguage);
            const translatedDesc = await translateText(group.description, currentLanguage);
            
            return {
              ...group,
              translations: {
                ...group.translations,
                [currentLanguage]: {
                  name: translatedName,
                  description: translatedDesc,
                },
              },
            };
          })
        );
        setMenuGroups(translatedGroups);

        // Translate items
        const translatedItems = await Promise.all(
          menuItems.map(async (item) => {
            if (item.translations?.[currentLanguage]) {
              return item; // Use cached translation
            }

            const translatedName = await translateText(item.name, currentLanguage);
            const translatedDesc = await translateText(item.description, currentLanguage);
            
            return {
              ...item,
              translations: {
                ...item.translations,
                [currentLanguage]: {
                  name: translatedName,
                  description: translatedDesc,
                },
              },
            };
          })
        );
        setMenuItems(translatedItems);
      } catch (error) {
        console.error('Error translating content:', error);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [currentLanguage, menuGroups, menuItems]);

  const handleLanguageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    handleLanguageClose();
  };

  const getTranslatedText = (
    item: MenuItem | MenuGroup,
    field: 'name' | 'description'
  ): string => {
    if (currentLanguage === 'pt') return item[field];
    return item.translations?.[currentLanguage]?.[field] || item[field];
  };

  // Group items by their group id
  const itemsByGroup = menuGroups.reduce((acc, group) => {
    acc[group.id] = menuItems.filter(item => item.group.id === group.id);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const filteredGroups = selectedGroup 
    ? menuGroups.filter(group => group.id === selectedGroup)
    : menuGroups;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (isTranslating) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1,
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            <img 
              src="/images/logo.png" 
              alt="Pimenta e Terra" 
              style={{ 
                height: scrolled ? '40px' : '50px',
                transition: 'height 0.3s',
                marginRight: '16px'
              }} 
            />
            {!isMobile && (
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: scrolled ? 0 : 1,
                  transition: 'opacity 0.3s'
                }}
              >
                Pimenta e Terra
              </Typography>
            )}
          </Box>

          <IconButton 
            onClick={handleLanguageClick}
            aria-controls="language-menu"
            aria-haspopup="true"
          >
            <LanguageIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            <ListItemButton onClick={() => {
              setSelectedGroup(null);
              setDrawerOpen(false);
            }}>
              <ListItemText primary={allGroupsText[currentLanguage] || allGroupsText.en} />
            </ListItemButton>
            <Divider />
            {menuGroups.map((group) => (
              <ListItemButton
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group.id);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText 
                  primary={`${group.emoji} ${getTranslatedText(group, 'name')}`} 
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <MuiMenu
        id="language-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleLanguageClose}
      >
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <MuiMenuItem
            key={lang}
            onClick={() => handleLanguageSelect(lang)}
            selected={currentLanguage === lang}
          >
            {languageNames[lang]}
          </MuiMenuItem>
        ))}
      </MuiMenu>

      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: { xs: 10, sm: 12 }, 
          pb: 4,
          minHeight: '100vh'
        }}
      >
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 4, 
            flexWrap: 'wrap',
            justifyContent: 'center' 
          }}>
            <Paper
              onClick={() => setSelectedGroup(null)}
              sx={{
                px: 2,
                py: 1,
                cursor: 'pointer',
                bgcolor: !selectedGroup ? 'primary.main' : 'background.paper',
                color: !selectedGroup ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: !selectedGroup ? 'primary.dark' : 'action.hover',
                },
                transition: 'all 0.2s',
              }}
            >
              {allGroupsText[currentLanguage] || allGroupsText.en}
            </Paper>
            {menuGroups.map((group) => (
              <Paper
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                sx={{
                  px: 2,
                  py: 1,
                  cursor: 'pointer',
                  bgcolor: selectedGroup === group.id ? 'primary.main' : 'background.paper',
                  color: selectedGroup === group.id ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: selectedGroup === group.id ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'all 0.2s',
                }}
              >
                {group.emoji} {getTranslatedText(group, 'name')}
              </Paper>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filteredGroups.map((group) => {
            const groupItems = itemsByGroup[group.id] || [];
            if (groupItems.length === 0) return null;

            return (
              <Fade in key={group.id}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3,
                    background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {group.emoji} {getTranslatedText(group, 'name')}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {getTranslatedText(group, 'description')}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)'
                    }, 
                    gap: 3 
                  }}>
                    {groupItems.map((item) => (
                      <Card 
                        key={item.id} 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: (theme) => theme.shadows[8],
                          }
                        }}
                      >
                        {item.image && (
                          <CardMedia
                            component="img"
                            height="200"
                            image={item.image}
                            alt={getTranslatedText(item, 'name')}
                            sx={{ 
                              objectFit: 'cover',
                              transition: 'transform 0.3s',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography 
                            gutterBottom 
                            variant="h6" 
                            component="h3"
                            sx={{
                              fontSize: { xs: '1.1rem', sm: '1.25rem' },
                              fontWeight: 600,
                              color: 'primary.main'
                            }}
                          >
                            {getTranslatedText(item, 'name')}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              minHeight: '3em',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                          >
                            {getTranslatedText(item, 'description')}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Paper>
              </Fade>
            );
          })}
        </Box>
      </Container>

      <ScrollToTop />
    </Box>
  );
};

export default Menu;
