import fetch from 'node-fetch';
import promptSync from 'prompt-sync';
const prompt = promptSync();

let player = null;

// התחברות / רישום שחקן
export async function loginOrRegister() {
  const username = prompt('Enter your username: ');
  if (!username.trim()) {
    console.log("Username can't be empty");
    return null;
  }
  try {
    const res = await fetch('http://localhost:3000/player/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      console.log('Failed to login/register');
      return null;
    }

    const data = await res.json();
    player = data;
    console.log(`Logged in as ${player.username}`);
    return player;

  } catch (error) {
    console.error('Error during login:', error.message);
    return null;
  }
}

// קבלת כל החידות
export async function fetchRiddles() {
  try {
    const res = await fetch('http://localhost:3000/riddle');
    if (!res.ok) {
      console.log('Failed to fetch riddles');
      return [];
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching riddles:', error.message);
    return [];
  }
}

// לפתור חידה בודדת (לולאה עד תשובה נכונה)
export async function solveRiddle() {
  const riddles = await fetchRiddles();
  if (riddles.length === 0) {
    console.log('No riddles available.');
    return;
  }

  for (const riddle of riddles) {
    let correct = false;
    while (!correct) {
      console.log(`\n Riddle: ${riddle.question}`);
      const answer = prompt('Your answer: ');

      try {
        const res = await fetch('http://localhost:3000/game/play', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            riddleId: riddle._id,
            answer,
            playerId: player.id,
          }),
        });

        if (!res.ok) {
          console.log('Error submitting answer');
          break;
        }

        const result = await res.json();
        if (result.correct) {
          console.log(' Correct!');
          console.log(`Your score is now: ${result.newScore}`);
          correct = true;
        } else {
          console.log(' Wrong answer. Try again.');
        }
      } catch (error) {
        console.error('Error during answer submission:', error.message);
        break;
      }
    }
  }
}

// הצגת ניקוד השחקן
export async function viewScore() {
  if (!player) {
    console.log('You need to login first.');
    return;
  }
  try {
    const res = await fetch(`http://localhost:3000/player/score/${player.id}`);
    if (!res.ok) {
      console.log('Failed to fetch score');
      return;
    }
    const data = await res.json();
    console.log(`Your current score is: ${data.score}`);
  } catch (error) {
    console.error('Error fetching score:', error.message);
  }
}

// הוספת חידה חדשה
export async function addRiddle() {
  const question = prompt('Enter the riddle question: ');
  const answer = prompt('Enter the riddle answer: ');
  const level = prompt('Enter the difficulty level (easy, medium, hard): ').toLowerCase();

  try {
    const res = await fetch('http://localhost:3000/riddle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer, level }),
    });
    if (!res.ok) {
      console.log('Failed to add riddle');
      return;
    }
    const data = await res.json();
    console.log('Riddle added successfully with ID:', data._id);
  } catch (error) {
    console.error('Error adding riddle:', error.message);
  }
}

// עדכון חידה קיימת
export async function updateRiddle() {
  const id = prompt('Enter the ID of the riddle to update: ');
  const question = prompt('Enter the new riddle question (leave blank to keep current): ');
  const answer = prompt('Enter the new riddle answer (leave blank to keep current): ');
  const level = prompt('Enter the new difficulty level (easy, medium, hard) (leave blank to keep current): ').toLowerCase();

  const updateData = {};
  if (question.trim()) updateData.question = question;
  if (answer.trim()) updateData.answer = answer;
  if (level === 'easy' || level === 'medium' || level === 'hard') updateData.level = level;

  if (Object.keys(updateData).length === 0) {
    console.log('No changes to update');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/riddle/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      console.log('Failed to update riddle');
      return;
    }
    console.log('Riddle updated successfully');
  } catch (error) {
    console.error('Error updating riddle:', error.message);
  }
}

// מחיקת חידה
export async function deleteRiddle() {
  const id = prompt('Enter the ID of the riddle to delete: ');
  try {
    const res = await fetch(`http://localhost:3000/riddle/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      console.log('Failed to delete riddle');
      return;
    }
    console.log('Riddle deleted successfully');
  } catch (error) {
    console.error('Error deleting riddle:', error.message);
  }
}
