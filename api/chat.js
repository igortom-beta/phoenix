export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    let messages;
    if (typeof req.body === 'string') {
      const body = JSON.parse(req.body);
      messages = body.messages;
    } else {
      messages = req.body.messages;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Jsi asistent pro luxusní apartmány Lojzovy Paseky na Šumavě. Nabízíš DLOUHODOBÝ PRONÁJEM šesti bungalovů, které majitel postavil vlastníma rukama. Odpovídej profesionálně v jazyce, kterým mluví klient (CZ/DE/EN).' },
          ...(messages || [])
        ]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
