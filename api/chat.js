export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({
            error: "Prompt is required."
        });
    }

    if (!process.env.HF_API_KEY) {
        return res.status(500).json({
            error: "HF_API_KEY environment variable is missing."
        });
    }

    try {
        const hfResponse = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b:groq",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    stream: false
                })
            }
        );

        const data = await hfResponse.json();

        // Forward Hugging Face errors
        if (!hfResponse.ok) {
            console.error("HF Error:", data);

            return res.status(hfResponse.status).json({
                error: "Hugging Face API Error",
                details: data
            });
        }

        return res.status(200).json(data);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
            details: err.message
        });
    }
}
