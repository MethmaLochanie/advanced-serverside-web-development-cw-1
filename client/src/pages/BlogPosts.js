import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Paper, TextField, Pagination, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { blogPostService } from '../api/blogPosts';
import BlogPostCard from '../components/BlogPostCard';
import { useAuth } from '../context/AuthContext';
import { fetchCountriesByName } from '../api/countries';

const BlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countryData, setCountryData] = useState({});
    const [searchType, setSearchType] = useState('all'); // 'all', 'country', 'username'
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (searchType === 'all') {
            fetchPostsAndCountries();
        }
    }, [searchType]);

    const fetchPostsAndCountries = async () => {
        try {
            const data = await blogPostService.getAllPosts();
            setPosts(data);
            await fetchCountryInfo(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch blog posts');
            setLoading(false);
        }
    };

    const fetchCountryInfo = async (postsData) => {
        const uniqueCountries = [...new Set(postsData.map(post => post.country_name))];
        const countryInfoMap = {};
        const apiKey = user?.apiKeys && user.apiKeys[0];
        for (const country of uniqueCountries) {
            try {
                if (apiKey) {
                    const countryArr = await fetchCountriesByName(apiKey, country);
                    if (countryArr && countryArr.length > 0) {
                        countryInfoMap[country] = countryArr[0];
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
        setCountryData(countryInfoMap);
    };

    const handleSearch = async (page = 1) => {
        if (!searchQuery.trim()) {
            setSearchType('all');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (searchType === 'country') {
                response = await blogPostService.searchByCountry(searchQuery, page);
            } else if (searchType === 'username') {
                response = await blogPostService.searchByUsername(searchQuery, page);
            }

            if (response) {
                setPosts(response.posts);
                setPagination(response.pagination);
                await fetchCountryInfo(response.posts);
            }
        } catch (err) {
            setError('Failed to search blog posts');
        }
        setLoading(false);
    };

    const handlePageChange = (event, value) => {
        handleSearch(value);
    };

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setSearchQuery('');
        setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10
        });
    };

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await blogPostService.deletePost(postId);
                setPosts(posts.filter(post => post.id !== postId));
            } catch (err) {
                setError('Failed to delete post');
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Travel Stories
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button
                            variant={searchType === 'all' ? 'contained' : 'outlined'}
                            onClick={() => handleSearchTypeChange('all')}
                            fullWidth
                        >
                            All Posts
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button
                            variant={searchType === 'country' ? 'contained' : 'outlined'}
                            onClick={() => handleSearchTypeChange('country')}
                            fullWidth
                        >
                            Search by Country
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button
                            variant={searchType === 'username' ? 'contained' : 'outlined'}
                            onClick={() => handleSearchTypeChange('username')}
                            fullWidth
                        >
                            Search by Username
                        </Button>
                    </Grid>
                </Grid>

                {(searchType === 'country' || searchType === 'username') && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                            fullWidth
                            label={`Search by ${searchType}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button
                            variant="contained"
                            onClick={() => handleSearch()}
                            sx={{ minWidth: 100 }}
                        >
                            Search
                        </Button>
                    </Box>
                )}

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : posts.length === 0 ? (
                    <Typography>No blog posts found.</Typography>
                ) : (
                    <>
                        {posts.map(post => (
                            <BlogPostCard
                                key={post.id}
                                post={post}
                                onDelete={handleDelete}
                                isOwner={user && user.id === post.user_id}
                                countryInfo={countryData[post.country_name]}
                            />
                        ))}
                        
                        {pagination.totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={pagination.totalPages}
                                    page={pagination.currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Container>
    );
};

export default BlogPosts; 