const BlogPost = require('../database/models/BlogPost');
const { validateAndGetCountryDetails } = require('../utils/countryApi');

// Helper function to enrich post with country_name details
const enrichPostWithCountryDetails = async (post) => {
    if (!post || !post.country_name) {
        console.error('Invalid post data:', post);
        return post;
    }

    try {
        const countryDetails = await validateAndGetCountryDetails(post.country_name);
        return {
            ...post,
            country_flag: countryDetails.flag,
            country_currency: countryDetails.currency,
            country_capital: countryDetails.capital
        };
    } catch (error) {
        console.error('Error fetching country details:', error);
        // Return post without enrichment rather than failing
        return {
            ...post,
            country_flag: null,
            country_currency: null,
            country_capital: null
        };
    }
};


const createPost = async (userId, { title, content, country_name, date_of_visit }) => {
    // Validate country_name exists
    await validateAndGetCountryDetails(country_name);

    return await BlogPost.create({
        title,
        content,
        country_name,
        date_of_visit,
        user_id: userId
    });
};

const getFeed = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const posts = await BlogPost.findAll(limit, offset);
    const total = await BlogPost.getTotalCount();

    if (!posts.length) {
        return {
            posts: [],
            total,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        };
    }

    const enrichedPosts = await Promise.all(
        posts.map(post => enrichPostWithCountryDetails(post))
    );

    return {
        posts: enrichedPosts,
        total,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        }
    };
};

const getPost = async (postId) => {
    const post = await BlogPost.findById(postId);
    if (!post) return null;

    return await enrichPostWithCountryDetails(post);
};

const updatePost = async (postId, userId, { title, content, country_name }) => {
    const post = await BlogPost.findById(postId);
    if (!post) return null;

    if (post.user_id !== userId) {
        throw new Error('Unauthorized');
    }
    if (country_name && country_name !== post.country_name) {
        await validateAndGetCountryDetails(country_name);
        post.country_name = country_name;
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await BlogPost.update(postId, post);
    return post;
};

const deletePost = async (postId, userId) => {
    const post = await BlogPost.findById(postId);
    if (!post) return false;

    if (post.user_id !== userId) {
        throw new Error('Unauthorized');
    }

    await BlogPost.delete(postId);
    return true;
};

const searchByCountry = async (country_name, page = 1, limit = 10) => {
    const posts = await BlogPost.findByCountry(country_name, parseInt(page), parseInt(limit));
    const total = await BlogPost.getTotalCountByCountry(country_name);

    if (!posts.length) {
        return {
            posts: [],
            total,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        };
    }

    const enrichedPosts = await Promise.all(
        posts.map(post => enrichPostWithCountryDetails(post))
    );

    return {
        posts: enrichedPosts,
        total,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        }
    };
};

const searchByUsername = async (username, page = 1, limit = 10) => {
    const posts = await BlogPost.findByUsername(username, parseInt(page), parseInt(limit));
    const total = await BlogPost.getTotalCountByUsername(username);

    if (!posts.length) {
        return {
            posts: [],
            total,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        };
    }

    const enrichedPosts = await Promise.all(
        posts.map(post => enrichPostWithCountryDetails(post))
    );

    return {
        posts: enrichedPosts,
        total,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        }
    };
};

module.exports = {
    createPost,
    getFeed,
    getPost,
    updatePost,
    deletePost,
    searchByCountry,
    searchByUsername,
    enrichPostWithCountryDetails
}; 