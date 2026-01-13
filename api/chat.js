export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ text: 'Pouze POST požadavky.' });
    }

    try {
        const body = JSON.parse(req.body);
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'Jsi asistent Phoenix pro projekt Lojzovy Paseky. Odpovídej profesionálně, mile a stručně v češtině.' },
                    { role: 'user', content: body.message }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json({ text: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ text: 'Chyba na straně Phoenixe. Zkuste to za chvíli.' });
    }
}
