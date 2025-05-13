const blogPostService = require('../services/blogPostService');

const createPost = async (req, res, next) => {
    try {
        const { title, content, country_name, country_cca3, date_of_visit } = req.body;
        const userId = req.user.id;
        if (!title || !content || !country_name || !date_of_visit) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'Title, content, country, and date of visit are required'
            });
        }

        const post = await blogPostService.createPost(userId, { title, content, country_name, country_cca3, date_of_visit });
        res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: post
        });
    } catch (error) {
        if (
            error.message === 'Invalid Country' ||
            error.message === 'Country not found'
        ) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Country',
                message: 'Country not found'
            });
        }
        next(error);
    }
};

const getFeed = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await blogPostService.getFeed(page, limit);

        if (!result.posts.length) {
            return res.status(200).json({
                success: true,
                message: 'No blog posts found',
                data: [],
                pagination: result.pagination
            });
        }

        res.json({
            success: true,
            message: 'Blog posts retrieved successfully',
            data: result.posts,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const getPost = async (req, res, next) => {
    try {
        const post = await blogPostService.getPost(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }

        res.json({
            success: true,
            message: 'Blog post retrieved successfully',
            data: post
        });
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const { title, content, country_name, country_cca3 } = req.body;
        const post = await blogPostService.updatePost(req.params.id, req.user.id, { title, content, country_name, country_cca3 });

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }

        res.json({
            success: true,
            message: 'Blog post updated successfully',
            data: post
        });
    } catch (error) {
        if (error.message === 'Unauthorized') {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized',
                message: 'You are not authorized to update this post'
            });
        }
        if (
            error.message === 'Invalid Country' ||
            error.message === 'Country not found'
        ) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Country',
                message: 'Country not found'
            });
        }
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const deleted = await blogPostService.deletePost(req.params.id, req.user.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }

        res.json({
            success: true,
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        if (error.message === 'Unauthorized') {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized',
                message: 'You are not authorized to delete this post'
            });
        }
        next(error);
    }
};

const searchByCountry = async (req, res, next) => {
    try {
        const { country, page = 1, limit = 10 } = req.query;
        
        if (!country) {
            return res.status(400).json({
                success: false,
                error: 'Missing Parameter',
                message: 'Country name is required for search'
            });
        }

        const result = await blogPostService.searchByCountry(country, page, limit);

        if (!result.posts.length) {
            return res.status(200).json({
                success: true,
                message: `No blog posts found for country: ${country}`,
                data: [],
                pagination: result.pagination
            });
        }

        res.json({
            success: true,
            message: `Blog posts for country: ${country} retrieved successfully`,
            data: result.posts,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const searchByUsername = async (req, res, next) => {
    try {
        const { username, page = 1, limit = 10 } = req.query;
        
        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'Missing Parameter',
                message: 'Username is required for search'
            });
        }

        const result = await blogPostService.searchByUsername(username, page, limit);

        if (!result.posts.length) {
            return res.status(200).json({
                success: true,
                message: `No blog posts found for username: ${username}`,
                data: [],
                pagination: result.pagination
            });
        }

        res.json({
            success: true,
            message: `Blog posts for username: ${username} retrieved successfully`,
            data: result.posts,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const toggleDislike = async (req, res, next) => {
    try {
        const result = await blogPostService.toggleDislike(req.params.id, req.user.id);
        res.json({
            success: true,
            message: result.isDisliked ? 'Post disliked' : 'Post undisliked',
            data: result
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }
        next(error);
    }
};

const getDislikeStatus = async (req, res, next) => {
    try {
        const result = await blogPostService.getDislikeStatus(req.params.id, req.user.id);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }
        next(error);
    }
};

const getDislikeCount = async (req, res, next) => {
    try {
        const count = await blogPostService.getDislikeCount(req.params.id);
        res.json({
            success: true,
            data: { count }
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }
        next(error);
    }
};

const toggleLike = async (req, res, next) => {
    try {
        const result = await blogPostService.toggleLike(req.params.id, req.user.id);
        res.json({
            success: true,
            message: result.isLiked ? 'Post liked' : 'Post unliked',
            data: result
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }
        next(error);
    }
};

const getLikeStatus = async (req, res, next) => {
    try {
        const result = await blogPostService.getLikeStatus(req.params.id, req.user.id);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }
        next(error);
    }
};

const getLikeCount = async (req, res, next) => {
    try {
        const count = await blogPostService.getLikeCount(req.params.id);
        res.json({
            success: true,
            data: { count }
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }
        next(error);
    }
};

const addComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({
                success: false,
                error: 'Missing Content',
                message: 'Comment content is required'
            });
        }

        const commentId = await blogPostService.addComment(req.params.id, req.user.id, content);
        const comments = await blogPostService.getComments(req.params.id);
        
        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: comments
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }
        next(error);
    }
};

const getComments = async (req, res, next) => {
    try {
        const comments = await blogPostService.getComments(req.params.id);
        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                success: false,
                error: 'Post Not Found',
                message: 'The requested blog post does not exist'
            });
        }
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const deleted = await blogPostService.deleteComment(req.params.commentId, req.user.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Comment Not Found',
                message: 'The requested comment does not exist or you are not authorized to delete it'
            });
        }

        const comments = await blogPostService.getComments(req.params.id);
        res.json({
            success: true,
            message: 'Comment deleted successfully',
            data: comments
        });
    } catch (error) {
        next(error);
    }
};

const getPopularPosts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const posts = await blogPostService.getPopularPosts(limit);
        res.json({
            success: true,
            message: 'Popular blog posts retrieved successfully',
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

const getRecentPosts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const posts = await blogPostService.getRecentPosts(limit);
        res.json({
            success: true,
            message: 'Recent blog posts retrieved successfully',
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getFeed,
    getPost,
    updatePost,
    deletePost,
    searchByCountry,
    searchByUsername,
    toggleDislike,
    getDislikeStatus,
    getDislikeCount,
    toggleLike,
    getLikeStatus,
    getLikeCount,
    addComment,
    getComments,
    deleteComment,
    getPopularPosts,
    getRecentPosts
}; 