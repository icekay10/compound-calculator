export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { urls } = req.body;

    const payload = {
      host: process.env.NEXT_PUBLIC_SITE_HOST.replace(/^https?:\/\//, ''), // Remove protocol for host
      key: process.env.INDEXNOW_KEY,
      keyLocation: `${process.env.NEXT_PUBLIC_SITE_HOST}/${process.env.INDEXNOW_KEY}.txt`,
      urlList: Array.isArray(urls) ? urls : [urls]
    };

    const response = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Forward the status and response from Bing
    const responseText = await response.text();
    res.status(response.status).json({
      success: response.ok,
      message: responseText || response.statusText
    });

  } catch (error) {
    console.error('IndexNow API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}