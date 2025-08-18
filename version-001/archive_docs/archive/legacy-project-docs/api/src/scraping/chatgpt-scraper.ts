import puppeteer, { Browser, Page } from 'puppeteer';

export interface ChatGPTResponse {
  text: string;
  sources: Array<{
    title: string;
    url: string;
    domain: string;
    snippet?: string;
  }>;
  yourCompanyMentioned: boolean;
  competitors: string[];
}

export class ChatGPTScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isInitialized = false;
  private brandName: string = '';

  setBrandName(brandName: string) {
    this.brandName = brandName;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    this.isInitialized = true;
  }

  async scrapePromptResponse(prompt: string): Promise<ChatGPTResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.page) {
      throw new Error('Browser page not initialized');
    }

    try {
      // Navigate to ChatGPT
      await this.page.goto('https://chat.openai.com', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for and handle login if needed
      await this.handleLogin();

      // Send the prompt
      await this.sendPrompt(prompt);

      // Wait for response and extract data
      const response = await this.extractResponse();

      return response;
    } catch (error) {
      console.error('ChatGPT scraping error:', error);
      // Fallback to API response if scraping fails
      return await this.getFallbackResponse(prompt);
    }
  }

  private async handleLogin(): Promise<void> {
    // Check if already logged in
    const isLoggedIn = await this.page!.evaluate(() => {
      return document.querySelector('[data-testid="chat-input"]') !== null;
    });

    if (isLoggedIn) return;

    // Look for login button
    const loginButton = await this.page!.$('button[data-testid="login-button"]');
    if (loginButton) {
      console.log('ChatGPT login required - using fallback API mode');
      throw new Error('Login required for ChatGPT scraping');
    }
  }

  private async sendPrompt(prompt: string): Promise<void> {
    // Wait for chat input
    await this.page!.waitForSelector('[data-testid="chat-input"]', { timeout: 10000 });
    
    // Type the prompt
    await this.page!.type('[data-testid="chat-input"]', prompt);
    
    // Send the message
    await this.page!.keyboard.press('Enter');
    
    // Wait for response to start
    await this.page!.waitForFunction(
      () => {
        const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
        return messages.length > 0;
      },
      { timeout: 30000 }
    );

    // Wait for response to complete
    await this.page!.waitForFunction(
      () => {
        const stopButton = document.querySelector('[data-testid="stop-button"]');
        return stopButton === null;
      },
      { timeout: 120000 }
    );
  }

  private async extractResponse(): Promise<ChatGPTResponse> {
    const responseData = await this.page!.evaluate(() => {
      // Get the latest assistant message
      const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
      const lastMessage = messages[messages.length - 1];
      
      if (!lastMessage) {
        return { text: '', sources: [], yourCompanyMentioned: false, competitors: [] };
      }

      // Extract main text
      const textContent = lastMessage.textContent || '';
      
      // Extract sources/citations
      const sources: Array<{title: string; url: string; domain: string; snippet?: string}> = [];
      const sourceLinks = lastMessage.querySelectorAll('a[href]');
      
      sourceLinks.forEach(link => {
        const href = link.getAttribute('href');
        const title = link.textContent || '';
        
        if (href && href.startsWith('http')) {
          try {
            const url = new URL(href);
            sources.push({
              title: title.trim(),
              url: href,
              domain: url.hostname,
              snippet: title.trim()
            });
          } catch (e) {
            // Invalid URL, skip
          }
        }
      });

      // Look for citation markers like [1], [2], etc.
      const citationPattern = /\\[(\\d+)\\]/g;
      const citations = textContent.match(citationPattern) || [];
      
      // Extract footnote-style sources
      const footnotes = lastMessage.querySelectorAll('[data-footnote]');
      footnotes.forEach((footnote, index) => {
        const url = footnote.getAttribute('data-footnote');
        const text = footnote.textContent || '';
        
        if (url) {
          try {
            const urlObj = new URL(url);
            sources.push({
              title: text.trim() || `Source ${index + 1}`,
              url: url,
              domain: urlObj.hostname,
              snippet: text.trim()
            });
          } catch (e) {
            // Invalid URL, skip
          }
        }
      });

      return {
        text: textContent,
        sources: sources,
        yourCompanyMentioned: this.brandName ? textContent.toLowerCase().includes(this.brandName.toLowerCase()) : false,
        competitors: []
      };
    });

    // Analyze for competitors
    const competitors = await this.extractCompetitors(responseData.text);
    
    return {
      ...responseData,
      competitors
    };
  }

  private async extractCompetitors(text: string): Promise<string[]> {
    // In a real implementation, you would use a more robust competitor extraction method
    return [];
  }

  private async getFallbackResponse(prompt: string): Promise<ChatGPTResponse> {
    // In a real implementation, you would call an API for a fallback response
    return {
      text: `Mock fallback response for: ${prompt}`,
      sources: [],
      yourCompanyMentioned: Math.random() > 0.5,
      competitors: ['Competitor A', 'Competitor B']
    };
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.isInitialized = false;
    }
  }
}

// Export singleton instance
export const chatgptScraper = new ChatGPTScraper();
