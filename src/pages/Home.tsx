import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material';
import { Mic, Volume2, Copy, History, RotateCcw } from 'lucide-react';
import translationService from '../services/translationService';

// Add type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: unknown;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const Home = () => {
  // Text state
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Audio features
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs
  const sourceTextRef = useRef<HTMLTextAreaElement>(null);

  // Speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  // Initialize microphone
  const initializeMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream after testing
      return true;
    } catch (err) {
      console.error('Microphone initialization error:', err);
      return false;
    }
  };

  // Set up speech recognition
  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update text with both final and interim results
        setSourceText(finalTranscript + interimTranscript);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        // If we were recording, try to restart it
        if (isRecording) {
          try {
            recognition.start();
          } catch (err) {
            console.error('Failed to restart speech recognition:', err);
            setError('Speech recognition stopped unexpectedly. Please try again.');
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'Speech recognition error occurred.';
        
        switch (event.error) {
          case 'audio-capture':
            errorMessage = 'No microphone detected. Please check your microphone connection and permissions.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your internet connection.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access was denied. Please allow microphone access in your browser settings.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service is not allowed. Please check your browser settings.';
            break;
          case 'bad-grammar':
            errorMessage = 'Speech recognition grammar error.';
            break;
          case 'language-not-supported':
            errorMessage = 'Language not supported.';
            break;
          case 'no-speech':
            errorMessage = 'No speech was detected. Please try speaking again.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was aborted.';
            break;
        }
        
        setError(errorMessage);
        setIsRecording(false);
      };

      recognition.onstart = () => {
        setIsRecording(true);
        setError(null); // Clear any previous errors
      };
    }
  }, [isRecording, recognition]); // Add isRecording to dependencies
  
  // Toggle speech recognition
  const toggleSpeechRecognition = async () => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      try {
        recognition.stop();
        setIsRecording(false);
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
        setError('Failed to stop speech recognition. Please try again.');
      }
    } else {
      // Check microphone access before starting
      const hasMicrophone = await initializeMicrophone();
      if (!hasMicrophone) {
        setError('Please allow microphone access in your browser settings');
        return;
      }

      try {
        setSourceText('');
        setError(null); // Clear any previous errors
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setError('Failed to start speech recognition. Please try again.');
        setIsRecording(false);
      }
    }
  };
  
  // Text-to-speech for translated text
  const speakTranslatedText = () => {
    if (!translatedText) return;
    
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = 'te'; // Telugu language code
    
    utterance.onstart = () => {
      setIsPlaying(true);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    speechSynthesis.speak(utterance);
  };
  
  // Copy translated text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopySuccess(true);
  };
  
  // Handle copy success notification close
  const handleCopySnackbarClose = () => {
    setCopySuccess(false);
  };
  
  // Reset translation
  const resetTranslation = () => {
    if (isRecording) {
      recognition?.stop();
      setIsRecording(false);
    }
    setSourceText('');
    setTranslatedText('');
    setError(null);
    if (sourceTextRef.current) {
      sourceTextRef.current.focus();
    }
  };
  
  // Handle translation
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter some text to translate');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const translatedText = await translationService.translate(sourceText);
      setTranslatedText(translatedText);
      
      // Save to history
      await translationService.saveTranslation(sourceText, translatedText);
    } catch (err: unknown) {
      console.error('Translation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to translate. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box className="slide-up">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          English to Telugu Translator
        </Typography>
        
        <Tooltip title="View Translation History">
          <Button
            component={RouterLink}
            to="/history"
            startIcon={<History size={20} />}
            variant="outlined"
            color="primary"
            sx={{ 
              borderRadius: 2,
              py: 1,
              px: { xs: 2, sm: 3 }
            }}
          >
            History
          </Button>
        </Tooltip>
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
        elevation={4}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          mb: 4,
          transition: 'all 0.3s ease'
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <TextField
            multiline
            fullWidth
            rows={5}
            placeholder="Enter English text here..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            inputRef={sourceTextRef}
            variant="outlined"
            InputProps={{
              sx: { 
                borderRadius: 2,
                fontSize: '1rem',
                lineHeight: 1.5
              }
            }}
          />
          
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 10, 
              right: 10,
              display: 'flex',
              gap: 1
            }}
          >
            <Tooltip title={isRecording ? "Stop Recording" : "Start Voice Input"}>
              <IconButton 
                color={isRecording ? "error" : "primary"}
                onClick={toggleSpeechRecognition}
                sx={{ 
                  bgcolor: isRecording ? 'rgba(255, 0, 0, 0.1)' : 'rgba(138, 43, 226, 0.1)'
                }}
              >
                <Mic size={20} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Clear Text">
              <IconButton
                color="inherit"
                onClick={resetTranslation}
                disabled={!sourceText}
              >
                <RotateCcw size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            my: 2
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={loading || !sourceText.trim()}
            onClick={handleTranslate}
            sx={{ 
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
              minWidth: 180,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 10px rgba(138, 43, 226, 0.25)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Translate'
            )}
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            TRANSLATED TEXT
          </Typography>
        </Divider>
        
        <Box 
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            minHeight: 120,
            position: 'relative'
          }}
        >
          {translatedText ? (
            <>
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  fontFamily: '"Noto Sans Telugu", sans-serif',
                  lineHeight: 1.6
                }}
              >
                {translatedText}
              </Typography>
              
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 10, 
                  right: 10,
                  display: 'flex',
                  gap: 1
                }}
              >
                <Tooltip title="Listen">
                  <IconButton 
                    color="primary" 
                    onClick={speakTranslatedText}
                    disabled={isPlaying}
                  >
                    <Volume2 size={20} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Copy to Clipboard">
                  <IconButton 
                    color="primary"
                    onClick={copyToClipboard}
                  >
                    <Copy size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                textAlign: 'center',
                mt: 3
              }}
            >
              Translated text will appear here
            </Typography>
          )}
        </Box>
      </Paper>
      
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleCopySnackbarClose}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Home;