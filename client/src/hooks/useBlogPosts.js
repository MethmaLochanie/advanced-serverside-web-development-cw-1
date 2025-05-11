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
            setError('Failed to fetch blog posts');
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

    return {
        loading,
        error,
        getAllPosts,
        getPost,
        createPost,
        updatePost,
        deletePost,
        searchByCountry,
        searchByUsername
    };
}; 