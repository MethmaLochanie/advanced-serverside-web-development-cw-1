import React, { useEffect, useState } from 'react';
import { Typography, Grid, CircularProgress, Alert, TextField, Button, MenuItem, Box, Pagination } from '@mui/material';
import { useBlogPosts } from '../hooks/useBlogPosts';
import BlogPostCard from '../components/BlogPostCard';
import SortIcon from '@mui/icons-material/Sort';
import CountrySelector from '../components/CountrySelector';

const PAGE_SIZE = 6;

const Home = () => {
  const { getRecentPosts, getPopularPosts, getAllPosts, searchByCountry, searchByUsername } = useBlogPosts();
  const [allPosts, setAllPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search state
  const [searchType, setSearchType] = useState('country');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchPage, setSearchPage] = useState(1);
  const [searching, setSearching] = useState(false);

  // Sort state
  const [allSort, setAllSort] = useState('newest');
  const [recentSort, setRecentSort] = useState('newest');
  const [popularSort, setPopularSort] = useState('mostLiked');

  // Pagination state
  const [allPage, setAllPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const all = await getAllPosts();
        // Fetch only 5 recent posts
        const recent = await getRecentPosts(5);
        const popular = await getPopularPosts(5);
        setAllPosts(all.data || []);
        setRecentPosts(recent.data || []);
        setPopularPosts(popular.data || []);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Search handler
  const handleSearch = async (e, page = 1) => {
    e && e.preventDefault();
    if (!searchValue.trim()) return;
    setSearching(true);
    setError(null);
    try {
      let result;
      if (searchType === 'country') {
        result = await searchByCountry(searchValue, page, PAGE_SIZE);
      } else {
        result = await searchByUsername(searchValue, page, PAGE_SIZE);
      }
      // Support both 'posts' and 'data' keys
      const posts = result.posts || result.data || [];
      setSearchResults(posts);
      setSearchTotal(result.total || (result.data ? result.data.length : 0));
      setSearchPage(page);
    } catch (err) {
      setError('Failed to search posts');
    } finally {
      setSearching(false);
    }
  };

  // Pagination handler
  const handlePageChange = (event, value) => {
    handleSearch(null, value);
  };

  // Reset search
  const handleResetSearch = () => {
    setSearchValue('');
    setSearchResults([]);
    setSearchTotal(0);
    setSearchPage(1);
  };

  const sortPosts = (posts, sortType, section = '') => {
    if (sortType === 'newest') {
      if (section === 'popular') {
        return [...posts].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      }
      return [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortType === 'mostLiked') {
      return [...posts].sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
    } else if (sortType === 'mostCommented') {
      return [...posts].sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
    }
    return posts;
  };

  // Add a derived variable for paginated all posts
  const paginatedAllPosts = sortPosts(allPosts, allSort).slice((allPage - 1) * PAGE_SIZE, allPage * PAGE_SIZE);

  // When sorting or allPosts changes, reset to page 1
  useEffect(() => {
    setAllPage(1);
  }, [allSort, allPosts]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
        Explore Countries
      </Typography>
      <CountrySelector />
      
      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 6 }}>
        Blog Posts
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>All Posts</Typography>
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              value={searchType}
              onChange={e => setSearchType(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="country">Country</MenuItem>
              <MenuItem value="username">Username</MenuItem>
            </TextField>
            <TextField
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder={`Search by ${searchType}`}
              size="small"
              sx={{ minWidth: 200 }}
            />
            <Button type="submit" variant="contained" disabled={searching || !searchValue.trim()}>
              Search
            </Button>
            {(searchResults.length > 0 || searchValue) && (
              <Button onClick={handleResetSearch} disabled={searching}>
                Reset
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SortIcon sx={{ mr: 1 }} />
            <TextField
              select
              size="small"
              value={allSort}
              onChange={e => setAllSort(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="mostLiked">Most Liked</MenuItem>
              <MenuItem value="mostCommented">Most Commented</MenuItem>
            </TextField>
          </Box>
          {searching && <CircularProgress size={24} sx={{ mb: 2 }} />}
          {searchValue && !searching && searchResults && searchResults.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>No results found.</Alert>
          ) : searchResults && searchResults.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {sortPosts(searchResults, allSort).map(post => (
                  <Grid item xs={12} md={6} key={post.id}>
                    <BlogPostCard post={post} />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={Math.ceil(searchTotal / PAGE_SIZE)}
                  page={searchPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <>
              <Grid container spacing={2}>
                {paginatedAllPosts.map(post => (
                  <Grid item xs={12} md={6} key={post.id}>
                    <BlogPostCard post={post} />
                  </Grid>
                ))}
              </Grid>
              {allPosts.length > PAGE_SIZE && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={Math.ceil(allPosts.length / PAGE_SIZE)}
                    page={allPage}
                    onChange={(e, value) => setAllPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
          <Typography variant="h5" sx={{ mt: 6, mb: 2, display: 'flex', alignItems: 'center' }}>
            Recent Posts
            <SortIcon sx={{ ml: 1 }} />
            <TextField
              select
              size="small"
              value={recentSort}
              onChange={e => setRecentSort(e.target.value)}
              sx={{ ml: 2, minWidth: 140 }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="mostLiked">Most Liked</MenuItem>
              <MenuItem value="mostCommented">Most Commented</MenuItem>
            </TextField>
          </Typography>
          <Grid container spacing={2}>
            {sortPosts(recentPosts, recentSort).map(post => (
              <Grid item xs={12} md={6} key={post.id}>
                <BlogPostCard post={post} />
              </Grid>
            ))}
          </Grid>
          <Typography variant="h5" sx={{ mt: 6, mb: 2, display: 'flex', alignItems: 'center' }}>
            Popular Posts
            <SortIcon sx={{ ml: 1 }} />
            <TextField
              select
              size="small"
              value={popularSort}
              onChange={e => setPopularSort(e.target.value)}
              sx={{ ml: 2, minWidth: 140 }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="mostLiked">Most Liked</MenuItem>
              <MenuItem value="mostCommented">Most Commented</MenuItem>
            </TextField>
          </Typography>
          <Grid container spacing={2}>
            {sortPosts(popularPosts, popularSort, 'popular').map(post => (
              <Grid item xs={12} md={6} key={post.id}>
                <BlogPostCard post={post} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Home; 