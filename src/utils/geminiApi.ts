// Gemini API integration for AI predictions
// Replace with your actual Gemini API key
const GEMINI_API_KEY = 'your-gemini-api-key-here';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiPredictionRequest {
  symbol: string;
  timeframe: string;
  currentPrice: number;
  marketData?: any;
}

export interface GeminiPredictionResponse {
  direction: 'up' | 'down';
  confidence: number;
  reasoning: string;
  targetPrice: number;
}

export const generateGeminiPrediction = async (
  request: GeminiPredictionRequest
): Promise<GeminiPredictionResponse> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
    // Return mock prediction if API key not configured
    return generateMockPrediction(request);
  }

  try {
    const prompt = `
Analyze the cryptocurrency ${request.symbol} for a ${request.timeframe} prediction.
Current price: $${request.currentPrice}
Timeframe: ${request.timeframe}

Please provide:
1. Direction (up/down)
2. Confidence level (60-95%)
3. Brief reasoning (2-3 sentences)
4. Target price estimate

Format your response as JSON:
{
  "direction": "up" or "down",
  "confidence": number,
  "reasoning": "your analysis",
  "targetPrice": number
}
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{.*\}/s);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const prediction = JSON.parse(jsonMatch[0]);
    
    // Validate response
    if (!prediction.direction || !prediction.confidence || !prediction.reasoning || !prediction.targetPrice) {
      throw new Error('Incomplete prediction data from Gemini API');
    }

    return prediction;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to mock prediction
    return generateMockPrediction(request);
  }
};

// Mock prediction generator for testing/fallback
const generateMockPrediction = (request: GeminiPredictionRequest): GeminiPredictionResponse => {
  const direction = Math.random() > 0.5 ? 'up' : 'down';
  const confidence = Math.floor(Math.random() * 30) + 60; // 60-90%
  const priceChange = direction === 'up' ? 
    Math.random() * 0.2 + 0.05 : // 5-25% increase
    -(Math.random() * 0.15 + 0.03); // 3-18% decrease
  
  const targetPrice = request.currentPrice * (1 + priceChange);

  const reasoning = `Based on technical analysis and market sentiment, ${request.symbol} shows ${
    direction === 'up' ? 'bullish' : 'bearish'
  } indicators for the ${request.timeframe} timeframe. Key factors include ${
    direction === 'up' ? 'strong support levels, positive momentum, and increased institutional interest' :
    'resistance at current levels, declining volume, and profit-taking pressure'
  }.`;

  return {
    direction,
    confidence,
    reasoning,
    targetPrice: Math.round(targetPrice * 100) / 100
  };
};

// Live price fetching (mock implementation)
export const fetchLivePrice = async (symbol: string): Promise<number> => {
  try {
    // In a real implementation, you would fetch from a crypto API like CoinGecko
    // For now, return mock prices that simulate real market movement
    const mockPrices: Record<string, number> = {
      BTC: 43250 + (Math.random() - 0.5) * 2000,
      ETH: 2640 + (Math.random() - 0.5) * 200,
      ADA: 0.48 + (Math.random() - 0.5) * 0.1,
      SOL: 98.50 + (Math.random() - 0.5) * 10,
      DOT: 7.25 + (Math.random() - 0.5) * 1,
      LINK: 14.80 + (Math.random() - 0.5) * 2,
    };

    return mockPrices[symbol] || 100;
  } catch (error) {
    console.error('Failed to fetch live price:', error);
    return 0;
  }
};