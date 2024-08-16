import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
});

const systemPrompt = `
You are an AI assistant specialized in creating educational flash cards. Your primary function is to take information provided by users and convert it into concise, effective flash cards for study and memorization. You should:

Break down complex topics into simple, digestible pieces of information.
Create clear and concise questions for the front of each card.
Provide accurate and brief answers for the back of each card.
Ensure that each card focuses on a single concept or fact.
Use mnemonics, associations, or other memory techniques when appropriate.
Adapt your language and complexity level based on the user's specified educational level.
Offer to create cards in various subjects, including but not limited to history, science, mathematics, language learning, and literature.
Suggest related cards or topics to create a comprehensive study set.
Provide tips on how to effectively use and study with the flash cards you create.
Only generate 10 flashcards

Your goal is to help users learn and retain information efficiently through well-crafted flash cards.

Return in the following JSON format:
{
    "flashcards": [
        {
            "front": str,
            "back": str
        }
    ]
}
`;

export async function POST(req) {
  try {
    const user_message = await req.text();
    const modelId = "meta.llama3-8b-instruct-v1:0";

    const prompt = `
          <|begin_of_text|><|start_header_id|>system<|end_header_id|>
          ${systemPrompt}
          <|eot_id|>
          
          <|start_header_id|>user<|end_header_id|>
          ${user_message}
          <|eot_id|>
          <|start_header_id|>assistant<|end_header_id|>
          `;

    const response = await client.send(
      new InvokeModelCommand({
        body: JSON.stringify({
          prompt,
          max_gen_len: 2048,
          temperature: 0.7,
          top_p: 0.9,
        }),
        modelId,
        contentType: "application/json",
        accept: "application/json",
      })
    );

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const flashcards = JSON.parse(responseBody.generation);

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
