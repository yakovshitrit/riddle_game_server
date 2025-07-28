import promptSync from 'prompt-sync';
import { loginOrRegister, solveRiddle, viewScore, addRiddle, updateRiddle, deleteRiddle } from './gameFunctions.js';

const prompt = promptSync();
let player = null;

async function loginMenu() {
  console.log(" Welcome to the Riddle Game!");
  console.log("1. Login / Register");
  console.log("2. Exit");

  const choice = prompt("Choose an option: ");

  switch (choice) {
    case '1':
      player = await loginOrRegister();
      if (player) {
        console.log(`Hello, ${player.username}!`);
        await mainMenu();
      } else {
        console.log("Login failed. Please try again.");
        await loginMenu();
      }
      break;

    case '2':
      console.log("Goodbye!");
      process.exit();

    default:
      console.log("Invalid choice. Please try again.");
      await loginMenu();
  }
}

async function mainMenu() {
  console.log("\n Main Menu");
  console.log("1. Solve a Riddle");
  console.log("2. View My Score");
  console.log("3. Add a Riddle");
  console.log("4. Update a Riddle");
  console.log("5. Delete a Riddle");
  console.log("6. Logout");
  console.log("7. Exit");

  const choice = prompt("Choose an option: ");

  switch (choice) {
    case '1':
      await solveRiddle(player);
      break;

    case '2':
      await viewScore(player);
      break;

    case '3':
      await addRiddle(player);
      break;

    case '4':
      await updateRiddle(player);
      break;

    case '5':
      await deleteRiddle(player);
      break;

    case '6':
      console.log("Logging out...");
      player = null;
      await loginMenu();
      return;

    case '7':
      console.log("Goodbye!");
      process.exit();

    default:
      console.log("Invalid choice. Please try again.");
  }

  prompt("Press Enter to continue...");
  await mainMenu();
}

loginMenu();