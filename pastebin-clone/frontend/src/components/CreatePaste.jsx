import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper
} from '@mui/material';
import {
  Send as SendIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const languageOptions = [
  'text', 'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
  'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'html', 'css',
  'sql', 'json', 'xml', 'yaml', 'markdown', 'bash'
];

const CreatePaste = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    language: 'text'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/pastes`, formData);
      
      if (response.data.success) {
        setSuccess('Paste created successfully!');
        setPasteUrl(response.data.url);
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          language: 'text'
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create paste');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pasteUrl) {
      navigator.clipboard.writeText(pasteUrl);
      // You could add a toast notification here
    }
  };

  return (
    <Box className="fade-in">
      <Typography variant="h4" gutterBottom color="primary">
         Create New Paste
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Title (Optional)"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Untitled"
                  margin="normal"
                  variant="outlined"
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Language</InputLabel>
                  <Select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    label="Language"
                    startAdornment={<CodeIcon sx={{ mr: 1 }} />}
                  >
                    {languageOptions.map(lang => (
                      <MenuItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={12}
                  placeholder="Paste your code or text here..."
                  required
                  sx={{ mt: 2 }}
                  InputProps={{
                    style: {
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: '14px'
                    }
                  }}
                />
                
                <Box display="flex" gap={2} mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SendIcon />}
                    disabled={loading || !formData.content.trim()}
                    sx={{ px: 4 }}
                  >
                    {loading ? 'Creating...' : 'Create Paste'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      setFormData({
                        title: '',
                        content: '',
                        language: 'text'
                      });
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </form>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                📋 Quick Tips
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                • Use a descriptive title to help others find your paste
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                • Select the correct language for syntax highlighting
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                • Pastes automatically expire after 7 days
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                • Keep sensitive information secure
              </Typography>
            </CardContent>
          </Card>
          
          {pasteUrl && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🔗 Your Paste URL
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mt: 1, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'background.default'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      wordBreak: 'break-all',
                      fontFamily: '"Roboto Mono", monospace'
                    }}
                  >
                    {pasteUrl}
                  </Typography>
                  <IconButton onClick={copyToClipboard} size="small">
                    <CopyIcon />
                  </IconButton>
                </Paper>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(pasteUrl.split('/').pop())}
                >
                  View Paste
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatePaste;