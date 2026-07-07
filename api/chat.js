export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { prompt } = req.body;

    try {
        const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HF_API_KEY}` // Securely accessed here!
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:groq",
                messages: [{ role: "user", content: prompt }],
                stream: false
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "Error contacting AI", error: error.message });
    }
}
