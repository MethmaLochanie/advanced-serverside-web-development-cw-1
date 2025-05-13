import { useState } from 'react';
import { blogPostService } from '../api/blogPosts';
import { useAuth } from '../context/AuthContext';

export const useBlogPosts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const validatePostData = (postData) => {
        if (!postData.title?.trim()) {
            throw new Error('Title is required');
        }
        if (!postData.content?.trim()) {
            throw new Error('Content is required');
        }
        if (!postData.country_name?.trim()) {
            throw new Error('Country name is required');
        }
        if (!postData.date_of_visit) {
            throw new Error('Date of visit is required');
        }
    };

    const getAllPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.getAllPosts();
            return data;
        } catch (err) {
            setError('Failed to fetch all posts');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getPost = async (id) => {
        if (!id) {
            throw new Error('Post ID is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.getPost(id);
            return data;
        } catch (err) {
            setError('Failed to fetch blog post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createPost = async (postData) => {
        if (!user) {
            throw new Error('You must be logged in to create a post');
        }
        validatePostData(postData);
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.createPost(postData);
            return data;
        } catch (err) {
            setError('Failed to create blog post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePost = async (id, postData) => {
        if (!user) {
            throw new Error('You must be logged in to update a post');
        }
        if (!id) {
            throw new Error('Post ID is required');
        }
        validatePostData(postData);
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.updatePost(id, postData);
            return data;
        } catch (err) {
            setError('Failed to update blog post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id) => {
        if (!user) {
            throw new Error('You must be logged in to delete a post');
        }
        if (!id) {
            throw new Error('Post ID is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.deletePost(id);
            return data;
        } catch (err) {
            setError('Failed to delete blog post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const searchByCountry = async (country, page = 1, limit = 10) => {
        if (!country?.trim()) {
            throw new Error('Country name is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.searchByCountry(country, page, limit);
            return data;
        } catch (err) {
            setError('Failed to search blog posts by country');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const searchByUsername = async (username, page = 1, limit = 10) => {
        if (!username?.trim()) {
            throw new Error('Username is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.searchByUsername(username, page, limit);
            return data;
        } catch (err) {
            setError('Failed to search blog posts by username');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (postId, comment) => {
        if (!user) {
            throw new Error('You must be logged in to comment');
        }
        if (!comment?.trim()) {
            throw new Error('Comment cannot be empty');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.addComment(postId, comment);
            return data;
        } catch (err) {
            setError('Failed to add comment');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getComments = async (postId) => {
        if (!postId) {
            throw new Error('Post ID is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.getComments(postId);
            return data;
        } catch (err) {
            setError('Failed to fetch comments');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (postId, commentId) => {
        if (!user) {
            throw new Error('You must be logged in to delete a comment');
        }
        if (!postId || !commentId) {
            throw new Error('Post ID and Comment ID are required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.deleteComment(postId, commentId);
            return data;
        } catch (err) {
            setError('Failed to delete comment');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const toggleDislike = async (postId) => {
        if (!user) {
            throw new Error('You must be logged in to dislike a post');
        }
        if (!postId) {
            throw new Error('Post ID is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.toggleDislike(postId);
            return data;
        } catch (err) {
            setError('Failed to toggle dislike');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getDislikeStatus = async (postId) => {
        if (!user) {
            throw new Error('You must be logged in to check dislike status');
        }
        if (!postId) {
            throw new Error('Post ID is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.getDislikeStatus(postId);
            return data;
        } catch (err) {
            setError('Failed to get dislike status');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getDislikeCount = async (postId) => {
        if (!postId) {
            throw new Error('Post ID is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.getDislikeCount(postId);
            return data;
        } catch (err) {
            setError('Failed to fetch dislike count');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (postId) => {
        if (!user) {
            throw new Error('You must be logged in to like a post');
        }
        if (!postId) {
            throw new Error('Post ID is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.toggleLike(postId);
            return data;
        } catch (err) {
            setError('Failed to toggle like');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getLikeStatus = async (postId) => {
        if (!user) {
            throw new Error('You must be logged in to check like status');
        }
        if (!postId) {
            throw new Error('Post ID is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.getLikeStatus(postId);
            return data;
        } catch (err) {
            setError('Failed to get like status');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getLikeCount = async (postId) => {
        if (!postId) {
            throw new Error('Post ID is required');
        }
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.getLikeCount(postId);
            return data;
        } catch (err) {
            setError('Failed to fetch like count');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getRecentPosts = async (limit = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.getRecentPosts(limit);
            return data;
        } catch (err) {
            setError('Failed to fetch recent posts');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getPopularPosts = async (limit = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data = await blogPostService.getPopularPosts(limit);
            return data;
        } catch (err) {
            setError('Failed to fetch popular posts');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getAllPosts,
        getPost,
        createPost,
        updatePost,
        deletePost,
        searchByCountry,
        searchByUsername,
        addComment,
        getComments,
        deleteComment,
        toggleDislike,
        getDislikeStatus,
        getDislikeCount,
        toggleLike,
        getLikeStatus,
        getLikeCount,
        getRecentPosts,
        getPopularPosts
    };
}; 