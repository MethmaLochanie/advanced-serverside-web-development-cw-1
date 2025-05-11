const blogPostService = require('../services/blogPostService');

const createPost = async (req, res, next) => {
    try {
        const { title, content, country } = req.body;
        const userId = req.user.id;
        if (!title || !content || !country) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'Title, content, and country are required'
            });
        }

        const post = await blogPostService.createPost(userId, { title, content, country });
        res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: post
        });
    } catch (error) {
        if (error.message === 'Invalid Country') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Country',
                message: 'The specified country does not exist'
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
        const { title, content, country } = req.body;
        const post = await blogPostService.updatePost(req.params.id, req.user.id, { title, content, country });

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
        if (error.message === 'Invalid Country') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Country',
                message: 'The specified country does not exist'
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

module.exports = {
    createPost,
    getFeed,
    getPost,
    updatePost,
    deletePost,
    searchByCountry,
    searchByUsername
}; 