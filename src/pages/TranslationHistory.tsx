import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { Trash2, Copy, Volume2 } from 'lucide-react';
import translationService, { Translation } from '../services/translationService';

const TranslationHistory = () => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  // State
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openClearDialog, setOpenClearDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Fetch translation history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await translationService.getHistory();
        setTranslations(history);
      } catch (err: any) {
        console.error('Fetch history error:', err);
        setError(err.response?.data?.message || 'Failed to load translation history.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);
  
  // Delete a translation
  const deleteTranslation = async (id: string) => {
    setIsDeleting(true);
    
    try {
      await translationService.deleteTranslation(id);
      setTranslations(translations.filter(translation => translation.id !== id));
    } catch (err: any) {
      console.error('Delete translation error:', err);
      setError(err.response?.data?.message || 'Failed to delete translation.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Clear all history
  const clearHistory = async () => {
    setOpenClearDialog(false);
    setIsDeleting(true);
    
    try {
      await translationService.clearHistory();
      setTranslations([]);
    } catch (err: any) {
      console.error('Clear history error:', err);
      setError(err.response?.data?.message || 'Failed to clear history.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Copy text to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    
    // Clear success message after 2 seconds
    setTimeout(() => {
      setCopySuccess(null);
    }, 2000);
  };
  
  // Text-to-speech
  const speakText = (text: string, id: string) => {
    if (playingId) {
      speechSynthesis.cancel();
      if (playingId === id) {
        setPlayingId(null);
        return;
      }
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'te'; // Telugu language code
    
    utterance.onstart = () => {
      setPlayingId(id);
    };
    
    utterance.onend = () => {
      setPlayingId(null);
    };
    
    speechSynthesis.speak(utterance);
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Box className="slide-up">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Translation History
        </Typography>
        
        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpenClearDialog(true)}
          disabled={translations.length === 0 || loading}
          sx={{ 
            borderRadius: 2,
            py: 1,
            px: { xs: 2, sm: 3 }
          }}
        >
          Clear All
        </Button>
      </Box>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <Box 
            sx={{ 
              p: 4, 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              height: 200
            }}
          >
            <CircularProgress />
          </Box>
        ) : translations.length === 0 ? (
          <Box 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              py: 8
            }}
          >
            <Typography variant="h6" gutterBottom>
              No translations found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your translation history will appear here
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {translations.map((translation, index) => (
              <Box key={translation.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{ 
                    p: 0,
                    display: 'block'
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 3,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 }
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {formatDate(translation.createdAt)}
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          display: 'flex',
                          gap: 1,
                          order: { xs: -1, sm: 0 }
                        }}
                      >
                        <Tooltip title={isDeleting ? 'Deleting...' : 'Delete'}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteTranslation(translation.id)}
                            disabled={isDeleting}
                            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="body1" gutterBottom>
                        <strong>English:</strong> {translation.sourceText}
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          mt: 1.5, 
                          p: 2, 
                          borderRadius: 2, 
                          bgcolor: 'background.default',
                          position: 'relative',
                          pr: 5
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: '"Noto Sans Telugu", sans-serif',
                            lineHeight: 1.6
                          }}
                        >
                          <strong>తెలుగు:</strong> {translation.translatedText}
                        </Typography>
                        
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                          }}
                        >
                          <Tooltip title={playingId === translation.id ? 'Stop' : 'Listen'}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => speakText(translation.translatedText, translation.id)}
                            >
                              <Volume2 size={18} />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={copySuccess === translation.id ? 'Copied!' : 'Copy'}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => copyToClipboard(translation.translatedText, translation.id)}
                            >
                              <Copy size={18} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Paper>
      
      {/* Clear All Confirmation Dialog */}
      <Dialog
        open={openClearDialog}
        onClose={() => setOpenClearDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" fontWeight={600}>
            Clear Translation History
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear your entire translation history? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenClearDialog(false)} 
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={clearHistory} 
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TranslationHistory;