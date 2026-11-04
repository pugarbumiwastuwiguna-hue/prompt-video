// Vercel serverless function: membuat hook dengan Claude. Butuh env ANTHROPIC_API_KEY.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'missing_api_key' });
  const b = req.body || {};
  const name = String(b.name || '').slice(0, 120);
  if (!name) return res.status(400).json({ error: 'name_required' });
  const q = 'Kamu copywriter TikTok Affiliate Indonesia. Buat 3 hook pembuka video (maksimal 14 kata, bahasa Indonesia gaul tapi sopan) untuk produk "' + name + '"' +
    (b.price ? ', harga ' + String(b.price).slice(0, 20) : '') + (b.benefit ? ', keunggulan: ' + String(b.benefit).slice(0, 160) : '') +
    '. Gaya: ' + String(b.style || '').slice(0, 60) + ' (' + String(b.tone || '').slice(0, 80) + '). Jangan membuat klaim palsu atau klaim medis. Balas HANYA JSON: {"hooks":["...","...","..."]}';
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-5-5', max_tokens: 500, messages: [{ role: 'user', content: q }] })
    });
    if (!r.ok) return res.status(502).json({ error: 'upstream_error' });
    const data = await r.json();
    const text = (data.content || []).map((c) => c.text || '').join('');
    const m = text.match(/\{[\s\S]*\}/);
    const hooks = JSON.parse(m ? m[0] : '{}').hooks;
    if (!Array.isArray(hooks) || !hooks.length) return res.status(502).json({ error: 'bad_output' });
    return res.status(200).json({ hooks: hooks.slice(0, 3).map(String) });
  } catch (e) {
    return res.status(500).json({ error: 'failed' });
  }
}
