import {OpenAI} from "openai"
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"

export function createSystemMessage(text: string): ChatCompletionMessageParam {
    return {
      role: "system",
      content: text, 
    };
}

export function createUserMessage(text: string): ChatCompletionMessageParam {
    return {
      role: "user",
      content: text, 
    };
}
