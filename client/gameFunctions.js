import fetch from 'node-fetch'
import promptSync from 'prompt-sync';


const prompt = promptSync();


let currentPlayer = null;

export async function loginOrRegister() {
  const username = prompt("Enter your username: ");
  if (!username) {
    console.log("Username is required");
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/player/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();

    if (res.ok) {
      currentPlayer = data;
      console.log(`Logged in as ${currentPlayer.username}`);
    } else {
      console.log('Login error:', data.error);
    }
  } catch (err) {
    console.error('Network error:', err.message);
  }
}

export async function solveRiddle() {
  if (!currentPlayer) {
    console.log('Please login first');
    return;
  }

  const riddleId = prompt('Enter Riddle ID: ');
  const answer = prompt('Your answer: ');

  try {
    const res = await fetch(`http://localhost:3000/game/${riddleId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, playerId: currentPlayer.id }),
    });
    const data = await res.json();

    if (res.ok) {
      if (data.correct) {
        console.log('Correct! Your new score:', data.newScore);
      } else {
        console.log('Wrong answer. Try again!');
      }
    } else {
      console.log('Error:', data.error);
    }
  } catch (err) {
    console.error('Network error:', err.message);
  }
}

export async function viewScore() {
  if (!currentPlayer) {
    console.log('Please login first');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/player/${currentPlayer.id}/score`);
    const data = await res.json();

    if (res.ok) {
      console.log(`Your current score is: ${data.score}`);
    } else {
      console.log('Error:', data.error);
    }
  } catch (err) {
    console.error('Network error:', err.message);
  }
}