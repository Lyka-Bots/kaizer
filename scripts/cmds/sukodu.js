// ========================================
// SUDOKU GAME - KAIZER BOT
// Author: Kaizer
// Version: 2.0
// ========================================

if (!global.GoatBot.sudokuGames) {
  global.GoatBot.sudokuGames = new Map();
}

const games = global.GoatBot.sudokuGames;

// RANDOM SHUFFLE
function shuffle(arr) {
  const a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

// CREATE SOLUTION
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
    cols.map(c =>
      nums[(r * 3 + Math.floor(r / 3) + c) % 9]
    )
  );
}

// CREATE PUZZLE
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

// FORMAT TIME
function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return (
    String(minutes).padStart(2, '0') +
    ':' +
    String(remaining).padStart(2, '0')
  );
}

// DRAW BOARD - FIXED SPACING
function drawBoard(game) {
  const out = [
    `🧩 SUDOKU — ${game.level.toUpperCase()}`,
    `⏱️ Time: ${formatTime(Date.now() - game.startedAt)} | ❌ Mistakes: ${game.mistakes}/${game.maxMistakes}`,
    '',
    '       1  2  3   4  5  6   7  8  9',
    '     ┌───────────┬───────────┬───────────┐'
  ];

  for (let r = 0; r < 9; r++) {
    const cells = game.board[r].map(n =>
      n === 0 ? '·' : String(n)
    );

    const left = cells.slice(0, 3).join('  ');
    const middle = cells.slice(3, 6).join('  ');
    const right = cells.slice(6, 9).join('  ');

    out.push(
      `${String.fromCharCode(65 + r)}    │ ${left} │ ${middle} │ ${right} │`
    );

    if (r === 2 || r === 5) {
      out.push(
        '     ├───────────┼───────────┼───────────┤'
      );
    }
  }

  out.push(
    '     └───────────┴───────────┴───────────┘'
  );

  out.push('');
  out.push('✍️ Reply: A1 5');
  out.push('💡 Commands: hint | erase A1 | quit');

  return '```' + '\n' + out.join('\n') + '\n' + '```';
}

// CHECK WIN
function isSolved(game) {
  return game.board.every((row, r) =>
    row.every((n, c) => n === game.solution[r][c])
  );
}

// PARSE CELL
function parseCell(text) {
  const match = text.match(/^([a-i])([1-9])$/i);

  if (!match) return null;

  return [
    match[1].toUpperCase().charCodeAt(0) - 65,
    Number(match[2]) - 1
  ];
}

// REGISTER REPLY
function registerReply(sent, owner, commandName) {
  if (sent && sent.messageID) {
    global.GoatBot.onReply.set(sent.messageID, {
      commandName,
      author: owner,
      gameOwner: owner
    });
  }
}

