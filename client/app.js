import fetch from 'node-fetch';
import promptSync from 'prompt-sync';
const prompt = promptSync();

let currentPlayer = null;

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

async function loginOrRegister() {
  const username = prompt("Enter your username: ").trim();
  if (!username) return console.log("Username is required.");

  try {
    const res = await fetch(`http://localhost:3000/player/${username}`);
    
    if (res.ok) {
      currentPlayer = await res.json();
      console.log(`Welcome back, ${username}!`);
    } else if (res.status === 404) {
      const create = await fetch(`http://localhost:3000/player`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await create.json();
      currentPlayer = data.player;
      console.log(`Player created. Welcome, ${username}!`);
    } else {
      console.log("Login error.");
    }
  } catch (err) {
    console.log("Network error:", err.message);
  }
}