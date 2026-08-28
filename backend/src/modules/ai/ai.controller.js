const aiService = require('./ai.service');

/**
 * AI Assistant Controller
 */
class AiController {
  /**
   * POST /api/v1/ai/chat
   * Handle user conversational query
   */
  async handleChat(req, res, next) {
    try {
      const { query, language = 'hi', profile = null } = req.body;

      if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Query parameter is required.'
        });
      }

      const result = await aiService.processQuery({
        query: query.trim(),
        language,
        userProfile: profile || req.user?.profile || null
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/ai/suggest
   * Get dynamic prompt suggestions
   */
  async getSuggestions(req, res, next) {
    try {
      const language = req.query.lang === 'en' ? 'en' : 'hi';
      const suggestions = aiService.getSuggestions(language);

      return res.status(200).json({
        success: true,
        language,
        suggestions
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AiController();
