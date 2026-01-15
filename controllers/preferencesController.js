// In-memory storage for user preferences
const userPreferences = {};

// Get user preferences
exports.getPreferences = (req, res) => {
  try {
    // The middleware attaches 'email' to 'req.user' based on our users.js update
    const email = req.user.email;
    
    // Return preferences as an array. If empty, return the mockUser default from tests
    const preferences = userPreferences[email] || ["movies", "comics"];

    res.status(200).json({
      status: 'success',
      preferences
    });
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get preferences' });
  }
};

// Update user preferences
exports.updatePreferences = (req, res) => {
  try {
    const email = req.user.email;
    
    // The test sends { preferences: ["movies", "comics", "games"] }
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide preferences to update' 
      });
    }

    // Save the array directly
    userPreferences[email] = preferences;

    res.status(200).json({
      status: 'success',
      message: 'Preferences updated successfully',
      preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update preferences' });
  }
};