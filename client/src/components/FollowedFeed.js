import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Avatar,
    CircularProgress,
    Pagination,
    Divider,
    Link
} from '@mui/material';
import { getFollowedUsersPosts } from '../api/followApi';
import { useAuth } from '../context/AuthContext';
import { fetchCountriesByName } from '../api/countries';

const FollowedFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [countryData, setCountryData] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const fetchPosts = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getFollowedUsersPosts(user.id, page);
            setPosts(data.posts);
            setTotalPages(data.pagination.totalPages);
            await fetchCountryInfo(data.posts);
        } catch (error) {
            console.error('Error fetching followed posts:', error);
        } finally {
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

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line
    }, [user, page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (!user) {
        return (
            <Typography align="center" color="textSecondary">
                Please log in to view your feed
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
            <Typography variant="h5" gutterBottom>
                Feed from Followed Users
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : posts.length > 0 ? (
                <>
                    {posts.map((post) => (
                        <Card key={post.id} sx={{ mb: 2 }}>
                            <CardHeader
                                avatar={
                                    <Avatar 
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => handleUserClick(post.author_id)}
                                    >
                                        {post.author_username[0].toUpperCase()}
                                    </Avatar>
                                }
                                title={post.title}
                                subheader={
                                    <Box>
                                        <Link
                                            component="span"
                                            onClick={() => handleUserClick(post.author_id)}
                                            sx={{ 
                                                cursor: 'pointer',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            Posted by {post.author_username}
                                        </Link>
                                        {' on '}
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </Box>
                                }
                            />
                            <Divider />
                            <CardContent>
                                {/* Country Insights */}
                                {countryData[post.country_name] && (
                                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {countryData[post.country_name].flag?.png && (
                                            <img src={countryData[post.country_name].flag.png} alt={countryData[post.country_name].flag.alt || 'Flag'} style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 4 }} />
                                        )}
                                        <Box>
                                            <Typography variant="body2"><strong>Capital:</strong> {countryData[post.country_name].capital}</Typography>
                                            <Typography variant="body2"><strong>Currency:</strong> {countryData[post.country_name].currencies.map(c => `${c.name} (${c.symbol})`).join(', ')}</Typography>
                                        </Box>
                                    </Box>
                                )}
                                <Typography variant="body1" paragraph>
                                    {post.content}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Country: {post.country_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Visit Date: {post.date_of_visit}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            ) : (
                <Typography align="center" color="textSecondary">
                    No posts from followed users yet
                </Typography>
            )}
        </Box>
    );
};

export default FollowedFeed; 