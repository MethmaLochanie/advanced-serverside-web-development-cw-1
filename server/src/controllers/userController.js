const userService = require('../services/userService');

const getProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const userData = await userService.getProfile(userId);
        res.json({
            success: true,
            message: `Retrieved profile for ${userData.username}`,
            data: userData
        });
    } catch (error) {
        console.error('Error getting user profile:', error);
        if (error.message === 'User Not Found') {
            return res.status(404).json({
                success: false,
                error: 'User Not Found',
                message: 'The specified user does not exist'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Fetch Operation Failed',
            message: 'An error occurred while fetching the user profile'
        });
    }
};

const getSuggestedUsers = async (req, res) => {
    const userId = req.user.id;
    const { limit = 5 } = req.query;

    try {
        const suggestedUsers = await userService.getSuggestedUsers(userId, limit);
        
        if (!suggestedUsers.length) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No suggested users found'
            });
        }

        res.json({
            success: true,
            data: suggestedUsers,
            message: `Found ${suggestedUsers.length} suggested users to follow`
        });
    } catch (error) {
        console.error('Error getting suggested users:', error);
        if (error.message === 'Invalid Limit') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Parameter',
                message: 'Limit must be a number between 1 and 20'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Suggestion Fetch Failed',
            message: 'An error occurred while fetching suggested users'
        });
    }
};

const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { username, email, country } = req.body;

    if (req.user.id !== userId) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized',
            message: 'You can only update your own profile'
        });
    }

    try {
        const userData = await userService.updateProfile(userId, { username, email, country });
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: userData
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        if (error.message === 'User Not Found') {
            return res.status(404).json({
                success: false,
                error: 'User Not Found',
                message: 'The specified user does not exist'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Update Operation Failed',
            message: 'An error occurred while updating the profile'
        });
    }
};

const deleteAccount = async (req, res) => {
    const { userId } = req.params;

    if (req.user.id !== userId) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized',
            message: 'You can only delete your own account'
        });
    }

    try {
        const result = await userService.deleteAccount(userId);
        res.json({
            success: true,
            message: 'Account deleted successfully',
            data: result
        });
    } catch (error) {
        console.error('Error deleting user account:', error);
        if (error.message === 'User Not Found') {
            return res.status(404).json({
                success: false,
                error: 'User Not Found',
                message: 'The specified user does not exist'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Delete Operation Failed',
            message: 'An error occurred while deleting the account'
        });
    }
};

module.exports = {
    getProfile,
    getSuggestedUsers,
    updateProfile,
    deleteAccount
}; 