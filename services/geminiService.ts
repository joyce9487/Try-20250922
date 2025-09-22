
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateMeditationScript(mood: string) {
  const model = "gemini-2.5-flash";
  const systemInstruction = `
你是一位專業、溫暖且富有同理心的正念冥想引導師。
你的任務是根據使用者當下的心情或需求，生成一段客製化的冥想引導腳本。
這段腳本的核心目標是引導使用者將注意力帶回當下，專注於身體的感受，例如呼吸、心跳、皮膚的觸感、身體各部位的感覺等。
透過這種方式，幫助他們從紛亂的思緒中抽離，找回內心的平靜、和諧與安定。

指導方針：
1.  **語氣溫和**：使用溫柔、平靜、支持性的語言。
2.  **專注身體**：引導詞需明確指向身體的具體感受。
3.  **正向語言**：多使用正面、鼓勵性的詞彙。
4.  **客製化**：腳本內容需與使用者提供的心情/需求有相關性。
5.  **結構清晰**：開頭先讓使用者安頓下來，中段是身體掃描或呼吸專注的核心引導，結尾溫和地將意識帶回。
6.  **格式**：使用換行來分隔段落，讓腳本更容易閱讀和跟隨。
`;

  const prompt = `使用者的心情/需求是：「${mood}」`;

  const response = await ai.models.generateContentStream({
    model: model,
    contents: prompt,
    config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.95
    }
  });
  
  return response;
}
