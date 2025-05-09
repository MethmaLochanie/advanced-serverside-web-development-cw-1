const BlogPost = require('../database/models/BlogPost');

const blogPostController = {
    // Create a new blog post
    async create(req, res) {
        try {
            const { title, content, country_name, date_of_visit } = req.body;
            const user_id = req.user.id;

            if (!title || !content || !country_name || !date_of_visit) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const result = await BlogPost.create({
                title,
                content,
                country_name,
                date_of_visit,
                user_id
            });

            res.status(201).json({
                message: 'Blog post created successfully',
                postId: result.lastID
            });
        } catch (error) {
            console.error('Error creating blog post:', error);
            res.status(500).json({ error: 'Error creating blog post' });
        }
    },

    // Get all blog posts
    async getAllPosts(req, res) {
        try {
            const posts = await BlogPost.findAll();
            res.json(posts);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            res.status(500).json({ error: 'Error fetching blog posts' });
        }
    },

    // Get a single blog post
    async getPost(req, res) {
        try {
            const post = await BlogPost.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ error: 'Blog post not found' });
            }
            res.json(post);
        } catch (error) {
            console.error('Error fetching blog post:', error);
            res.status(500).json({ error: 'Error fetching blog post' });
        }
    },

    // Update a blog post
    async updatePost(req, res) {
        try {
            const { title, content, country_name, date_of_visit } = req.body;
            const postId = req.params.id;
            const userId = req.user.id;

            // First check if the post exists and belongs to the user
            const post = await BlogPost.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Blog post not found' });
            }
            if (post.user_id !== userId) {
                return res.status(403).json({ error: 'Not authorized to update this post' });
            }

            await BlogPost.update(postId, {
                title,
                content,
                country_name,
                date_of_visit
            });

            res.json({ message: 'Blog post updated successfully' });
        } catch (error) {
            console.error('Error updating blog post:', error);
            res.status(500).json({ error: 'Error updating blog post' });
        }
    },

    // Delete a blog post
    async deletePost(req, res) {
        try {
            const postId = req.params.id;
            const userId = req.user.id;

            // First check if the post exists and belongs to the user
            const post = await BlogPost.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Blog post not found' });
            }
            if (post.user_id !== userId) {
                return res.status(403).json({ error: 'Not authorized to delete this post' });
            }

            await BlogPost.delete(postId);
            res.json({ message: 'Blog post deleted successfully' });
        } catch (error) {
            console.error('Error deleting blog post:', error);
            res.status(500).json({ error: 'Error deleting blog post' });
        }
    }
};

module.exports = blogPostController; 