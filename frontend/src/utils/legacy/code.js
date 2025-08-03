import readline from "readline/promises";
import run from "./gemini.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let age = 32;
let profession = "teacher";
let prev_chat = "";
let check = true;

while (check) {
  const situation = await rl.question("you: ");
  if (situation.toLowerCase() === "quit") {
    check = false;
    break;
  }

  const prompt = `consider me as ${profession} of age ${age}, I am in a condition where ${situation}, can you please suggest me some solution for this. Also consider the previous chats ${prev_chat};, KEEP THE over all answer short and crisp`;

  const reply = await run(prompt);
  console.log("Bot:", reply);

  prev_chat += run(`summarise this ${prev_chat} ${situation}  ${reply}`);
}

rl.close();
