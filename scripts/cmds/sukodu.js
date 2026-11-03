// Sudoku Game for Kaizer GoatBot
// Author: Edward

if (!global.GoatBot.sudokuGames) {
  global.GoatBot.sudokuGames = new Map();
}

const games = global.GoatBot.sudokuGames;

function shuffle(arr) {
  const a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

function createSolution() {
  const bands = shuffle([0, 1, 2]);
  const rows = bands.flatMap(b =>
    shuffle([0, 1, 2]).map(r => b * 3 + r)
  );

  const stacks = shuffle([0, 1, 2]);
  const cols = stacks.flatMap(s =>
    shuffle([0, 1, 2]).map(c => s * 3 + c)
  );

  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  return rows.map(r =>
    cols.map(c => nums[(r * 3 + Math.floor(r / 3) + c) % 9])
  );
}

function createPuzzle(level) {
  const solution = createSolution();
  const board = solution.map(row => [...row]);

  const blanks = {
    easy: 35,
    medium: 45,
    hard: 53,
    expert: 59
  }[level] || 45;

  const cells = shuffle(
    Array.from({ length: 81 }, (_, i) => i)
  );

  for (const index of cells.slice(0, blanks)) {
    board[Math.floor(index / 9)][index % 9] = 0;
  }

  return {
    board,
    solution,
    fixed: board.map(row => row.map(Boolean))
  };
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);

  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function drawBoard(game) {
  const out = [
    `🧩 SUDOKU — ${game.level.toUpperCase()}`,
    `⏱️ Time: ${formatTime(Date.now() - game.startedAt)} | ❌ Mistakes: ${game.mistakes}/${game.maxMistakes}`,
    '',
    '       1 2 3   4 5 6   7 8 9',
    '     ┌───────┬───────┬───────┐'
  ];

  for (let r = 0; r < 9; r++) {
    const cells = game.board[r].map(n => n || '·');

    out.push(
      `${String.fromCharCode(65 + r)}    │ ${cells.slice(0, 3).join(' ')} │ ${cells.slice(3, 6).join(' ')} │ ${cells.slice(6, 9).join(' ')} │`
    );

    if (r === 2 || r === 5) {
      out.push('     ├───────┼───────┼───────┤');
    }
  }

  out.push('     └───────┴───────┴───────┘');
  out.push('');
  out.push('✍️ Reply: A1 5');
  out.push('💡 Commands: hint | erase A1 | quit');

  return out.join('\n');
}

function isSolved(game) {
  return game.board.every((row, r) =>
    row.every((n, c) => n === game.solution[r][c])
  );
}

function parseCell(text) {
  const match = text.match(/^([a-i])([1-9])$/i);

  if (!match) return null;

  return [
    match[1].toUpperCase().charCodeAt(0) - 65,
    Number(match[2]) - 1
  ];
}

module.exports = {
  config: {
    name: 'sudoku',
    aliases: ['sdk'],
    version: '1.0.0',
    author: 'Kaizer',
    countDown: 5,
    role: 0,
    description: {
      en: 'Play an interactive Sudoku puzzle.'
    },
    category: 'game',
    guide: {
      en: '{pn} [easy|medium|hard|expert]'
    }
  },

  onStart: async function ({ message, event, args, commandName }) {
    const action = (args[0] || '').toLowerCase();

    if (action === 'quit') {
      games.delete(event.senderID);
      return message.reply('🛑 Your Sudoku game has ended.');
    }

    const level = ['easy', 'medium', 'hard', 'expert'].includes(action)
      ? action
      : 'medium';

    const puzzle = createPuzzle(level);

    const game = {
      ...puzzle,
      level,
      startedAt: Date.now(),
      mistakes: 0,
      maxMistakes: 5,
      moves: 0,
      threadID: event.threadID,
      senderID: event.senderID
    };

    games.set(event.senderID, game);

    const sent = await message.reply(drawBoard(game));

    if (sent && sent.messageID) {
      global.GoatBot.onReply.set(sent.messageID, {
        commandName: commandName || module.exports.config.name,
        author: event.senderID,
        gameOwner: event.senderID
      });
    }
  },

  onReply: async function ({ message, Reply, event, commandName }) {
    const owner = Reply.gameOwner || Reply.author;

    if (event.senderID !== owner) {
      return message.reply('⛔ This Sudoku game belongs to another player.');
    }

    const game = games.get(owner);

    if (!game) {
      return message.reply('⚠️ No active game. Start with /sudoku.');
    }

    if (game.threadID !== event.threadID) return;

    const input = (event.body || '').trim();
    const lower = input.toLowerCase();

    if (lower === 'quit') {
      games.delete(owner);
      return message.reply('🛑 Sudoku game ended.');
    }

    if (lower === 'hint') {
      const empty = [];

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!game.board[r][c]) {
            empty.push([r, c]);
          }
        }
      }

      if (!empty.length) {
        return message.reply('There are no empty cells left.');
      }

      const [r, c] = empty[Math.floor(Math.random() * empty.length)];

      game.board[r][c] = game.solution[r][c];
      game.moves++;

    } else if (lower.startsWith('erase ')) {
      const pos = parseCell(input.slice(6).trim());

      if (!pos) {
        return message.reply('⚠️ Use: erase A1');
      }

      const [r, c] = pos;

      if (game.fixed[r][c]) {
        return message.reply('🔒 You cannot erase a starting number.');
      }

      game.board[r][c] = 0;

    } else {
      const move = input.match(
        /^([a-i])([1-9])\s*(?:=|,|\s)\s*([1-9])$/i
      );

      if (!move) {
        return message.reply('⚠️ Invalid format. Example: A1 5');
      }

      const r = move[1].toUpperCase().charCodeAt(0) - 65;
      const c = Number(move[2]) - 1;
      const n = Number(move[3]);

      if (game.fixed[r][c]) {
        return message.reply('🔒 That cell is a fixed starting number.');
      }

      if (game.board[r][c] === n) {
        return message.reply('That cell already contains that number.');
      }

      if (n !== game.solution[r][c]) {
        game.mistakes++;

        if (game.mistakes >= game.maxMistakes) {
          games.delete(owner);

          return message.reply(
            `💔 GAME OVER!\nYou reached ${game.maxMistakes} mistakes.\n\nCorrect solution:\n${game.solution.map(row => row.join(' ')).join('\n')}`
          );
        }

        return message.reply(
          `❌ Incorrect number!\nMistakes: ${game.mistakes}/${game.maxMistakes}`
        );
      }

      game.board[r][c] = n;
      game.moves++;
    }

    if (isSolved(game)) {
      const elapsed = formatTime(Date.now() - game.startedAt);

      const score = Math.max(
        100,
        ({ easy: 500, medium: 750, hard: 1000, expert: 1500 }[game.level])
        - game.mistakes * 50
        - game.moves * 2
      );

      games.delete(owner);

      return message.reply(
        `🏆 SUDOKU COMPLETED!\n\n` +
        `Difficulty: ${game.level.toUpperCase()}\n` +
        `⏱️ Time: ${elapsed}\n` +
        `❌ Mistakes: ${game.mistakes}\n` +
        `⭐ Score: ${score}\n\n` +
        `Great job! Play again with /sudoku.`
      );
    }

    const sent = await message.reply(drawBoard(game));

    if (sent && sent.messageID) {
      global.GoatBot.onReply.set(sent.messageID, {
        commandName: commandName || module.exports.config.name,
        author: owner,
        gameOwner: owner
      });
    }
  }
};
