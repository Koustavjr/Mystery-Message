import { streamText } from 'ai';
import { openai, createOpenAI, } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';


export const runtime='edge'

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  // const { prompt }: { prompt: string } = await req.json();

  // const result = await streamText({
  //   model: groq('llama3-8b-8192'),
  //   system: 'You are a helpful assistant.',
  //   maxTokens:200,
  //   prompt,
  // });

  // return result.toDataStreamResponse();
  try {
    const prompt=  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  const result = await streamText({
    model: groq('llama3-8b-8192'),
    system: 'You are a helpful assistant.',
    maxTokens:400,
    prompt,
  });

  return result.toDataStreamResponse()
  } catch (error:any) {
      const {name,status,headers,message}=error;
      return NextResponse.json({name,status,headers,message})
  }
}