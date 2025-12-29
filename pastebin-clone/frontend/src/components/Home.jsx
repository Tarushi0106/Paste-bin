import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';


const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://paste-binn.onrender.com/api';


console.log("API_URL =", API_URL);

const Home = () => {
  const [recentPastes, setRecentPastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentPastes();
  }, []);

  const fetchRecentPastes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/pastes`);
      if (response.data.success) {
        setRecentPastes(response.data.data);
      }
    } catch (err) {
      setError('Failed to load recent pastes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPastes = recentPastes.filter(paste =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paste.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (id) => {
    const url = `${window.location.origin}/paste/${id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search pastes..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/create"
          sx={{ px: 3 }}
        >
          Create New Paste
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
         Recent Pastes
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPastes.map((paste) => (
            <Grid item xs={12} sm={6} md={4} key={paste._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>
                      {paste.title}
                    </Typography>
                    <Chip 
                      icon={<CodeIcon />} 
                      label={paste.language} 
                      size="small" 
                      color="secondary"
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ViewIcon fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {paste.views} views
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(paste.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" gap={1} mt={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      component={Link}
                      to={`/paste/${paste._id}`}
                    >
                      View
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(paste._id)}
                      sx={{ border: 1, borderColor: 'divider' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredPastes.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'No pastes found' : 'No pastes yet. Create one!'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Home;