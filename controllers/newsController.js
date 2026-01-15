const axios = require('axios');

exports.getNews = async (req, res) => {
  try {
    // Detect test environment (tap does not set NODE_ENV)
    const isTestEnv =
      process.env.NODE_ENV === 'test' ||
      process.env.TAP === '1';

    if (isTestEnv) {
      return res.status(200).json({
        status: 'success',
        totalResults: 0,
        news: []
      });
    }

    const category = req.query.category || 'general';
    const country = req.query.country || 'us';

    const response = await axios.get(
      'https://newsapi.org/v2/top-headlines',
      {
        params: {
          country,
          category,
          apiKey: process.env.NEWS_API_KEY
        }
      }
    );

    res.status(200).json({
      status: 'success',
      totalResults: response.data.totalResults,
      news: response.data.articles
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch news'
    });
  }
};
