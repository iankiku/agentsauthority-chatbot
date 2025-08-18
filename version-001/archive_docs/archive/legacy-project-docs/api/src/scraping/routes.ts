import { Router } from 'express';
import { chatgptScraper } from './chatgpt-scraper';
import { scrapeUrl } from './url-scraper';
import { googleWebSearch } from '../lib/google-web-search';
import { handleApiError, AuthenticationError, ValidationError } from '../lib/api-errors';

const router = Router();

router.post('/chatgpt', async (req, res) => {
  try {
    const { prompt, brandName } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    if (brandName) {
      chatgptScraper.setBrandName(brandName);
    }
    const result = await chatgptScraper.scrapePromptResponse(prompt);
    res.json(result);
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
});

router.post('/url', async (req, res) => {
  try {
    const { url, maxAge } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    const result = await scrapeUrl(url, maxAge);
    res.json(result);
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
});

router.post('/batch-scrape', async (req, res) => {
  try {
    const { urls, maxAge } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'An array of URLs is required' });
    }

    const results = [];
    for (const url of urls) {
      try {
        const scrapedData = await scrapeUrl(url, maxAge);
        results.push({ url, success: true, data: scrapedData });
      } catch (error) {
        results.push({ url, success: false, error: (error as Error).message });
      }
    }
    res.json(results);
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
});

router.post('/web-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      throw new ValidationError('Search query is required');
    }
    const searchResults = await googleWebSearch(query);
    res.json(searchResults);
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
});

export const scrapingRouter = router;
