import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  ArrowBack as BackIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';

const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://paste-binn.onrender.com/api';



const ViewPaste = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaste();
  }, [id]);

  const fetchPaste = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/pastes/${id}`);
      
      if (response.data.success) {
        setPaste(response.data.data);
      } else {
        setError('Paste not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load paste');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getLanguageName = (lang) => {
    return lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="fade-in">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/')}
        >
          Back
        </Button>
        
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<CopyIcon />}
            onClick={() => copyToClipboard(paste.content)}
          >
            Copy Content
          </Button>
          <Button
            variant="outlined"
            startIcon={<CopyIcon />}
            onClick={() => copyToClipboard(window.location.href)}
          >
            Copy URL
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
            <Box>
              <Typography variant="h4" gutterBottom color="primary">
                {paste.title}
              </Typography>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <Chip
                  icon={<CodeIcon />}
                  label={getLanguageName(paste.language)}
                  color="secondary"
                />
                <Chip
                  icon={<ViewIcon />}
                  label={`${paste.views} views`}
                  variant="outlined"
                />
                <Chip
                  icon={<CalendarIcon />}
                  label={format(new Date(paste.createdAt), 'PPpp')}
                  variant="outlined"
                />
                <Chip
                  icon={<TimeIcon />}
                  label={`Expires ${formatDistanceToNow(new Date(paste.expiresAt))}`}
                  color="warning"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Paper 
            variant="outlined" 
            sx={{ 
              backgroundColor: '#0d1117',
              overflow: 'auto',
              maxHeight: '70vh'
            }}
          >
            {paste.language === 'text' ? (
              <Box p={3}>
                <Typography 
                  component="pre" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: '"Roboto Mono", monospace',
                    color: '#c9d1d9',
                    margin: 0
                  }}
                >
                  {paste.content}
                </Typography>
              </Box>
            ) : (
              <SyntaxHighlighter
                language={paste.language}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  backgroundColor: 'transparent',
                  fontSize: '14px'
                }}
              >
                {paste.content}
              </SyntaxHighlighter>
            )}
          </Paper>

          <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Paste ID: {paste._id}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Created {formatDistanceToNow(new Date(paste.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom color="primary">
          📋 Want to create your own paste?
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create')}
          sx={{ mt: 1 }}
        >
          Create New Paste
        </Button>
      </Box>
    </Box>
  );
};

export default ViewPaste;