const BlogPost = require('../database/models/BlogPost');
const { validateAndGetCountryDetails, fetchCountryByName } = require('../utils/countryApi');

// Helper function to validate and format date
const validateAndFormatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

// Helper function to enrich post with country_name details
const enrichPostWithCountryDetails = async (post) => {
    if (!post || !(post.country_name || post.country_cca3)) {
        console.error('Invalid post data:', post);
        return post;
    }

    try {
        const countries = await fetchCountryByName(post.country_name);
        let country = null;
        if (post.country_cca3 && Array.isArray(countries)) {
            country = countries.find(c => c.cca3 === post.country_cca3);
        }
        if (!country && Array.isArray(countries) && countries.length > 0) {
            country = countries[0];
        }
        if (!country) {
            throw new Error('Country not found');
        }
        const countryDetails = {
            flag: country.flag?.png || country.flag?.svg,
            currency: country.currencies ? Object.values(country.currencies)[0]?.name : null,
            capital: country.capital?.[0] || null
        };
        return {
            ...post,
            country_flag: countryDetails.flag,
            country_currency: countryDetails.currency,
            country_capital: countryDetails.capital,
            date_of_visit: validateAndFormatDate(post.date_of_visit),
            created_at: validateAndFormatDate(post.created_at)
        };
    } catch (error) {
        console.error('Error fetching country details:', error);
        // Return post without enrichment rather than failing
        return {
            ...post,
            country_flag: null,
            country_currency: null,
            country_capital: null,
            date_of_visit: validateAndFormatDate(post.date_of_visit),
            created_at: validateAndFormatDate(post.created_at)
        };
    }
};

const createPost = async (userId, { title, content, country_name, country_cca3, date_of_visit }) => {
    // Validate country_name exists
    await validateAndGetCountryDetails(country_name);

    // Validate and format date
    const formattedDate = validateAndFormatDate(date_of_visit);
    if (!formattedDate) {
        throw new Error('Invalid date format');
    }

    return await BlogPost.create({
        title,
        content,
        country_name,
        country_cca3,
        date_of_visit: formattedDate,
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

const updatePost = async (postId, userId, { title, content, country_name, country_cca3 }) => {
    const post = await BlogPost.findById(postId);
    if (!post) return null;

    if (post.user_id !== userId) {
        throw new Error('Unauthorized');
    }
    if (country_name && country_name !== post.country_name) {
        await validateAndGetCountryDetails(country_name);
        post.country_name = country_name;
    }
    if (country_cca3) post.country_cca3 = country_cca3;

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

const toggleDislike = async (postId, userId) => {
    const post = await BlogPost.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    return await BlogPost.toggleReaction(postId, userId, 'dislike');
};

const getDislikeStatus = async (postId, userId) => {
    const post = await BlogPost.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    return await BlogPost.getReactionStatus(postId, userId, 'dislike');
};

const getDislikeCount = async (postId) => {
    const post = await BlogPost.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    return await BlogPost.getReactionCount(postId, 'dislike');
};

const toggleLike = async (postId, userId) => {
    const post = await BlogPost.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    return await BlogPost.toggleReaction(postId, userId, 'like');
};

const getLikeStatus = async (postId, userId) => {
    const post = await BlogPost.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    return await BlogPost.getReactionStatus(postId, userId, 'like');
};

const getLikeCount = async (postId) => {
    const post = await BlogPost.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    return await BlogPost.getReactionCount(postId, 'like');
};

const addComment = async (postId, userId, content) => {
    const post = await BlogPost.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    return await BlogPost.addComment(postId, userId, content);
};

const getComments = async (postId) => {
    const post = await BlogPost.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    return await BlogPost.getComments(postId);
};

const deleteComment = async (commentId, userId) => {
    return await BlogPost.deleteComment(commentId, userId);
};

const getPopularPosts = async (limit = 10) => {
    const posts = await BlogPost.getPopularPosts(limit);
    return await Promise.all(posts.map(post => enrichPostWithCountryDetails(post)));
};

const getRecentPosts = async (limit = 10) => {
    const posts = await BlogPost.getRecentPosts(limit);
    return await Promise.all(posts.map(post => enrichPostWithCountryDetails(post)));
};

const findByUserId = async (userId, page = 1, limit = 10, search = '') => {
    const posts = await BlogPost.findByUserId(userId, parseInt(page), parseInt(limit), search);
    const total = await BlogPost.getTotalCountByUserId(userId, search);
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
    const enrichedPosts = await Promise.all(posts.map(post => enrichPostWithCountryDetails(post)));
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
    enrichPostWithCountryDetails,
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
    getRecentPosts,
    findByUserId
}; 