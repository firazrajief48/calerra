const api = "AIzaSyCPs5Q5xLHRb0xmc9rPyPA0A8lfSsNHXi8";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(api);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    if (result?.response?.text) {
      const text = result.response.text();
      console.log("🔵 Hasil Gemini:", text);
      return text;
    } else {
      console.error("❌ Response tidak valid:", result);
      return "❌ Jawaban tidak bisa diambil dari response.";
    }
  } catch (error) {
    console.error("❌ Error dari Gemini API:", error);
    throw error;
  }
}

export default run;
