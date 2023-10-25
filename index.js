const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const cors = require("cors");

const app = express();

const port = 8080;

app.use(express.json());

app.use(cors());

const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });

app.post("/convert", async (req, res) => {
  try {
    const { code, language } = req.body;

    const response = await main(code, language);

    let data = response[0].message.content;

    res.json(response[0].message.content);
    // res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/debug", async (req, res) => {
  try {
    const { code } = req.body;

    const response = await DebugMain(code);

    let data = response[0].message.content;

    res.json(response[0].message.content);
    // res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/checker", async (req, res) => {
  try {
    const { code } = req.body;

    const response = await quality(code);

    let data = response[0].message.content;

    res.json(response[0].message.content);
    // res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

async function quality(code) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `act as a Code quality Checker. Please check the quality of the code ${code} and give rating out of 10 with various parameter`,
      },
    ],
    model: "gpt-3.5-turbo", //it will be costly to use
    // model:'GPT-3',
  });

  return chatCompletion.choices;
}

async function main(code, language) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `act as a Code Converter. Please convert the following code ${code} to ${language} language`,
      },
    ],
    model: "gpt-3.5-turbo", //it will be costly to use
    // model:'GPT-3',
  });

  return chatCompletion.choices;
}

async function DebugMain(code) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `act as a Code Debugger. Please Debug the following code ${code}`,
      },
    ],
    model: "gpt-3.5-turbo", //it will be costly to use
    // model:'GPT-3',
  });

  return chatCompletion.choices;
}

app.get("/", (req, res) => {
  res.send("Welcome to the backend of Code Converter");
});

app.listen(8080, async () => {
  console.log("Running at port 8080");
});
