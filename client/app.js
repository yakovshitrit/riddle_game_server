import promptSync from 'prompt-sync';
const prompt = promptSync();

import { loginOrRegister, solveRiddle, viewScore } from './gameFunctions.js';

async function mainMenu() {
  console.log(" Welcome to the Riddle Game!");
  console.log("1. Login / Register");
  console.log("2. Solve a Riddle");
  console.log("3. View My Score");
  console.log("4. Exit");

  const choice = prompt("Choose an option: ");

  switch (choice) {
    case '1':
      await loginOrRegister();
      break;
    case '2':
      await solveRiddle();
      break;
    case '3':
      await viewScore();
      break;
    case '4':
      console.log("Goodbye!");
      process.exit();
    default:
      console.log("Invalid choice. Please try again.");
  }

  prompt("Press Enter to continue...");
  await mainMenu();
}

mainMenu();