module.exports = {
  config: {
    name: 'sudoku',
    aliases: ['sdk', 'sukodu'],
    version: '2.0.0',
    author: 'Edward',
    countDown: 3,
    role: 0,

    description: {
      en: 'Play a Sudoku puzzle game.'
    },

    category: 'game',

    guide: {
      en:
        '{pn}\n' +
        '{pn} easy\n' +
        '{pn} medium\n' +
        '{pn} hard\n' +
        '{pn} expert'
    }
  },

  // START GAME
  onStart: async function ({
    message,
    event,
    args,
    commandName
  }) {
    const owner = event.senderID;
    const action = (args[0] || '').toLowerCase();

    if (action === 'quit') {
      games.delete(owner);
      return message.reply('🛑 Your Sudoku game has ended.');
    }

    const level = [
      'easy',
      'medium',
      'hard',
      'expert'
    ].includes(action) ? action : 'medium';

    const puzzle = createPuzzle(level);

    const game = {
      ...puzzle,
      level,
      startedAt: Date.now(),
      mistakes: 0,
      maxMistakes: 5,
      moves: 0,
      threadID: event.threadID,
      senderID: owner
    };

    games.set(owner, game);

    const sent = await message.reply(drawBoard(game));

    registerReply(
      sent,
      owner,
      commandName || module.exports.config.name
    );
  },

  // GAME REPLY
  onReply: async function ({
    message,
    Reply,
    event,
    commandName
  }) {
    const owner = Reply.gameOwner || Reply.author;

    if (event.senderID !== owner) {
      return message.reply(
        '⛔ This Sudoku game belongs to another player.'
      );
    }

    const game = games.get(owner);

    if (!game) {
      return message.reply(
        '⚠️ No active Sudoku game. Start with /sudoku.'
      );
    }

    if (game.threadID !== event.threadID) return;

    const input = (event.body || '').trim();
    const lower = input.toLowerCase();

    // QUIT
    if (lower === 'quit') {
      games.delete(owner);
      return message.reply('🛑 Sudoku game ended.');
    }

    // HINT
    if (lower === 'hint') {
      const empty = [];

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (game.board[r][c] === 0) {
            empty.push([r, c]);
          }
        }
      }

      if (!empty.length) {
        return message.reply('No empty cells remaining.');
      }

      const [r, c] = empty[
        Math.floor(Math.random() * empty.length)
      ];

      game.board[r][c] = game.solution[r][c];
      game.moves++;
    }

    // ERASE
    else if (lower.startsWith('erase ')) {
      const pos = parseCell(input.slice(6).trim());

      if (!pos) {
        return message.reply('⚠️ Correct format: erase A1');
      }

      const [r, c] = pos;

      if (game.fixed[r][c]) {
        return message.reply(
          '🔒 You cannot erase a starting number.'
        );
      }

      game.board[r][c] = 0;
    }

    // NUMBER INPUT
    else {
      const move = input.match(
        /^([a-i])([1-9])\s*(?:=|,|\s)\s*([1-9])$/i
      );

      if (!move) {
        return message.reply(
          '⚠️ Invalid format!\nExample: A1 5'
        );
      }

      const r =
        move[1].toUpperCase().charCodeAt(0) - 65;

      const c = Number(move[2]) - 1;
      const n = Number(move[3]);

      if (game.fixed[r][c]) {
        return message.reply(
          '🔒 That cell is a fixed starting number.'
        );
      }

      if (game.board[r][c] === n) {
        return message.reply(
          'That cell already contains that number.'
        );
      }

      if (n !== game.solution[r][c]) {
        game.mistakes++;

        if (game.mistakes >= game.maxMistakes) {
          games.delete(owner);

          const solution = game.solution
            .map(row => row.join('  '))
            .join('\n');

          return message.reply(
            `💔 GAME OVER!\n` +
            `You reached ${game.maxMistakes} mistakes.\n\n` +
            `Correct solution:\n` +
            `\`\`\`\n${solution}\n\`\`\``
          );
        }

        return message.reply(
          `❌ Incorrect number!\n` +
          `Mistakes: ${game.mistakes}/${game.maxMistakes}`
        );
      }

      game.board[r][c] = n;
      game.moves++;
    }

    // WIN CHECK
    if (isSolved(game)) {
      const elapsed = formatTime(
        Date.now() - game.startedAt
      );

      const baseScore = {
        easy: 500,
        medium: 750,
        hard: 1000,
        expert: 1500
      }[game.level];

      const score = Math.max(
        100,
        baseScore -
        game.mistakes * 50 -
        game.moves * 2
      );

      games.delete(owner);

      return message.reply(
        `🏆 SUDOKU COMPLETED!\n\n` +
        `Difficulty: ${game.level.toUpperCase()}\n` +
        `⏱️ Time: ${elapsed}\n` +
        `❌ Mistakes: ${game.mistakes}\n` +
        `⭐ Score: ${score}\n\n` +
        `Congratulations! 🎉`
      );
    }

    // UPDATE BOARD
    const sent = await message.reply(drawBoard(game));

    registerReply(
      sent,
      owner,
      commandName || module.exports.config.name
    );
  }
};
