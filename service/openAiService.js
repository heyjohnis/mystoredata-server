import OpenAI from "openai";
import { config } from "../config.js";

const apiKey = config.ai.key;

const openai = new OpenAI({
  apiKey,
});

export async function checkHumanName(name) {
  try {
    const messages = [
      {
        role: "user",
        content: `'${name}' 은 사람 이름의 가능성이 얼마나 될까? 결과를 숫자로 출력해줘`,
      },
    ];
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    // GPT-3의 응답에서 확률 값을 추출
    console.log(completion.choices);
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    throw error;
  }
}
