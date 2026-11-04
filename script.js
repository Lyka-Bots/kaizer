
const audio = document.getElementById("audio");
const lyricsBox = document.getElementById("lyrics");

let currentLyrics = [];
let selectedSong = null;

// Search songs using iTunes preview catalog
async function searchSong() {
  const query = document.getElementById("search").value.trim();
  if (!query) return;

  const results = document.getElementById("results");
  results.innerHTML = "Searching songs...";

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`;

    const response = await fetch(url);
    const data = await response.json();

    results.innerHTML = "";

    if (!data.results.length) {
      results.innerHTML = "No songs found.";
      return;
    }

    data.results.forEach(song => {
      const item = document.createElement("div");
      item.className = "result";
      item.textContent = `${song.trackName} — ${song.artistName}`;

      item.onclick = () => selectSong(song);
      results.appendChild(item);
    });

  } catch (error) {
    results.textContent = "Search failed. Try again.";
  }
}

function selectSong(song) {
  selectedSong = song;

  document.getElementById("songTitle").textContent =
    song.trackName.toUpperCase();

  document.getElementById("artist").textContent =
    song.artistName.toUpperCase();

  audio.src = song.previewUrl || "";
  audio.load();

  lyricsBox.innerHTML = "<h2>Loading lyrics...</h2>";

  getLyrics(song.trackName, song.artistName);
}

// Fetch lyrics from LRCLIB when available
async function getLyrics(title, artist) {
  try {
    const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Lyrics unavailable");

    const data = await response.json();

    if (data.syncedLyrics) {
      currentLyrics = data.syncedLyrics
        .split("\n")
        .map(line => {
          const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);

          if (!match) return null;

          return {
            time: Number(match[1]) * 60 + Number(match[2]),
            text: match[3].trim()
          };
        })
        .filter(line => line && line.text);

      lyricsBox.innerHTML = "<h2>PRESS PLAY</h2>";
    } else {
      currentLyrics = [];
      lyricsBox.innerHTML = "<h2>Synced lyrics unavailable</h2>";
    }

  } catch (error) {
    currentLyrics = [];
    lyricsBox.innerHTML = "<h2>Lyrics unavailable</h2>";
  }
}

// Synchronize lyrics with audio
audio.addEventListener("timeupdate", () => {
  const current = audio.currentTime;

  document.getElementById("time").textContent =
    formatTime(current);

  if (!currentLyrics.length) return;

  let active = null;

  for (const line of currentLyrics) {
    if (line.time <= current) active = line;
    else break;
  }

  if (active && lyricsBox.dataset.line !== String(active.time)) {
    lyricsBox.dataset.line = active.time;
    lyricsBox.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = active.text;
    lyricsBox.appendChild(heading);
  }
});

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// Export synchronized video
function exportVideo() {
  if (!audio.src || !audio.src.startsWith("http")) {
    alert("Select a song with an available audio preview first.");
    return;
  }

  if (!currentLyrics.length) {
    alert("Synchronized lyrics are unavailable for this song.");
    return;
  }

  alert("Video export needs a separate recording and rendering module. This starter version does not export MP4 yet.");
}

document.getElementById("search").addEventListener("keydown", event => {
  if (event.key === "Enter") searchSong();
});
    
