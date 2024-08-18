import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const API_KEY = '8be8f9112d4f49e8bc35100bb649ce2b';

const Search = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/autocomplete?apiKey=${API_KEY}&number=5&query=${query}`
      );
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  useEffect(() => {
    if (inputValue) {
      debouncedFetchSuggestions(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleOptionSelect = (event, option) => {
    if (option) {
      navigate(`/recipe/${option.id}`);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>
      <Autocomplete
        freeSolo
        options={options}
        getOptionLabel={(option) => option.title || ''}
        onInputChange={handleInputChange}
        onChange={handleOptionSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search recipes"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Box>
  );
};

export default Search;