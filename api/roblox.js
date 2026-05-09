// api/roblox.js — Vercel Serverless Function
// Source code is never exposed publicly; only the endpoint URL is.

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ error: 'username required' });
  }

  try {
    // Step 1: Search for user by username
    const searchRes = await fetch(
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username.trim())}&limit=10`
    );
    if (!searchRes.ok) throw new Error(`roblox_search_${searchRes.status}`);
    const searchData = await searchRes.json();

    // Find exact username match (case-insensitive)
    const match = searchData.data?.find(
      u => u.name.toLowerCase() === username.trim().toLowerCase()
    );

    if (!match) {
      return res.status(200).json({ found: false });
    }

    // Step 2: Fetch full profile (includes bio)
    const profileRes = await fetch(`https://users.roblox.com/v1/users/${match.id}`);
    if (!profileRes.ok) throw new Error(`roblox_profile_${profileRes.status}`);
    const profile = await profileRes.json();

    return res.status(200).json({
      found      : true,
      id         : match.id,
      username   : profile.name,
      displayName: profile.displayName,
      bio        : profile.description || ''
    });

  } catch (err) {
    console.error('[roblox proxy]', err.message);
    return res.status(502).json({ error: 'Failed to reach Roblox API' });
  }
}