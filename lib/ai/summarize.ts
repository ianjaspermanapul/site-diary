export async function generateWeeklySummary(
  diaries: Array<{
    date: string;
    title: string;
    content?: string | null;
    createdBy: string;
    weather?: { temperature: number; description: string } | null;
    attendees?: string[];
  }>
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured. Please add it to your .env file.');
  }

  // Format diaries for AI prompt
  const formattedDiaries = diaries
    .map((diary) => {
      const parts = [
        `Date: ${diary.date}`,
        `Title: ${diary.title}`,
        diary.content ? `Content: ${diary.content}` : null,
        diary.weather
          ? `Weather: ${diary.weather.description}, ${diary.weather.temperature}°C`
          : null,
        diary.attendees && diary.attendees.length > 0
          ? `Attendees: ${diary.attendees.join(', ')}`
          : null,
        `Created by: ${diary.createdBy}`,
      ].filter(Boolean);

      return parts.join('\n');
    })
    .join('\n\n---\n\n');

  const prompt = `You are a construction site manager assistant. Please provide a concise weekly summary of the following site diary entries from the past week. 

Focus on:
- Key activities and progress
- Important issues or concerns
- Weather conditions and their impact
- Team members involved
- Any notable events or milestones

Site Diary Entries:
${formattedDiaries}

Please provide a well-structured summary in 2-3 paragraphs that captures the essence of the week's activities.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summarizes construction site diary entries into clear, concise weekly reports.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to generate summary.';
  } catch (error) {
    console.error('Error generating AI summary:', error);
    throw error;
  }
}
