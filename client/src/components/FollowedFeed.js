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
import { useFollow } from '../hooks/useFollow';
import { useCountries } from '../hooks/useCountries';
import { useAuth } from '../context/AuthContext';

const FollowedFeed = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [countryData, setCountryData] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getFollowedFeed, loading: followLoading, error: followError } = useFollow();
    const { searchCountries, loading: countryLoading, error: countryError } = useCountries();

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const fetchPosts = async () => {
        if (!user) return;
        try {
            const data = await getFollowedFeed(user.id, page);
            setPosts(data.posts);
            setTotalPages(data.pagination.totalPages);
            await fetchCountryInfo(data.posts);
        } catch (error) {
            console.error('Error fetching followed posts:', error);
        }
    };

    const fetchCountryInfo = async (postsData) => {
        const uniqueCountries = [...new Set(postsData.map(post => post.country_name))];
        const countryInfoMap = {};
        
        for (const country of uniqueCountries) {
            try {
                const countryArr = await searchCountries(country);
                if (countryArr && countryArr.length > 0) {
                    countryInfoMap[country] = countryArr[0];
                }
            } catch (e) {
                console.log(e);
            }
        }
        setCountryData(countryInfoMap);
    };

    useEffect(() => {
        fetchPosts();
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

    if (followLoading || countryLoading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (followError) {
        return (
            <Typography color="error" align="center">
                {followError}
            </Typography>
        );
    }

    return (
        <Box>
            {posts.map((post) => (
                <Card key={post.id} sx={{ mb: 2 }}>
                    <CardHeader
                        avatar={
                            <Avatar>{post.username[0].toUpperCase()}</Avatar>
                        }
                        title={
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => handleUserClick(post.user_id)}
                            >
                                {post.username}
                            </Link>
                        }
                        subheader={new Date(post.created_at).toLocaleDateString()}
                    />
                    <Divider />
                    <CardContent>
                        {/* Country Insights */}
                        {countryData[post.country_name] && (
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                {countryData[post.country_name].flag?.png && (
                                    <img 
                                        src={countryData[post.country_name].flag.png} 
                                        alt={countryData[post.country_name].flag.alt || 'Flag'} 
                                        style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 4 }} 
                                    />
                                )}
                                <Box>
                                    <Typography variant="body2">
                                        <strong>Capital:</strong> {countryData[post.country_name].capital}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Currency:</strong> {countryData[post.country_name].currencies.map(c => `${c.name} (${c.symbol})`).join(', ')}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        <Typography variant="h6" gutterBottom>
                            {post.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {post.content}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Country: {post.country_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Visit Date: {new Date(post.date_of_visit).toLocaleDateString()}
                        </Typography>
                    </CardContent>
                </Card>
            ))}

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

export default FollowedFeed; 