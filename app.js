/* ═══════════════════════════════════════════
   SideVibe — Music / Karaoke App
   ═══════════════════════════════════════════ */

// ── Search API endpoints (Piped & Invidious with CORS support) ──
const SEARCH_ENDPOINTS = [
  { type: 'piped', base: 'https://api.piped.private.coffee' },
  { type: 'piped', base: 'https://pipedapi.ducks.party' },
  { type: 'invidious', base: 'https://inv.tux.pizza' },
  { type: 'invidious', base: 'https://invidious.jing.rocks' }
];

// Fallback curated hits for instant response
const CURATED_HITS = {
  'arijit': [
    { id: 'jfKfPfyJRdk', title: 'Kesariya — Brahmāstra | Arijit Singh', channel: 'Sony Music India', thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg', duration: '4:28' },
    { id: 'Umqb9KENgmk', title: 'Tum Hi Ho — Aashiqui 2 | Arijit Singh', channel: 'T-Series', thumbnail: 'https://i.ytimg.com/vi/Umqb9KENgmk/mqdefault.jpg', duration: '4:22' },
    { id: 'BddP6PYo2gs', title: 'Channa Mereya — Ae Dil Hai Mushkil', channel: 'Sony Music India', thumbnail: 'https://i.ytimg.com/vi/BddP6PYo2gs/mqdefault.jpg', duration: '4:49' }
  ],
  'blinding': [
    { id: '4NRXx6U8ABQ', title: 'The Weeknd — Blinding Lights (Official Video)', channel: 'The Weeknd', thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/mqdefault.jpg', duration: '4:20' },
    { id: 'fHI8X483mZ4', title: 'The Weeknd — Blinding Lights (Live)', channel: 'The Weeknd', thumbnail: 'https://i.ytimg.com/vi/fHI8X483mZ4/mqdefault.jpg', duration: '3:30' }
  ],
  'tame': [
    { id: 'sBzrzS1Ag_g', title: 'Tame Impala — The Less I Know The Better', channel: 'Tame Impala', thumbnail: 'https://i.ytimg.com/vi/sBzrzS1Ag_g/mqdefault.jpg', duration: '3:36' },
    { id: 'pFptt7Cargc', title: 'Tame Impala — Let It Happen (Official Video)', channel: 'Tame Impala', thumbnail: 'https://i.ytimg.com/vi/pFptt7Cargc/mqdefault.jpg', duration: '4:16' }
  ],
  'daft': [
    { id: '5NV6Rdv1a3I', title: 'Daft Punk — Get Lucky (Official Audio) ft. Pharrell Williams', channel: 'Daft Punk', thumbnail: 'https://i.ytimg.com/vi/5NV6Rdv1a3I/mqdefault.jpg', duration: '4:08' },
    { id: 'L93-7vRfxNs', title: 'Daft Punk — Starboy ft. The Weeknd', channel: 'The Weeknd', thumbnail: 'https://i.ytimg.com/vi/L93-7vRfxNs/mqdefault.jpg', duration: '3:50' }
  ],
  'lofi': [
    { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio 📚 - beats to relax/study to', channel: 'Lofi Girl', thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg', duration: 'Live' }
  ],
  'believer': [
    { id: '7wtfhZwyrcc', title: 'Imagine Dragons — Believer (Official Music Video)', channel: 'ImagineDragons', thumbnail: 'https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg', duration: '3:36' }
  ]
};


// ── Top Trending Recommendations (Always available for Next / Prev / Autoplay) ──
const TRENDING_RECOMMENDATIONS = [
  { id: 'BddP6PYo2gs', title: 'Kesariya — Brahmāstra | Arijit Singh', channel: 'Sony Music India', thumbnail: 'https://i.ytimg.com/vi/BddP6PYo2gs/mqdefault.jpg' },
  { id: '4NRXx6U8ABQ', title: 'The Weeknd — Blinding Lights', channel: 'The Weeknd', thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/mqdefault.jpg' },
  { id: 'dCmp56tSSmA', title: 'AP Dhillon — With You', channel: 'AP Dhillon', thumbnail: 'https://i.ytimg.com/vi/dCmp56tSSmA/mqdefault.jpg' },
  { id: 'sBzrzS1Ag_g', title: 'Tame Impala — The Less I Know The Better', channel: 'Tame Impala', thumbnail: 'https://i.ytimg.com/vi/sBzrzS1Ag_g/mqdefault.jpg' },
  { id: '5NV6Rdv1a3I', title: 'Daft Punk — Get Lucky ft. Pharrell Williams', channel: 'Daft Punk', thumbnail: 'https://i.ytimg.com/vi/5NV6Rdv1a3I/mqdefault.jpg' },
  { id: '7wtfhZwyrcc', title: 'Imagine Dragons — Believer', channel: 'Imagine Dragons', thumbnail: 'https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg' },
  { id: 'Umqb9KENgmk', title: 'Tum Hi Ho — Aashiqui 2 | Arijit Singh', channel: 'T-Series', thumbnail: 'https://i.ytimg.com/vi/Umqb9KENgmk/mqdefault.jpg' },
  { id: 'fHI8X483mZ4', title: 'The Weeknd — Starboy ft. Daft Punk', channel: 'The Weeknd', thumbnail: 'https://i.ytimg.com/vi/fHI8X483mZ4/mqdefault.jpg' }
];
let isAutoPlayNext = true;

// ── State ──
let ytPlayer = null;
let currentVideoId = '';
let currentTitle = '';
let currentChannel = '';
let currentThumbnail = '';
let isPlaying = false;
let isLooping = false;
let isMuted = false;
let volume = 80;
let progressInterval = null;
let syncedLyrics = [];
let plainLyrics = '';
let karaokeSyncedLyrics = [];
let queue = [];
let queueIndex = -1;
let searchDebounceTimer = null;

// ── DOM refs ──
const $ = (id) => document.getElementById(id);
const searchInput = $('searchInput');
const searchGlobal = $('searchGlobal');
const heroSearchInput = $('heroSearchInput');
const heroSearchGo = $('heroSearchGo');
const suggestionsPanel = $('suggestionsPanel');
const suggestionsList = $('suggestionsList');
const suggestionsClose = $('suggestionsClose');
const playerScreen = $('playerScreen');
const homeScreen = $('homeScreen');
const songTitle = $('songTitle');
const songChannel = $('songChannel');
const playPauseBtn = $('playPauseBtn');
const prevTrackBtn = $('prevTrackBtn');
const nextTrackBtn = $('nextTrackBtn');
const loopBtn = $('loopBtn');
const shuffleBtn = $('shuffleBtn');
const speedBtn = $('speedBtn');
const speedMenu = $('speedMenu');
const speedLabel = $('speedLabel');
const volumeBtn = $('volumeBtn');
const volumeBar = $('volumeBar');
const volumeFill = $('volumeFill');
const progressBar = $('progressBar');
const progressFill = $('progressFill');
const progressThumb = $('progressThumb');
const timeCurrent = $('timeCurrent');
const timeTotal = $('timeTotal');
const volIconHigh = $('volIconHigh');
const volIconMute = $('volIconMute');
const lyricsBody = $('lyricsBody');
const lyricsEmpty = $('lyricsEmpty');
const lyricsLines = $('lyricsLines');
const lyricsExpandBtn = $('lyricsExpandBtn');
const karaokeRoom = $('karaokeRoom');
const karaokeBg = $('karaokeBg');
const karaokeSongTitle = $('karaokeSongTitle');
const karaokeLyrics = $('karaokeLyrics');
const karaokeCloseBtn = $('karaokeCloseBtn');
const karaokeRoomBtn = $('karaokeRoomBtn');
const heroKaraoke = $('heroKaraoke');
const karaokeOpenBtn = $('karaokeOpenBtn');
const karaokePlayPause = $('karaokePlayPause');
const karaokePrev = $('karaokePrev');
const karaokeNext = $('karaokeNext');
const karaokeProgressBar = $('karaokeProgressBar');
const karaokeProgressFill = $('karaokeProgressFill');
const karaokeProgressThumb = $('karaokeProgressThumb');
const karaokeTimeCurrent = $('karaokeTimeCurrent');
const karaokeTimeTotal = $('karaokeTimeTotal');
const karaokeLoopBtn = $('karaokeLoopBtn');
const karaokeShuffleBtn = $('karaokeShuffleBtn');
const karaokeSpeedBtn = $('karaokeSpeedBtn');
const karaokeSpeedMenu = $('karaokeSpeedMenu');
const karaokeSpeedLabel = $('karaokeSpeedLabel');
const karaokeVolumeBtn = $('karaokeVolumeBtn');
const karaokeVolumeBar = $('karaokeVolumeBar');
const karaokeVolumeFill = $('karaokeVolumeFill');
const karaokeQueueBtn = $('karaokeQueueBtn');
const karaokeGlow = $('karaokeGlow');
const queuePanel = $('queuePanel');
const queueOverlay = $('queueOverlay');
const queueToggleBtn = $('queueToggleBtn');
const queueCloseBtn = $('queueCloseBtn');
const queueBadge = $('queueBadge');
const queueList = $('queueList');
const queueNowPlaying = $('queueNowPlaying');
const queueNowItem = $('queueNowItem');
const queueNextLabel = $('queueNextLabel');
const clearQueueBtn = $('clearQueueBtn');
const addToQueueBtn = $('addToQueueBtn');
const bgGradient = $('bgGradient');
const toastRack = $('toastRack');
const particlesCanvas = $('particlesCanvas');
const heroSearchFocus = $('heroSearchFocus');

// ═══════════════════════════════════════════
// 1. YouTube IFrame API
// ═══════════════════════════════════════════

let isPlayerReady = false;
let pendingVideo = null;

const EMBED_FALLBACKS = {
  '4NRXx6U8ABQ': { id: '34Na4j8AVgA', title: 'The Weeknd — Blinding Lights (Audio)', channel: 'The Weeknd', thumbnail: 'https://i.ytimg.com/vi/34Na4j8AVgA/mqdefault.jpg' },
  'BddP6PYo2gs': { id: 'jfKfPfyJRdk', title: 'Kesariya — Brahmāstra (Official)', channel: 'Sony Music India', thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg' },
  'dCmp56tSSmA': { id: '35r_Wv7x1aQ', title: 'With You — AP Dhillon (Audio)', channel: 'AP Dhillon', thumbnail: 'https://i.ytimg.com/vi/35r_Wv7x1aQ/mqdefault.jpg' },
  'sBzrzS1Ag_g': { id: 'pFptt7Cargc', title: 'Tame Impala — Let It Happen', channel: 'Tame Impala', thumbnail: 'https://i.ytimg.com/vi/pFptt7Cargc/mqdefault.jpg' },
  '5NV6Rdv1a3I': { id: '4D7u5KF7SP8', title: 'Daft Punk — Get Lucky', channel: 'Daft Punk', thumbnail: 'https://i.ytimg.com/vi/4D7u5KF7SP8/mqdefault.jpg' },
  '7wtfhZwyrcc': { id: 'IhP3J0j9JmY', title: 'Imagine Dragons — Believer (Audio)', channel: 'Imagine Dragons', thumbnail: 'https://i.ytimg.com/vi/IhP3J0j9JmY/mqdefault.jpg' }
};

function handleFallbackSong() {
  if (currentVideoId && EMBED_FALLBACKS[currentVideoId]) {
    const fb = EMBED_FALLBACKS[currentVideoId];
    playVideo(fb.id, fb.title, fb.channel, fb.thumbnail, true);
  } else if (queueIndex >= 0 && queueIndex < queue.length - 1) {
    playNext();
  } else {
    // Pick first guaranteed fallback
    const firstFb = Object.values(EMBED_FALLBACKS)[0];
    playVideo(firstFb.id, firstFb.title, firstFb.channel, firstFb.thumbnail, true);
  }
}

function initYouTubePlayer() {
  if (ytPlayer) return;
  try {
    ytPlayer = new YT.Player('youtubePlayer', {
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        playsinline: 1,
        origin: window.location.origin
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  } catch (err) {
    console.error('Error initializing YouTube player:', err);
  }
}

window.onYouTubeIframeAPIReady = function () {
  initYouTubePlayer();
};

if (typeof YT !== 'undefined' && YT.Player) {
  initYouTubePlayer();
}


let upNextTimer = null;
let upNextCountdownMs = 5000;
let upNextTargetSong = null;

function triggerUpNextAutoPlay() {
  if (!isAutoPlayNext) return;
  if (upNextTimer) {
    clearInterval(upNextTimer);
    upNextTimer = null;
  }

  // 1. Pick target next song
  if (queueIndex >= 0 && queueIndex < queue.length - 1) {
    upNextTargetSong = queue[queueIndex + 1];
  } else if (queue.length > 0 && isLooping) {
    upNextTargetSong = queue[0];
  } else {
    const candidates = TRENDING_RECOMMENDATIONS.filter(t => t.id !== currentVideoId);
    upNextTargetSong = candidates[Math.floor(Math.random() * candidates.length)] || TRENDING_RECOMMENDATIONS[0];
  }

  // 2. Pick 3 similar tracks
  const similarTracks = TRENDING_RECOMMENDATIONS
    .filter(t => t.id !== currentVideoId && (!upNextTargetSong || t.id !== upNextTargetSong.id))
    .slice(0, 3);

  // 3. Render in UI
  const upNextPopup = $('upNextPopup');
  const upNextOverlay = $('upNextOverlay');
  const upNextThumb = $('upNextThumb');
  const upNextTitle = $('upNextTitle');
  const upNextArtist = $('upNextArtist');
  const upNextCountdownSec = $('upNextCountdownSec');
  const upNextTimerNum = $('upNextTimerNum');
  const upNextCircleBar = $('upNextCircleBar');
  const upNextSimilarGrid = $('upNextSimilarGrid');

  if (upNextThumb && upNextTargetSong) upNextThumb.src = upNextTargetSong.thumbnail;
  if (upNextTitle && upNextTargetSong) upNextTitle.textContent = decodeHTML(upNextTargetSong.title);
  if (upNextArtist && upNextTargetSong) upNextArtist.textContent = decodeHTML(upNextTargetSong.channel);

  if (upNextSimilarGrid) {
    upNextSimilarGrid.innerHTML = '';
    similarTracks.forEach(t => {
      const card = document.createElement('div');
      card.className = 'similar-card';
      card.innerHTML = `
        <img class="similar-card__thumb" src="${escapeAttr(t.thumbnail)}" alt="${escapeAttr(t.title)}" loading="lazy">
        <div class="similar-card__title">${decodeHTML(t.title)}</div>
        <div class="similar-card__artist">${decodeHTML(t.channel)}</div>
      `;
      card.addEventListener('click', () => {
        dismissUpNextPopup();
        playVideo(t.id, t.title, t.channel, t.thumbnail);
      });
      upNextSimilarGrid.appendChild(card);
    });
  }

  if (upNextPopup) upNextPopup.style.display = 'block';
  if (upNextOverlay) upNextOverlay.style.display = 'block';

  // 4. Start 5s countdown
  upNextCountdownMs = 5000;
  const totalMs = 5000;
  const circumference = 119.4;

  if (upNextCircleBar) {
    upNextCircleBar.style.strokeDashoffset = '0';
  }

  upNextTimer = setInterval(() => {
    upNextCountdownMs -= 50;

    const remainingSec = Math.max(0, Math.ceil(upNextCountdownMs / 1000));
    if (upNextCountdownSec) upNextCountdownSec.textContent = remainingSec;
    if (upNextTimerNum) upNextTimerNum.textContent = remainingSec;

    if (upNextCircleBar) {
      const progress = (totalMs - upNextCountdownMs) / totalMs;
      const offset = circumference * progress;
      upNextCircleBar.style.strokeDashoffset = offset.toString();
    }

    if (upNextCountdownMs <= 0) {
      clearInterval(upNextTimer);
      upNextTimer = null;
      dismissUpNextPopup();
      if (upNextTargetSong) {
        toast(`Auto-playing: ${decodeHTML(upNextTargetSong.title)}`);
        playVideo(upNextTargetSong.id, upNextTargetSong.title, upNextTargetSong.channel, upNextTargetSong.thumbnail);
      }
    }
  }, 50);
}

function dismissUpNextPopup() {
  if (upNextTimer) {
    clearInterval(upNextTimer);
    upNextTimer = null;
  }
  const upNextPopup = $('upNextPopup');
  const upNextOverlay = $('upNextOverlay');
  if (upNextPopup) upNextPopup.style.display = 'none';
  if (upNextOverlay) upNextOverlay.style.display = 'none';
}

window.triggerUpNextAutoPlay = triggerUpNextAutoPlay;
window.dismissUpNextPopup = dismissUpNextPopup;

function onPlayerReady(event) {
  isPlayerReady = true;
  if (pendingVideo) {
    playVideo(pendingVideo.id, pendingVideo.title, pendingVideo.channel, pendingVideo.thumbnail, pendingVideo.force);
    pendingVideo = null;
  }
}

function onPlayerError(event) {
  console.warn('YouTube Player error code:', event.data);
  if (event.data === 150 || event.data === 101 || event.data === 100 || event.data === 2) {
    toast('Embedding blocked by owner. Switching to alternate audio/video...', 'info');
    handleFallbackSong();
  }
}

function onPlayerStateChange(event) {
  const state = event.data;
  if (state === YT.PlayerState.PLAYING) {
    isPlaying = true;
    updatePlayPauseIcon();
    startProgressLoop();
  } else if (state === YT.PlayerState.PAUSED) {
    isPlaying = false;
    updatePlayPauseIcon();
    stopProgressLoop();
  } else if (state === YT.PlayerState.ENDED) {
    isPlaying = false;
    updatePlayPauseIcon();
    stopProgressLoop();
    if (isLooping) {
      ytPlayer.seekTo(0);
      ytPlayer.playVideo();
    } else {
      triggerUpNextAutoPlay();
    }
  }
}


function updateTurntableUI() {
  const djTonearm = $('djTonearm');
  const djVinyl = $('djVinyl');
  const djVinylEmpty = $('djVinylEmpty');
  const djVinylArt = $('djVinylArt');
  const djVinylText = $('djVinylText');
  const djStatusText = document.querySelector('.dj-status-text');
  const djLiveDot = document.querySelector('.dj-live-dot');
  const djBars = document.querySelectorAll('.dj-bar');

  if (!currentVideoId) {
    // EMPTY STATE (Image 6: "Empty when no song")
    if (djTonearm) {
      djTonearm.className = 'dj-tonearm parked';
      djTonearm.style.transform = 'rotate(-18deg)';
    }
    if (djVinyl) {
      djVinyl.className = 'dj-vinyl paused';
    }
    if (djVinylEmpty) djVinylEmpty.style.display = 'flex';
    if (djVinylArt) djVinylArt.style.display = 'none';
    if (djVinylText) {
      djVinylText.style.display = 'block';
      djVinylText.textContent = 'BAJAO GANA';
    }
    if (djStatusText) djStatusText.textContent = 'READY TO SPIN';
    if (djLiveDot) {
      djLiveDot.style.background = '#a855f7';
      djLiveDot.style.boxShadow = '0 0 8px #a855f7';
    }
    djBars.forEach(b => b.classList.remove('dancing'));
    return;
  }

  // HAS ACTIVE SONG
  if (djVinylEmpty) djVinylEmpty.style.display = 'none';
  if (djVinylArt) {
    djVinylArt.style.display = 'block';
    djVinylArt.style.opacity = '1';
    if (currentThumbnail && djVinylArt.src !== currentThumbnail) {
      djVinylArt.src = currentThumbnail;
    }
  }
  if (djVinylText) {
    djVinylText.style.display = 'block';
    djVinylText.textContent = decodeHTML(currentTitle).split('—')[0].trim().substring(0, 16);
  }

  if (isPlaying) {
    // PLAYING STATE (Image 4: "Playing current song", Image 10)
    if (djTonearm) {
      djTonearm.className = 'dj-tonearm playing';
      djTonearm.style.transform = 'rotate(24deg)';
    }
    if (djVinyl) {
      djVinyl.className = 'dj-vinyl spinning';
    }
    if (djStatusText) djStatusText.textContent = 'NOW SPINNING';
    if (djLiveDot) {
      djLiveDot.style.background = '#22c55e';
      djLiveDot.style.boxShadow = '0 0 10px #22c55e';
    }
    djBars.forEach(b => b.classList.add('dancing'));
  } else {
    // PAUSED STATE
    if (djTonearm) {
      djTonearm.className = 'dj-tonearm paused';
      djTonearm.style.transform = 'rotate(6deg)';
    }
    if (djVinyl) {
      djVinyl.className = 'dj-vinyl paused';
    }
    if (djStatusText) djStatusText.textContent = 'PAUSED';
    if (djLiveDot) {
      djLiveDot.style.background = '#eab308';
      djLiveDot.style.boxShadow = '0 0 8px #eab308';
    }
    djBars.forEach(b => b.classList.remove('dancing'));
  }
}

function updatePlayPauseIcon() {
  if (playPauseBtn) {
    const iconPlay = playPauseBtn.querySelector('.icon-play');
    const iconPause = playPauseBtn.querySelector('.icon-pause');
    if (iconPlay) iconPlay.style.display = isPlaying ? 'none' : 'block';
    if (iconPause) iconPause.style.display = isPlaying ? 'block' : 'none';
  }
  if (karaokePlayPause) {
    const kIconPlay = karaokePlayPause.querySelector('.icon-play');
    const kIconPause = karaokePlayPause.querySelector('.icon-pause');
    if (kIconPlay) kIconPlay.style.display = isPlaying ? 'none' : 'block';
    if (kIconPause) kIconPause.style.display = isPlaying ? 'block' : 'none';
  }

  // Mini player play/pause sync
  const miniPlayPause = $('miniPlayPauseBtn');
  if (miniPlayPause) {
    const miniIconPlay = miniPlayPause.querySelector('.mini-icon-play');
    const miniIconPause = miniPlayPause.querySelector('.mini-icon-pause');
    if (miniIconPlay) miniIconPlay.style.display = isPlaying ? 'none' : 'block';
    if (miniIconPause) miniIconPause.style.display = isPlaying ? 'block' : 'none';
  }

  updateTurntableUI();
}


// ═══════════════════════════════════════════
// 2. Search with Suggestions (Autocomplete)
// ═══════════════════════════════════════════

function syncSearchInputs(value) {
  if (searchInput && searchInput.value !== value) searchInput.value = value;
  if (heroSearchInput && heroSearchInput.value !== value) heroSearchInput.value = value;
}

if (searchInput) {
  searchInput.addEventListener('input', function () {
    clearTimeout(searchDebounceTimer);
    const query = searchInput.value.trim();
    syncSearchInputs(searchInput.value);
    if (!query) {
      closeSuggestions();
      return;
    }
    searchDebounceTimer = setTimeout(() => {
      performSearch(query);
    }, 350);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(searchDebounceTimer);
      const query = searchInput.value.trim();
      if (query) performSearch(query);
    }
  });
}

if (heroSearchInput) {
  heroSearchInput.addEventListener('input', function () {
    clearTimeout(searchDebounceTimer);
    const query = heroSearchInput.value.trim();
    syncSearchInputs(heroSearchInput.value);
    if (!query) {
      closeSuggestions();
      return;
    }
    searchDebounceTimer = setTimeout(() => {
      performSearch(query);
    }, 350);
  });

  heroSearchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(searchDebounceTimer);
      const query = heroSearchInput.value.trim();
      if (query) performSearch(query);
    }
  });
}

if (heroSearchGo) {
  heroSearchGo.addEventListener('click', function () {
    const query = (heroSearchInput ? heroSearchInput.value : searchInput.value).trim();
    if (query) performSearch(query);
  });
}

async function performSearch(query) {
  query = query.trim();
  if (!query) return;

  showSuggestions();
  suggestionsList.innerHTML = '<div class="spinner"><div class="spinner__dot"></div><div class="spinner__dot"></div><div class="spinner__dot"></div></div>';

  // 1. Check for Direct YouTube Link / ID (e.g. youtu.be/xyz or youtube.com/watch?v=xyz)
  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const ytMatch = query.match(ytRegex);
  if (ytMatch) {
    const vidId = ytMatch[1];
    renderSearchResults([{
      id: vidId,
      title: 'YouTube Video (' + vidId + ')',
      channel: 'Direct URL Link',
      thumbnail: `https://i.ytimg.com/vi/${vidId}/mqdefault.jpg`,
      duration: 'Direct'
    }]);
    return;
  }

  // 1.5 Check for Spotify Track Link
  if (query.includes('open.spotify.com/track/')) {
    try {
      toast('Resolving Spotify track...', 'info');
      const spotRes = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(query)}`);
      if (spotRes.ok) {
        const spotData = await spotRes.json();
        if (spotData.title) {
          query = spotData.title;
          if (searchInput) searchInput.value = query;
        }
      }
    } catch (e) {
      // continue with query
    }
  }

  // 2. Multi-source API Search with strict 3.5s timeout per request
  let results = null;

  for (const ep of SEARCH_ENDPOINTS) {
    try {
      let url = '';
      if (ep.type === 'piped') {
        url = `${ep.base}/search?q=${encodeURIComponent(query)}&filter=videos`;
      } else {
        url = `${ep.base}/api/v1/search?q=${encodeURIComponent(query)}&type=video&page=1`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!resp.ok) continue;
      const data = await resp.json();

      if (ep.type === 'piped') {
        const items = data.items || [];
        if (items.length > 0) {
          results = items.filter(it => it.url && (it.url.includes('v=') || it.url.startsWith('/watch?v='))).slice(0, 10).map(it => {
            const vidId = it.url.includes('v=') ? it.url.split('v=')[1].split('&')[0] : it.url.replace('/watch?v=', '');
            return {
              id: vidId,
              title: it.title || 'Untitled',
              channel: it.uploaderName || 'Artist',
              thumbnail: `https://i.ytimg.com/vi/${vidId}/mqdefault.jpg`,
              duration: formatDuration(it.duration)
            };
          });
          break;
        }
      } else {
        // Invidious format
        if (Array.isArray(data) && data.length > 0) {
          results = data.filter(it => it.videoId).slice(0, 10).map(it => ({
            id: it.videoId,
            title: it.title || 'Untitled',
            channel: it.author || 'Artist',
            thumbnail: `https://i.ytimg.com/vi/${it.videoId}/mqdefault.jpg`,
            duration: formatDuration(it.lengthSeconds)
          }));
          break;
        }
      }
    } catch (err) {
      // Endpoint timed out or blocked, try next
      continue;
    }
  }

  // 3. Fallback: Curated match if network APIs are blocked
  if (!results || results.length === 0) {
    const qLower = query.toLowerCase();
    for (const [key, hits] of Object.entries(CURATED_HITS)) {
      if (qLower.includes(key) || key.includes(qLower)) {
        results = hits;
        break;
      }
    }
  }

  if (!results || results.length === 0) {
    suggestionsList.innerHTML = '<div style="padding:1.5rem;text-align:center;opacity:0.6;">No videos found. Try another song title or paste a YouTube link!</div>';
    return;
  }

  renderSearchResults(results);
}

function renderSearchResults(results) {
  suggestionsList.innerHTML = '';
  results.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.dataset.id = item.id;
    div.dataset.title = item.title;
    div.dataset.channel = item.channel;
    div.dataset.thumb = item.thumbnail;
    div.innerHTML = `
      <img class="result-thumb" src="${escapeAttr(item.thumbnail)}" loading="lazy">
      <div class="result-info">
        <div class="result-title">${decodeHTML(item.title)}</div>
        <div class="result-channel">${decodeHTML(item.channel)}</div>
      </div>
      <span class="result-duration">${item.duration}</span>
      <div class="result-actions">
        <button class="result-add-btn icon-btn glass-subtle" title="Add to Queue">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    `;

    const addBtn = div.querySelector('.result-add-btn');
    addBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      addToQueue({
        id: item.id,
        title: item.title,
        channel: item.channel,
        thumbnail: item.thumbnail,
        duration: item.duration
      });
    });

    div.addEventListener('click', function () {
      playVideo(item.id, item.title, item.channel, item.thumbnail);
      closeSuggestions();
    });

    suggestionsList.appendChild(div);
  });
}

function showSuggestions() {
  suggestionsPanel.classList.add('open');
  suggestionsPanel.style.display = 'flex';
}

function closeSuggestions() {
  suggestionsPanel.classList.remove('open');
  suggestionsPanel.style.display = 'none';
}

if (suggestionsClose) {
  suggestionsClose.addEventListener('click', closeSuggestions);
}

document.addEventListener('click', function (e) {
  if (
    suggestionsPanel &&
    !suggestionsPanel.contains(e.target) &&
    e.target !== searchInput &&
    (!searchGlobal || !searchGlobal.contains(e.target)) &&
    (!heroSearchInput || e.target !== heroSearchInput) &&
    (!heroSearchGo || !heroSearchGo.contains(e.target))
  ) {
    closeSuggestions();
  }
});

// ═══════════════════════════════════════════
// 4. Screen Management & Play Video
// ═══════════════════════════════════════════

function showHomeScreen() {
  if (homeScreen) {
    homeScreen.style.display = 'block';
    homeScreen.classList.remove('screen--inactive');
  }
  if (playerScreen) {
    playerScreen.classList.add('screen--inactive');
    playerScreen.style.display = 'flex';
  }
  if (karaokeRoom) {
    karaokeRoom.style.display = 'none';
  }
  syncNavTabs('home');
  const miniPlayerPopup = $('miniPlayerPopup');
  if (miniPlayerPopup && currentVideoId) {
    miniPlayerPopup.style.display = 'flex';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPlayerScreen() {
  if (homeScreen) {
    homeScreen.style.display = 'none';
  }
  if (playerScreen) {
    playerScreen.classList.remove('screen--inactive');
    playerScreen.style.display = 'flex';
  }
  if (karaokeRoom) {
    karaokeRoom.style.display = 'none';
  }
  syncNavTabs('player');
  const miniPlayerPopup = $('miniPlayerPopup');
  if (miniPlayerPopup) {
    miniPlayerPopup.style.display = 'none';
  }
}

function showKaraokeScreen() {
  if (!currentVideoId) {
    toast('Pick a song to open Karaoke room');
    return;
  }
  if (homeScreen) {
    homeScreen.style.display = 'none';
  }
  if (playerScreen) {
    playerScreen.classList.add('screen--inactive');
    playerScreen.style.display = 'flex';
  }
  if (karaokeRoom) {
    karaokeRoom.style.display = 'flex';
    updateKaraokeRoom();
  }
  syncNavTabs('karaoke');
  const miniPlayerPopup = $('miniPlayerPopup');
  if (miniPlayerPopup) {
    miniPlayerPopup.style.display = 'none';
  }
}

function syncNavTabs(activeTab) {
  const homeTab = $('navHomeTab');
  const playerTab = $('navPlayerTab');
  const karaokeTab = $('navKaraokeTab');
  if (homeTab) homeTab.classList.toggle('active', activeTab === 'home');
  if (playerTab) playerTab.classList.toggle('active', activeTab === 'player');
  if (karaokeTab) karaokeTab.classList.toggle('active', activeTab === 'karaoke');
}

function playVideo(id, title, channel, thumbnail, forceFullPlayer = true) {
  currentVideoId = id;
  currentTitle = title;
  currentChannel = channel;
  currentThumbnail = thumbnail || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

  // Update DJ Turntable Vinyl Center Image & Label
  const djVinylArt = $('djVinylArt');
  const djVinylText = $('djVinylText');
  const djVinylEmpty = $('djVinylEmpty');
  if (djVinylArt) {
    djVinylArt.src = currentThumbnail;
    djVinylArt.style.display = 'block';
    djVinylArt.style.opacity = '1';
  }
  if (djVinylText) {
    djVinylText.style.display = 'block';
    djVinylText.textContent = decodeHTML(title).split('—')[0].trim().substring(0, 14);
  }
  if (djVinylEmpty) {
    djVinylEmpty.style.display = 'none';
  }

  // Update Floating Mini Screen Popup
  const miniThumb = $('miniPlayerThumb');
  const miniTitle = $('miniPlayerTitle');
  const miniArtist = $('miniPlayerArtist');
  if (miniThumb) miniThumb.src = currentThumbnail;
  if (miniTitle) miniTitle.textContent = decodeHTML(title);
  if (miniArtist) miniArtist.textContent = decodeHTML(channel);

  // Screen display logic:
  if (karaokeRoom && karaokeRoom.style.display === 'flex') {
    updateKaraokeRoom();
  } else if (forceFullPlayer) {
    showPlayerScreen();
  } else {
    showHomeScreen();
  }

  // Start video playback
  if (isPlayerReady && ytPlayer && ytPlayer.loadVideoById) {
    try {
      ytPlayer.loadVideoById(id);
      if (ytPlayer.unMute) ytPlayer.unMute();
      if (ytPlayer.setVolume) ytPlayer.setVolume(volume || 80);
      if (ytPlayer.playVideo) ytPlayer.playVideo();
    } catch (err) {
      console.warn('Error loading video:', err);
    }
  } else {
    pendingVideo = { id, title, channel, thumbnail, force: forceFullPlayer };
  }

  if (songTitle) songTitle.textContent = decodeHTML(title);
  if (songChannel) songChannel.textContent = decodeHTML(channel);
  document.title = `${decodeHTML(title)} — Bajao Gana`;

  // Track in queue so Next/Prev are always queue-aware
  const qIdx = queue.findIndex(item => item.id === id);
  if (qIdx !== -1) {
    queueIndex = qIdx;
  } else if (queue.length === 0) {
    queue.push({ id, title, channel, thumbnail: currentThumbnail, duration: '' });
    queueIndex = 0;
  }
  renderQueue();

  isPlaying = true;
  updatePlayPauseIcon();
  updateTurntableUI();

  extractColors(currentThumbnail);
  fetchLyrics(title);

  toast(`Now playing: ${decodeHTML(title)}`);
}

// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// 5. Playback Controls (100% Robust & Universal)
// ═══════════════════════════════════════════

// Play / Pause
if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);

function togglePlayPause() {
  if (!currentVideoId) {
    // If no song loaded yet, start the first trending track immediately!
    const firstSong = TRENDING_RECOMMENDATIONS[0];
    if (firstSong) {
      toast(`Playing ${firstSong.title.split('—')[0].trim()}...`);
      playVideo(firstSong.id, firstSong.title, firstSong.channel, firstSong.thumbnail, true);
    }
    return;
  }

  try {
    let playerState = -1;
    if (ytPlayer && typeof ytPlayer.getPlayerState === 'function') {
      playerState = ytPlayer.getPlayerState();
    }

    if (isPlaying || playerState === 1) {
      if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
      }
      isPlaying = false;
      stopProgressLoop();
      toast('Paused');
    } else {
      if (ytPlayer) {
        if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
        if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(volume || 80);
        if (typeof ytPlayer.playVideo === 'function') ytPlayer.playVideo();
      }
      isPlaying = true;
      startProgressLoop();
      toast('Playing');
    }
  } catch (err) {
    console.warn('togglePlayPause error:', err);
    isPlaying = !isPlaying;
  }

  updatePlayPauseIcon();
  updateTurntableUI();
}

function playNext() {
  // 1. If queue has items and we are not at end
  if (queue.length > 0 && queueIndex >= 0 && queueIndex < queue.length - 1) {
    playFromQueue(queueIndex + 1);
    return;
  }

  // 2. If queue has items and loop is enabled
  if (queue.length > 0 && isLooping) {
    playFromQueue(0);
    return;
  }

  // 3. Fallback: cycle through trending recommendations
  let nextIdx = 0;
  if (currentVideoId && TRENDING_RECOMMENDATIONS.length > 0) {
    const curIdx = TRENDING_RECOMMENDATIONS.findIndex((t) => t.id === currentVideoId);
    if (curIdx !== -1) {
      nextIdx = (curIdx + 1) % TRENDING_RECOMMENDATIONS.length;
    }
  }
  const nextTrack = TRENDING_RECOMMENDATIONS[nextIdx] || TRENDING_RECOMMENDATIONS[0];
  if (nextTrack) {
    toast(`Next: ${nextTrack.title.split('—')[0].trim()}`);
    playVideo(nextTrack.id, nextTrack.title, nextTrack.channel, nextTrack.thumbnail);
  }
}

function playPrev() {
  // 1. If track has played for more than 3 seconds, replay from start
  if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function' && ytPlayer.getCurrentTime() > 3) {
    ytPlayer.seekTo(0, true);
    toast('Replay from start');
    return;
  }

  // 2. If queue has previous songs
  if (queue.length > 0 && queueIndex > 0) {
    playFromQueue(queueIndex - 1);
    return;
  }

  // 3. Fallback to previous in trending recommendations
  let prevIdx = 0;
  if (currentVideoId && TRENDING_RECOMMENDATIONS.length > 0) {
    const curIdx = TRENDING_RECOMMENDATIONS.findIndex((t) => t.id === currentVideoId);
    if (curIdx !== -1) {
      prevIdx = (curIdx - 1 + TRENDING_RECOMMENDATIONS.length) % TRENDING_RECOMMENDATIONS.length;
    } else {
      prevIdx = TRENDING_RECOMMENDATIONS.length - 1;
    }
  }
  const prevTrack = TRENDING_RECOMMENDATIONS[prevIdx] || TRENDING_RECOMMENDATIONS[0];
  if (prevTrack) {
    toast(`Previous: ${prevTrack.title.split('—')[0].trim()}`);
    playVideo(prevTrack.id, prevTrack.title, prevTrack.channel, prevTrack.thumbnail);
  }
}

// Prev / Next button listeners
if (prevTrackBtn) prevTrackBtn.addEventListener('click', playPrev);
if (nextTrackBtn) nextTrackBtn.addEventListener('click', playNext);

// Loop toggle
if (loopBtn) {
  loopBtn.addEventListener('click', function () {
    isLooping = !isLooping;
    loopBtn.classList.toggle('active', isLooping);
    if (karaokeLoopBtn) karaokeLoopBtn.classList.toggle('active', isLooping);
    const queueLoopStatus = $('queueLoopStatus');
    if (queueLoopStatus) queueLoopStatus.textContent = isLooping ? 'On' : 'Off';
    toast(isLooping ? 'Loop enabled' : 'Loop disabled');
  });
}

// Shuffle queue
if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleQueue);

// Speed button & menu
if (speedBtn) {
  speedBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!speedMenu) return;
    speedMenu.classList.toggle('open');
    speedMenu.style.display = speedMenu.style.display === 'flex' ? 'none' : 'flex';
  });
}

document.querySelectorAll('.speed-opt[data-speed]').forEach((opt) => {
  opt.addEventListener('click', function () {
    const rate = parseFloat(this.dataset.speed);
    if (ytPlayer && typeof ytPlayer.setPlaybackRate === 'function') {
      ytPlayer.setPlaybackRate(rate);
    }
    if (speedLabel) speedLabel.textContent = rate + '×';
    if (karaokeSpeedLabel) karaokeSpeedLabel.textContent = rate + '×';
    document.querySelectorAll('.speed-opt').forEach((o) => o.classList.remove('active'));
    this.classList.add('active');
    if (speedMenu) {
      speedMenu.style.display = 'none';
      speedMenu.classList.remove('open');
    }
    toast(`Speed set to ${rate}×`);
  });
});

document.addEventListener('click', function (e) {
  if (speedMenu && !speedMenu.contains(e.target) && e.target !== speedBtn) {
    speedMenu.style.display = 'none';
    speedMenu.classList.remove('open');
  }
});

// Volume button (Mute / Unmute)
if (volumeBtn) {
  volumeBtn.addEventListener('click', function () {
    isMuted = !isMuted;
    if (ytPlayer) {
      if (isMuted) {
        if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
      } else {
        if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
        if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(volume);
      }
    }
    updateVolumeUI();
    toast(isMuted ? 'Muted' : `Volume: ${volume}%`);
  });
}

// Volume Bar Seek
if (volumeBar) {
  volumeBar.addEventListener('click', function (e) {
    const rect = volumeBar.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    volume = Math.round(pct);
    isMuted = volume === 0;
    if (ytPlayer) {
      if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(volume);
      if (isMuted) {
        if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
      } else {
        if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
      }
    }
    updateVolumeUI();
  });
}

function updateVolumeUI() {
  const displayVol = isMuted ? 0 : volume;
  if (volumeFill) volumeFill.style.width = displayVol + '%';
  if (karaokeVolumeFill) karaokeVolumeFill.style.width = displayVol + '%';

  if (volIconHigh) volIconHigh.style.display = isMuted ? 'none' : 'block';
  if (volIconMute) volIconMute.style.display = isMuted ? 'block' : 'none';

  const kHigh = document.querySelector('.k-vol-high');
  const kMute = document.querySelector('.k-vol-mute');
  if (kHigh) kHigh.style.display = isMuted ? 'none' : 'block';
  if (kMute) kMute.style.display = isMuted ? 'block' : 'none';
}

// Universal Seek to Ratio Function
function seekToRatio(ratio) {
  if (!ytPlayer) return;
  const dur = (typeof ytPlayer.getDuration === 'function') ? ytPlayer.getDuration() : 0;
  if (dur <= 0) return;
  const clamped = Math.max(0, Math.min(1, ratio));
  const seekTime = clamped * dur;
  if (typeof ytPlayer.seekTo === 'function') {
    ytPlayer.seekTo(seekTime, true);
  }
  // Instant visual update
  const pct = clamped * 100;
  if (progressFill) progressFill.style.width = pct + '%';
  if (progressThumb) progressThumb.style.left = pct + '%';
  if (timeCurrent) timeCurrent.textContent = formatTime(seekTime);
  if (karaokeProgressFill) karaokeProgressFill.style.width = pct + '%';
  if (karaokeProgressThumb) karaokeProgressThumb.style.left = pct + '%';
  if (karaokeTimeCurrent) karaokeTimeCurrent.textContent = formatTime(seekTime);
  const miniFill = $('miniProgressFill');
  const miniCurTime = $('miniCurrentTime');
  if (miniFill) miniFill.style.width = pct + '%';
  if (miniCurTime) miniCurTime.textContent = formatTime(seekTime);
  highlightLyric(seekTime);
  highlightKaraokeLyric(seekTime);
}

// Progress Bar Seeking on Main Player
if (progressBar) {
  progressBar.addEventListener('click', function (e) {
    const rect = progressBar.getBoundingClientRect();
    if (rect.width <= 0) return;
    seekToRatio((e.clientX - rect.left) / rect.width);
  });
}

// Dedicated Mini Player (PiP) Buttons on Song Page (Image 7)
function activateMiniPlayer() {
  showHomeScreen();
  const miniPlayerPopup = $('miniPlayerPopup');
  if (miniPlayerPopup && currentVideoId) {
    miniPlayerPopup.style.display = 'flex';
  }
  toast('Mini player active (PiP)');
}

const playerMiniBtn = $('playerMiniBtn');
const songActionMiniBtn = $('songActionMiniBtn');
if (playerMiniBtn) playerMiniBtn.addEventListener('click', activateMiniPlayer);
if (songActionMiniBtn) songActionMiniBtn.addEventListener('click', activateMiniPlayer);

let animFrameId = null;

function startProgressLoop() {
  stopProgressLoop();
  function progressTick() {
    if (!isPlaying) return;
    updateProgress();
    animFrameId = requestAnimationFrame(progressTick);
  }
  animFrameId = requestAnimationFrame(progressTick);
}

function stopProgressLoop() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function updateProgress() {
  if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function' || typeof ytPlayer.getDuration !== 'function') return;
  const current = ytPlayer.getCurrentTime();
  const total = ytPlayer.getDuration();
  if (total <= 0) return;

  const pct = (current / total) * 100;
  if (progressFill) progressFill.style.width = pct + '%';
  if (progressThumb) progressThumb.style.left = pct + '%';
  if (timeCurrent) timeCurrent.textContent = formatTime(current);
  if (timeTotal) timeTotal.textContent = formatTime(total);

  // Sync Karaoke Mode Progress
  if (karaokeProgressFill) karaokeProgressFill.style.width = pct + '%';
  if (karaokeProgressThumb) karaokeProgressThumb.style.left = pct + '%';
  if (karaokeTimeCurrent) karaokeTimeCurrent.textContent = formatTime(current);
  if (karaokeTimeTotal) karaokeTimeTotal.textContent = formatTime(total);

  // Sync Mini Screen Popup Progress
  const miniFill = $('miniProgressFill');
  const miniCurTime = $('miniCurrentTime');
  const miniTotTime = $('miniTotalTime');
  if (miniFill) miniFill.style.width = pct + '%';
  if (miniCurTime) miniCurTime.textContent = formatTime(current);
  if (miniTotTime) miniTotTime.textContent = formatTime(total);

  highlightLyric(current);
  if (karaokeRoom && karaokeRoom.style.display !== 'none') {
    highlightKaraokeLyric(current);
  }
}

// Periodic Safety Watcher (Every 250ms)
// Guarantees play/pause status, seek bar, and lyrics sync NEVER stall
setInterval(function syncPlaybackSafetyCheck() {
  if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;
  try {
    const state = ytPlayer.getPlayerState();
    if (state === 1) { // YT.PlayerState.PLAYING
      if (!isPlaying) {
        isPlaying = true;
        updatePlayPauseIcon();
        updateTurntableUI();
      }
      updateProgress();
    } else if (state === 2) { // YT.PlayerState.PAUSED
      if (isPlaying) {
        isPlaying = false;
        updatePlayPauseIcon();
        updateTurntableUI();
      }
    }
  } catch (e) {}
}, 250);


// 6. Queue System
// ═══════════════════════════════════════════

function addToQueue(item) {
  queue.push(item);
  renderQueue();
  toast(`Added to queue: ${decodeHTML(item.title)}`);
}

function removeFromQueue(index) {
  queue.splice(index, 1);
  if (queueIndex >= queue.length) {
    queueIndex = queue.length - 1;
  }
  if (index < queueIndex) {
    queueIndex--;
  }
  renderQueue();
}

function clearQueue() {
  queue = [];
  queueIndex = -1;
  renderQueue();
  toast('Queue cleared');
}

function shuffleQueue() {
  if (queue.length <= 1) return;

  let currentItem = null;
  if (queueIndex >= 0 && queueIndex < queue.length) {
    currentItem = queue[queueIndex];
  }

  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  if (currentItem) {
    const newIdx = queue.indexOf(currentItem);
    if (newIdx !== -1) {
      queueIndex = newIdx;
    }
  }

  renderQueue();
  toast('Queue shuffled');
}

function playFromQueue(index) {
  if (index < 0 || index >= queue.length) return;
  queueIndex = index;
  const item = queue[index];
  playVideo(item.id, item.title, item.channel, item.thumbnail);
}

function playNext() {
  if (queueIndex >= 0 && queueIndex < queue.length - 1) {
    playFromQueue(queueIndex + 1);
  }
}

function playPrev() {
  if (queueIndex > 0) {
    playFromQueue(queueIndex - 1);
  } else {
    if (ytPlayer && ytPlayer.seekTo) {
      ytPlayer.seekTo(0, true);
    }
  }
}

// Queue panel toggle
queueToggleBtn.addEventListener('click', function () {
  queuePanel.classList.toggle('open');
  queueOverlay.style.display = queuePanel.classList.contains('open') ? 'block' : 'none';
});

queueCloseBtn.addEventListener('click', closeQueuePanel);
queueOverlay.addEventListener('click', closeQueuePanel);

function closeQueuePanel() {
  queuePanel.classList.remove('open');
  queueOverlay.style.display = 'none';
}

clearQueueBtn.addEventListener('click', clearQueue);

addToQueueBtn.addEventListener('click', function () {
  if (!currentVideoId) return;
  addToQueue({
    id: currentVideoId,
    title: currentTitle,
    channel: currentChannel,
    thumbnail: currentThumbnail,
    duration: ''
  });
});

function renderQueue() {
  // Badge
  if (queueBadge) {
    queueBadge.textContent = queue.length;
    queueBadge.style.display = queue.length > 0 ? 'flex' : 'none';
  }

  // Count pill in queue header
  const queueCountPill = $('queueCountPill');
  if (queueCountPill) {
    queueCountPill.textContent = `${queue.length} ${queue.length === 1 ? 'song' : 'songs'}`;
  }

  if (!queueList) return;

  if (queue.length === 0) {
    queueList.innerHTML = '<div class="queue-empty" style="padding:2rem;text-align:center;opacity:0.5;">Your queue is empty<br><span style="font-size:0.75rem;">Type above and click + Add to build your vibe!</span></div>';
    if (queueNowPlaying) queueNowPlaying.style.display = 'none';
    if (queueNextLabel) queueNextLabel.style.display = 'none';
    if (queueNowItem) queueNowItem.innerHTML = '';
    return;
  }

  // Now playing section
  if (queueIndex >= 0 && queueIndex < queue.length) {
    if (queueNowPlaying) queueNowPlaying.style.display = 'block';
    if (queueNowItem) {
      const cur = queue[queueIndex];
      queueNowItem.innerHTML = `
        <div class="queue-item queue-item--active" data-index="${queueIndex}">
          <span class="queue-item__num" style="color:var(--primary-light);">▶</span>
          <img class="queue-item__thumb" src="${escapeAttr(cur.thumbnail)}" alt="Thumb">
          <div class="queue-item__info">
            <div class="queue-item__title">${decodeHTML(cur.title)}</div>
            <div class="queue-item__channel">${decodeHTML(cur.channel)}</div>
          </div>
        </div>
      `;
    }
  } else {
    if (queueNowPlaying) queueNowPlaying.style.display = 'none';
    if (queueNowItem) queueNowItem.innerHTML = '';
  }

  // Next up
  const upcomingItems = queue.filter((_, i) => i !== queueIndex);
  if (queueNextLabel) {
    queueNextLabel.style.display = upcomingItems.length > 0 ? 'block' : 'none';
  }

  queueList.innerHTML = '';
  queue.forEach((item, i) => {
    if (i === queueIndex) return;
    const div = document.createElement('div');
    div.className = 'queue-item';
    div.dataset.index = i;
    div.innerHTML = `
      <div class="queue-item__reorder">
        <button class="queue-move-btn queue-move-up" title="Move Up" ${i === 0 ? 'disabled' : ''}>▲</button>
        <button class="queue-move-btn queue-move-down" title="Move Down" ${i === queue.length - 1 ? 'disabled' : ''}>▼</button>
      </div>
      <span class="queue-item__num">#${i + 1}</span>
      <img class="queue-item__thumb" src="${escapeAttr(item.thumbnail)}" alt="Thumb">
      <div class="queue-item__info">
        <div class="queue-item__title">${decodeHTML(item.title)}</div>
        <div class="queue-item__channel">${decodeHTML(item.channel)}</div>
      </div>
      <button class="queue-item__remove icon-btn" title="Remove Track">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    // Move Up
    const upBtn = div.querySelector('.queue-move-up');
    if (upBtn) {
      upBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (i > 0) {
          const temp = queue[i];
          queue[i] = queue[i - 1];
          queue[i - 1] = temp;
          if (queueIndex === i) queueIndex = i - 1;
          else if (queueIndex === i - 1) queueIndex = i;
          renderQueue();
          toast('Track moved up in queue');
        }
      });
    }

    // Move Down
    const downBtn = div.querySelector('.queue-move-down');
    if (downBtn) {
      downBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (i < queue.length - 1) {
          const temp = queue[i];
          queue[i] = queue[i + 1];
          queue[i + 1] = temp;
          if (queueIndex === i) queueIndex = i + 1;
          else if (queueIndex === i + 1) queueIndex = i;
          renderQueue();
          toast('Track moved down in queue');
        }
      });
    }

    div.querySelector('.queue-item__remove').addEventListener('click', function (e) {
      e.stopPropagation();
      removeFromQueue(i);
    });

    div.addEventListener('click', function () {
      playFromQueue(i);
    });

    queueList.appendChild(div);
  });
}

// ═══════════════════════════════════════════
// 7. Lyrics System (Built-in LRC & Real-time API)
// ═══════════════════════════════════════════

const BUILTIN_SYNCED_LYRICS = {
  'kesariya': `[00:15.50] Mujhko itna bataye koyi
[00:20.00] Kaise tujhse dil na lagaye koyi
[00:25.50] Rabba ne tujhko banane mein
[00:29.00] Kar di hai husn ki khaali tijoriyan
[00:35.00] Kaajal ki siyahi se likhi
[00:38.50] Hai tune jaane kitno ki love storiyan
[00:44.00] Kesariya tera ishq hai piya
[00:49.00] Rang jaaun jo main haath lagaun
[00:54.00] Din beete saara teri fikr mein
[00:58.50] Rain saari teri khair manaun
[01:03.50] Kesariya tera ishq hai piya
[01:08.00] Rang jaaun jo main haath lagaun
[01:13.00] Din beete saara teri fikr mein
[01:18.00] Rain saari teri khair manaun
[01:32.00] Patjhad ke mausam mein bhi
[01:36.50] Rangi chanar jaisi
[01:41.50] Jhanke sannaate mein tu
[01:46.00] Veena ke taar jaisi
[01:51.00] Sadiyon se bhi lambi yeh
[01:56.00] Mann ki amavasein hain
[02:00.50] Aur tu phuljhadiyon waale
[02:05.00] Tyohar jaisi
[02:10.00] Chanda bhi deewana hai tera
[02:14.50] Jalti hai tujhse saari chakoriyan
[02:19.50] Kaajal ki siyahi se likhi
[02:24.00] Hai tune jaane kitno ki love storiyan
[02:29.00] Kesariya tera ishq hai piya
[02:34.00] Rang jaaun jo main haath lagaun
[02:39.00] Din beete saara teri fikr mein
[02:43.50] Rain saari teri khair manaun`,

  'blinding': `[00:15.00] Yeah
[00:26.50] I've been tryna call
[00:29.00] I've been on my own for long enough
[00:32.00] Maybe you can show me how to love, maybe
[00:38.00] I'm going through withdrawals
[00:41.00] You don't even have to do too much
[00:44.00] You can turn me on with just a touch, baby
[00:49.00] I look around and Sin City's cold and empty
[00:54.00] No one's around to judge me
[00:57.00] I can't see clearly when you're gone
[01:01.00] I said, ooh, I'm blinded by the lights
[01:07.00] No, I can't sleep until I feel your touch
[01:13.00] I said, ooh, I'm drowning in the night
[01:19.00] Oh, when I'm like this, you're the one I trust
[01:28.00] I'm running out of time
[01:31.00] 'Cause I can see the sun light up the sky
[01:34.00] So I hit the road in overdrive, baby
[01:40.00] The city's cold and empty
[01:43.00] No one's around to judge me
[01:46.00] I can't see clearly when you're gone
[01:50.00] I said, ooh, I'm blinded by the lights
[01:56.00] No, I can't sleep until I feel your touch
[02:02.00] I said, ooh, I'm drowning in the night
[02:08.00] Oh, when I'm like this, you're the one I trust
[02:16.00] I'm just walking by to let you know
[02:22.00] I could never say it on the phone
[02:28.00] Will never let you go this time
[02:35.00] I said, ooh, I'm blinded by the lights
[02:41.00] No, I can't sleep until I feel your touch`,

  'believer': `[00:08.50] First things first
[00:09.80] I'ma say all the words inside my head
[00:12.50] I'm fired up and tired of the way that things have been, oh-ooh
[00:17.50] The way that things have been, oh-ooh
[00:21.00] Second thing second
[00:22.50] Don't you tell me what you think that I could be
[00:25.50] I'm the one at the sail, I'm the master of my sea, oh-ooh
[00:30.50] The master of my sea, oh-ooh
[00:34.00] I was broken from a young age
[00:36.50] Taking my sulking to the masses
[00:39.00] Writing my poems for the few
[00:41.00] That look at me, took to me, shook to me, feeling me
[00:43.50] Singing from heartache from the pain
[00:45.50] Taking my message from the veins
[00:47.50] Speaking my lesson from the brain
[00:49.00] Seeing the beauty through the...
[00:50.50] Pain!
[00:52.00] You made me a, you made me a believer, believer
[00:58.50] Pain!
[01:00.50] You break me down, you build me up, believer, believer
[01:07.50] Pain!
[01:09.50] Oh let the bullets fly, oh let them rain
[01:13.50] My life, my love, my drive, it came from...
[01:16.50] Pain!
[01:18.00] You made me a, you made me a believer, believer`,

  'with you': `[00:14.00] Tere naal jiyun da supna ve
[00:17.50] Har saah tere naal kadhna ve
[00:21.00] Dil karda rehna tere kol
[00:24.50] Kade door tere ton hona nahi
[00:28.00] Tere naal jiyun da supna ve
[00:31.50] Har saah tere naal kadhna ve
[00:35.00] Dil karda rehna tere kol
[00:38.50] Kade door tere ton hona nahi
[00:42.00] Akhiyan ch chehra tera
[00:45.50] Bulliyan te tera naam
[00:49.00] Meri taan zindagi ban gayi
[00:52.50] Tere sang subah te shaam
[00:56.00] Tere naal jiyun da supna ve
[00:59.50] Har saah tere naal kadhna ve
[01:03.00] Dil karda rehna tere kol
[01:06.50] Kade door tere ton hona nahi`,

  'get lucky': `[00:18.00] Like the legend of the phoenix
[00:22.00] All ends with beginnings
[00:26.50] What keeps the planet spinning
[00:31.00] The force from the beginning
[00:35.50] We've come too far to give up who we are
[00:44.00] So let's raise the bar and our cups to the stars
[00:52.50] She's up all night 'til the sun
[00:54.50] I'm up all night to get some
[00:56.50] She's up all night for good fun
[00:58.50] I'm up all night to get lucky
[01:01.00] We're up all night 'til the sun
[01:03.00] We're up all night to get some
[01:05.00] We're up all night for good fun
[01:07.00] We're up all night to get lucky
[01:09.50] We're up all night to get lucky`,

  'the less i know': `[00:20.00] Someone said they left together
[00:24.50] I ran out the door to get her
[00:29.00] She was holding hands with Trevor
[00:34.00] Not the greatest feeling ever
[00:38.00] Said, "Pull yourself together
[00:43.00] You should try your luck with Heather"
[00:47.50] Man, I hope they're not together
[00:52.00] Oh, the less I know the better
[01:00.00] The less I know the better
[01:10.50] Oh my love, can't you see yourself by my side?
[01:19.50] No surprise when you're on his shoulder like every night
[01:29.00] Oh my love, can't you see that you're on my mind?
[01:38.00] Don't suppose we could convince your lover to change his mind
[01:46.50] So goodbye`
};

function cleanTitle(raw) {
  let cleaned = raw;
  cleaned = cleaned.replace(/\(Official\s*(Video|Audio|Music Video|Lyric Video|Visualizer)\)/gi, '');
  cleaned = cleaned.replace(/\(.*?\)/g, '');
  cleaned = cleaned.replace(/\[.*?\]/g, '');
  cleaned = cleaned.replace(/\|.*/g, '');
  cleaned = cleaned.replace(/\b(ft\.?|feat\.?)\s*.*/gi, '');
  cleaned = cleaned.replace(/[—–]/g, ' - ');
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.trim();
  return cleaned;
}

async function fetchLyrics(rawTitle) {
  syncedLyrics = [];
  plainLyrics = '';
  lastKaraokeActiveIdx = -1;
  lastPlayerActiveIdx = -1;

  if (lyricsLines) {
    lyricsLines.innerHTML = '';
    lyricsLines.style.display = 'none';
  }
  if (lyricsEmpty) lyricsEmpty.style.display = 'flex';
  if (karaokeLyrics) karaokeLyrics.innerHTML = '';

  // 1. Instant check against built-in LRC database
  const lower = rawTitle.toLowerCase();
  for (const [key, lrc] of Object.entries(BUILTIN_SYNCED_LYRICS)) {
    if (lower.includes(key)) {
      syncedLyrics = parseLRC(lrc);
      karaokeSyncedLyrics = parseLRC(lrc);
      renderSyncedLyrics(syncedLyrics, lyricsLines);
      renderKaraokeLyrics(karaokeSyncedLyrics);
      if (lyricsEmpty) lyricsEmpty.style.display = 'none';
      if (lyricsLines) lyricsLines.style.display = 'block';
      return;
    }
  }

  // 2. Online search via LRCLib API
  const cleaned = cleanTitle(rawTitle);
  let artist = '';
  let trackName = cleaned;
  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ');
    artist = parts[0].trim();
    trackName = parts.slice(1).join(' - ').trim();
  }

  let results = null;

  // Try specific search first
  if (artist && trackName) {
    try {
      const url = `https://lrclib.net/api/search?track_name=${encodeURIComponent(trackName)}&artist_name=${encodeURIComponent(artist)}`;
      const resp = await fetch(url);
      if (resp.ok) {
        results = await resp.json();
      }
    } catch (e) {
      // ignore
    }
  }

  // Fallback to general search
  if (!results || results.length === 0) {
    try {
      const url = `https://lrclib.net/api/search?q=${encodeURIComponent(trackName || cleaned)}`;
      const resp = await fetch(url);
      if (resp.ok) {
        results = await resp.json();
      }
    } catch (e) {
      // ignore
    }
  }

  if (!results || results.length === 0) {
    if (lyricsEmpty) lyricsEmpty.style.display = 'flex';
    return;
  }

  // Prefer result with syncedLyrics
  let best = results.find((r) => r.syncedLyrics) || results[0];

  if (best.syncedLyrics) {
    syncedLyrics = parseLRC(best.syncedLyrics);
    karaokeSyncedLyrics = parseLRC(best.syncedLyrics);
    renderSyncedLyrics(syncedLyrics, lyricsLines);
    renderKaraokeLyrics(karaokeSyncedLyrics);
    if (lyricsEmpty) lyricsEmpty.style.display = 'none';
    if (lyricsLines) lyricsLines.style.display = 'block';
  } else if (best.plainLyrics) {
    plainLyrics = best.plainLyrics;
    syncedLyrics = [];
    karaokeSyncedLyrics = [];
    renderPlainLyrics(best.plainLyrics);
    if (lyricsEmpty) lyricsEmpty.style.display = 'none';
    if (lyricsLines) lyricsLines.style.display = 'block';
  } else {
    if (lyricsEmpty) lyricsEmpty.style.display = 'flex';
    if (lyricsLines) lyricsLines.style.display = 'none';
  }
}

function parseLRC(lrc) {
  const lines = lrc.split('\n');
  const parsed = [];
  for (const line of lines) {
    const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      let centis = match[3];
      if (centis.length === 2) centis = centis + '0';
      const millis = parseInt(centis, 10);
      const time = minutes * 60 + seconds + millis / 1000;
      const text = match[4].trim();
      if (text) {
        parsed.push({ time, text });
      }
    }
  }
  return parsed;
}

function renderSyncedLyrics(lyrics, container) {
  if (!container) return;
  container.innerHTML = '';
  lyrics.forEach((line, i) => {
    const div = document.createElement('div');
    div.className = 'lyric-line';
    div.dataset.time = line.time;
    div.textContent = line.text;
    div.addEventListener('click', function () {
      if (ytPlayer && ytPlayer.seekTo) {
        ytPlayer.seekTo(line.time, true);
      }
    });
    container.appendChild(div);
  });
}

function renderPlainLyrics(text) {
  if (!lyricsLines) return;
  lyricsLines.innerHTML = '';
  const lines = text.split('\n');
  lines.forEach((line) => {
    const div = document.createElement('div');
    div.className = 'lyric-line lyric-line--plain';
    div.textContent = line;
    lyricsLines.appendChild(div);
  });
  // Also render in karaoke (plain)
  if (karaokeLyrics) {
    karaokeLyrics.innerHTML = '';
    lines.forEach((line) => {
      const div = document.createElement('div');
      div.className = 'karaoke-line karaoke-line--plain';
      div.textContent = line;
      karaokeLyrics.appendChild(div);
    });
  }
}

function renderKaraokeLyrics(lyrics) {
  if (!karaokeLyrics) return;
  karaokeLyrics.innerHTML = '';
  lyrics.forEach((line, lineIdx) => {
    const div = document.createElement('div');
    div.className = 'karaoke-line';
    div.dataset.time = line.time;
    div.dataset.lineIdx = lineIdx;

    // Split text into individual words for progressive sweep
    const rawWords = line.text.trim().split(/\s+/);
    div.innerHTML = '';
    rawWords.forEach((word, wIdx) => {
      const span = document.createElement('span');
      span.className = 'k-word word--upcoming';
      span.dataset.w = wIdx;
      span.textContent = word + (wIdx < rawWords.length - 1 ? '\u00A0' : '');
      div.appendChild(span);
    });

    div.addEventListener('click', function () {
      if (ytPlayer && ytPlayer.seekTo) {
        ytPlayer.seekTo(line.time, true);
      }
    });
    karaokeLyrics.appendChild(div);
  });
}

let lastPlayerActiveIdx = -1;

function highlightLyric(currentTime) {
  if (!lyricsLines || syncedLyrics.length === 0) return;
  const lines = lyricsLines.querySelectorAll('.lyric-line');
  if (lines.length === 0) return;

  let activeIdx = -1;
  for (let i = syncedLyrics.length - 1; i >= 0; i--) {
    if (currentTime >= syncedLyrics[i].time - 0.25) {
      activeIdx = i;
      break;
    }
  }

  if (activeIdx !== lastPlayerActiveIdx) {
    lastPlayerActiveIdx = activeIdx;
    lines.forEach((line, i) => {
      if (i < activeIdx) {
        line.className = 'lyric-line past';
      } else if (i === activeIdx) {
        line.className = 'lyric-line active';
        line.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        line.className = 'lyric-line';
      }
    });
  }
}

let lastKaraokeActiveIdx = -1;

function highlightKaraokeLyric(currentTime) {
  if (karaokeSyncedLyrics.length === 0) return;
  const lines = karaokeLyrics ? karaokeLyrics.querySelectorAll('.karaoke-line') : [];
  if (lines.length === 0) return;

  let activeIdx = -1;
  for (let i = karaokeSyncedLyrics.length - 1; i >= 0; i--) {
    if (currentTime >= karaokeSyncedLyrics[i].time - 0.25) {
      activeIdx = i;
      break;
    }
  }

  // Smooth auto-scroll when active line transitions
  if (activeIdx !== lastKaraokeActiveIdx) {
    lastKaraokeActiveIdx = activeIdx;
    if (activeIdx >= 0 && lines[activeIdx]) {
      lines[activeIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Progressively sweep text word-by-word across line duration
  lines.forEach((lineEl, i) => {
    const words = lineEl.querySelectorAll('.k-word');

    if (i < activeIdx) {
      lineEl.className = 'karaoke-line past';
      words.forEach((w) => {
        w.className = 'k-word word--sung';
      });
    } else if (i > activeIdx) {
      lineEl.className = 'karaoke-line';
      words.forEach((w) => {
        w.className = 'k-word word--upcoming';
      });
    } else {
      // CURRENT ACTIVE LINE
      lineEl.className = 'karaoke-line active';
      const curLine = karaokeSyncedLyrics[i];
      const nextLine = karaokeSyncedLyrics[i + 1];
      const start = curLine.time;
      const end = nextLine ? nextLine.time : (start + 3.5);
      const dur = Math.max(0.6, end - start);
      const lineProgress = Math.max(0, Math.min(1, (currentTime - start) / dur));

      const numWords = words.length;
      if (numWords > 0) {
        words.forEach((w, wIdx) => {
          const wordStart = wIdx / numWords;
          const wordEnd = (wIdx + 1) / numWords;

          if (lineProgress >= wordEnd) {
            w.className = 'k-word word--sung';
          } else if (lineProgress >= wordStart) {
            w.className = 'k-word word--active';
          } else {
            w.className = 'k-word word--upcoming';
          }
        });
      }
    }
  });
}

// ═══════════════════════════════════════════
// 8. Karaoke Room
// ═══════════════════════════════════════════

function openKaraokeRoom() {
  showKaraokeScreen();
}

function updateKaraokeRoom() {
  if (karaokeBg && currentThumbnail) {
    karaokeBg.style.backgroundImage = `url('${currentThumbnail}')`;
  }
  if (karaokeSongTitle) {
    karaokeSongTitle.textContent = decodeHTML(currentTitle);
  }
  if (karaokeLoopBtn) {
    karaokeLoopBtn.classList.toggle('active', isLooping);
  }
  if (karaokeSpeedLabel) {
    const rate = ytPlayer && ytPlayer.getPlaybackRate ? ytPlayer.getPlaybackRate() : 1;
    karaokeSpeedLabel.textContent = rate + '×';
  }
  updatePlayPauseIcon();
  updateVolumeUI();
  updateProgress();
  // Re-render karaoke lyrics if synced are available
  if (karaokeSyncedLyrics.length > 0) {
    renderKaraokeLyrics(karaokeSyncedLyrics);
    lastKaraokeActiveIdx = -1;
    if (ytPlayer && ytPlayer.getCurrentTime) {
      highlightKaraokeLyric(ytPlayer.getCurrentTime());
    }
  }
}

function closeKaraokeRoom() {
  showPlayerScreen();
}

[karaokeRoomBtn, heroKaraoke, karaokeOpenBtn, lyricsExpandBtn].forEach((btn) => {
  if (btn) {
    btn.addEventListener('click', openKaraokeRoom);
  }
});

if (karaokeCloseBtn) {
  karaokeCloseBtn.addEventListener('click', closeKaraokeRoom);
}

if (karaokePlayPause) {
  karaokePlayPause.addEventListener('click', togglePlayPause);
}
if (karaokePrev) {
  karaokePrev.addEventListener('click', playPrev);
}
if (karaokeNext) {
  karaokeNext.addEventListener('click', playNext);
}

// ── Karaoke Progress Bar Seeking ──
if (karaokeProgressBar) {
  karaokeProgressBar.addEventListener('click', function (e) {
    const rect = karaokeProgressBar.getBoundingClientRect();
    if (rect.width <= 0) return;
    seekToRatio((e.clientX - rect.left) / rect.width);
  });
}

// ── Karaoke Loop & Shuffle ──
if (karaokeLoopBtn) {
  karaokeLoopBtn.addEventListener('click', function () {
    isLooping = !isLooping;
    if (loopBtn) loopBtn.classList.toggle('active', isLooping);
    karaokeLoopBtn.classList.toggle('active', isLooping);
    toast(isLooping ? 'Loop enabled' : 'Loop disabled');
  });
}

if (karaokeShuffleBtn) {
  karaokeShuffleBtn.addEventListener('click', shuffleQueue);
}

// ── Karaoke Speed Menu ──
if (karaokeSpeedBtn) {
  karaokeSpeedBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (karaokeSpeedMenu) {
      karaokeSpeedMenu.style.display = karaokeSpeedMenu.style.display === 'flex' ? 'none' : 'flex';
    }
  });
}

document.querySelectorAll('#karaokeSpeedMenu .speed-opt[data-speed]').forEach((opt) => {
  opt.addEventListener('click', function () {
    const rate = parseFloat(this.dataset.speed);
    if (ytPlayer && ytPlayer.setPlaybackRate) {
      ytPlayer.setPlaybackRate(rate);
    }
    if (speedLabel) speedLabel.textContent = rate + '×';
    if (karaokeSpeedLabel) karaokeSpeedLabel.textContent = rate + '×';
    document.querySelectorAll('#karaokeSpeedMenu .speed-opt').forEach((o) => o.classList.remove('active'));
    this.classList.add('active');
    if (karaokeSpeedMenu) karaokeSpeedMenu.style.display = 'none';
    toast(`Speed set to ${rate}×`);
  });
});

document.addEventListener('click', function (e) {
  if (karaokeSpeedMenu && !karaokeSpeedMenu.contains(e.target) && e.target !== karaokeSpeedBtn) {
    karaokeSpeedMenu.style.display = 'none';
  }
});

// ── Karaoke Volume Controls ──
if (karaokeVolumeBtn) {
  karaokeVolumeBtn.addEventListener('click', function () {
    isMuted = !isMuted;
    if (ytPlayer && ytPlayer.setVolume) {
      if (isMuted) {
        ytPlayer.mute();
      } else {
        ytPlayer.unMute();
        ytPlayer.setVolume(volume);
      }
    }
    updateVolumeUI();
  });
}

if (karaokeVolumeBar) {
  karaokeVolumeBar.addEventListener('click', function (e) {
    const rect = karaokeVolumeBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    volume = Math.round(pct);
    isMuted = volume === 0;
    if (ytPlayer && ytPlayer.setVolume) {
      ytPlayer.setVolume(volume);
      if (isMuted) ytPlayer.mute();
      else ytPlayer.unMute();
    }
    updateVolumeUI();
  });
}

// ── Karaoke Queue Button ──
if (karaokeQueueBtn) {
  karaokeQueueBtn.addEventListener('click', function () {
    if (queuePanel) {
      queuePanel.classList.toggle('open');
      if (queueOverlay) queueOverlay.style.display = queuePanel.classList.contains('open') ? 'block' : 'none';
    }
  });
}

// ═══════════════════════════════════════════
// 9. Color Extraction
// ═══════════════════════════════════════════

function extractColors(thumbnailUrl) {
  if (!thumbnailUrl) {
    resetColors();
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  const proxied = `https://corsproxy.io/?${encodeURIComponent(thumbnailUrl)}`;

  img.onload = function () {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);
      const data = ctx.getImageData(0, 0, 64, 64).data;

      const buckets = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Skip very dark, very light, and grey
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max < 30) continue;
        if (min > 225) continue;
        if (max - min < 20) continue;

        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;
        const key = `${qr},${qg},${qb}`;
        buckets[key] = (buckets[key] || 0) + 1;
      }

      const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
      if (sorted.length === 0) {
        resetColors();
        return;
      }

      const primaryParts = sorted[0][0].split(',').map(Number);
      const primary = { r: primaryParts[0], g: primaryParts[1], b: primaryParts[2] };

      let accent = primary;
      for (let i = 1; i < sorted.length; i++) {
        const parts = sorted[i][0].split(',').map(Number);
        const diff =
          Math.abs(parts[0] - primary.r) +
          Math.abs(parts[1] - primary.g) +
          Math.abs(parts[2] - primary.b);
        if (diff > 80) {
          accent = { r: parts[0], g: parts[1], b: parts[2] };
          break;
        }
      }

      applyColors(primary, accent);
    } catch (e) {
      resetColors();
    }
  };

  img.onerror = function () {
    // Try direct URL without proxy
    const img2 = new Image();
    img2.crossOrigin = 'anonymous';
    img2.onload = function () {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img2, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;

        const buckets = {};
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max < 30) continue;
          if (min > 225) continue;
          if (max - min < 20) continue;
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const key = `${qr},${qg},${qb}`;
          buckets[key] = (buckets[key] || 0) + 1;
        }
        const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) {
          resetColors();
          return;
        }
        const primaryParts = sorted[0][0].split(',').map(Number);
        const primary = { r: primaryParts[0], g: primaryParts[1], b: primaryParts[2] };
        let accent = primary;
        for (let i = 1; i < sorted.length; i++) {
          const parts = sorted[i][0].split(',').map(Number);
          const diff =
            Math.abs(parts[0] - primary.r) +
            Math.abs(parts[1] - primary.g) +
            Math.abs(parts[2] - primary.b);
          if (diff > 80) {
            accent = { r: parts[0], g: parts[1], b: parts[2] };
            break;
          }
        }
        applyColors(primary, accent);
      } catch (e) {
        resetColors();
      }
    };
    img2.onerror = function () {
      resetColors();
    };
    img2.src = thumbnailUrl;
  };

  img.src = proxied;
}

function applyColors(primary, accent) {
  const root = document.documentElement;
  const pStr = `${primary.r}, ${primary.g}, ${primary.b}`;
  const aStr = `${accent.r}, ${accent.g}, ${accent.b}`;

  const pLight = `${Math.min(255, primary.r + 60)}, ${Math.min(255, primary.g + 60)}, ${Math.min(255, primary.b + 60)}`;
  const pDark = `${Math.max(0, primary.r - 40)}, ${Math.max(0, primary.g - 40)}, ${Math.max(0, primary.b - 40)}`;

  root.style.setProperty('--primary', `rgb(${pStr})`);
  root.style.setProperty('--primary-light', `rgb(${pLight})`);
  root.style.setProperty('--primary-dark', `rgb(${pDark})`);
  root.style.setProperty('--accent', `rgb(${aStr})`);
  root.style.setProperty('--primary-rgb', pStr);
  root.style.setProperty('--accent-rgb', aStr);

  if (bgGradient) {
    bgGradient.style.background = `
      radial-gradient(ellipse at 20% 50%, rgba(${pStr}, 0.35) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(${aStr}, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(${pDark}, 0.25) 0%, transparent 60%)
    `;
  }

  if (karaokeGlow) {
    karaokeGlow.style.background = `radial-gradient(ellipse at 50% 30%, rgba(${pStr}, 0.55) 0%, rgba(${aStr}, 0.35) 45%, rgba(6, 6, 14, 0.88) 85%)`;
  }

  // Update orbs
  const orb1 = document.querySelector('.orb--1');
  const orb2 = document.querySelector('.orb--2');
  const orb3 = document.querySelector('.orb--3');
  if (orb1) orb1.style.background = `radial-gradient(circle, rgba(${pStr}, 0.4), transparent 70%)`;
  if (orb2) orb2.style.background = `radial-gradient(circle, rgba(${aStr}, 0.3), transparent 70%)`;
  if (orb3) orb3.style.background = `radial-gradient(circle, rgba(${pLight}, 0.25), transparent 70%)`;
  cachedParticleRgb = pLight;
}

function resetColors() {
  const root = document.documentElement;
  root.style.removeProperty('--primary');
  root.style.removeProperty('--primary-light');
  root.style.removeProperty('--primary-dark');
  root.style.removeProperty('--accent');
  cachedParticleRgb = '192, 132, 252';

  if (bgGradient) {
    bgGradient.style.background = '';
  }

  const orb1 = document.querySelector('.orb--1');
  const orb2 = document.querySelector('.orb--2');
  const orb3 = document.querySelector('.orb--3');
  if (orb1) orb1.style.background = '';
  if (orb2) orb2.style.background = '';
  if (orb3) orb3.style.background = '';
}

// ═══════════════════════════════════════════
// 10. Particles Canvas (Optimized 60FPS)
// ═══════════════════════════════════════════

const particles = [];
let particlesCtx = null;
let cachedParticleRgb = '192, 132, 252';

function initParticles() {
  if (!particlesCanvas) return;
  particlesCtx = particlesCanvas.getContext('2d');
  resizeParticlesCanvas();

  particles.length = 0;
  for (let i = 0; i < 25; i++) {
    particles.push({
      x: Math.random() * particlesCanvas.width,
      y: Math.random() * particlesCanvas.height,
      size: 1 + Math.random() * 2,
      speedY: -(0.15 + Math.random() * 0.25),
      opacity: 0.15 + Math.random() * 0.3
    });
  }

  requestAnimationFrame(animateParticles);
}

function resizeParticlesCanvas() {
  if (!particlesCanvas) return;
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeParticlesCanvas);

function animateParticles() {
  if (!particlesCtx || !particlesCanvas) return;

  particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    particlesCtx.beginPath();
    particlesCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    particlesCtx.fillStyle = `rgba(${cachedParticleRgb}, ${p.opacity})`;
    particlesCtx.fill();

    p.y += p.speedY;
    if (p.y < -p.size) {
      p.y = particlesCanvas.height + p.size;
      p.x = Math.random() * particlesCanvas.width;
    }
  }

  requestAnimationFrame(animateParticles);
}

// ═══════════════════════════════════════════
// 11. Keyboard Shortcuts
// ═══════════════════════════════════════════

document.addEventListener('keydown', function (e) {
  const tag = document.activeElement.tagName.toLowerCase();
  const isTyping = tag === 'input' || tag === 'textarea' || document.activeElement.isContentEditable;

  // Ctrl+K / Cmd+K always works
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (searchInput) searchInput.focus();
    return;
  }

  if (isTyping) return;

  switch (e.key) {
    case ' ':
      e.preventDefault();
      togglePlayPause();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      if (ytPlayer && ytPlayer.getCurrentTime && ytPlayer.seekTo) {
        ytPlayer.seekTo(Math.max(0, ytPlayer.getCurrentTime() - 5), true);
      }
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (ytPlayer && ytPlayer.getCurrentTime && ytPlayer.seekTo) {
        ytPlayer.seekTo(ytPlayer.getCurrentTime() + 5, true);
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      volume = Math.min(100, volume + 10);
      isMuted = false;
      if (ytPlayer && ytPlayer.setVolume) {
        ytPlayer.unMute();
        ytPlayer.setVolume(volume);
      }
      updateVolumeUI();
      break;
    case 'ArrowDown':
      e.preventDefault();
      volume = Math.max(0, volume - 10);
      isMuted = volume === 0;
      if (ytPlayer && ytPlayer.setVolume) {
        ytPlayer.setVolume(volume);
        if (isMuted) ytPlayer.mute();
      }
      updateVolumeUI();
      break;
    case 'l':
    case 'L':
      isLooping = !isLooping;
      if (loopBtn) loopBtn.classList.toggle('active', isLooping);
      if (karaokeLoopBtn) karaokeLoopBtn.classList.toggle('active', isLooping);
      toast(isLooping ? 'Loop enabled' : 'Loop disabled');
      break;
    case 'm':
    case 'M':
      isMuted = !isMuted;
      if (ytPlayer) {
        if (isMuted) {
          ytPlayer.mute();
        } else {
          ytPlayer.unMute();
          ytPlayer.setVolume(volume);
        }
      }
      updateVolumeUI();
      break;
    case 'Escape':
      if (karaokeRoom && karaokeRoom.style.display === 'flex') {
        closeKaraokeRoom();
      } else {
        showHomeScreen();
      }
      break;
  }
});

// ═══════════════════════════════════════════
// 12. Toast System
// ═══════════════════════════════════════════

function toast(message, type = 'info') {
  if (!toastRack) return;
  const div = document.createElement('div');
  div.className = `toast toast--${type}`;
  div.textContent = message;
  toastRack.appendChild(div);

  setTimeout(() => {
    div.classList.add('toast--exit');
    setTimeout(() => {
      if (div.parentNode) div.parentNode.removeChild(div);
    }, 300);
  }, 3200);
}

// ═══════════════════════════════════════════
// 13. Utilities
// ═══════════════════════════════════════════

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function formatDuration(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds)) return '0:00';
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function decodeHTML(html) {
  if (!html) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

function escapeAttr(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ═══════════════════════════════════════════
// 14. Initialization
// ═══════════════════════════════════════════

(function init() {
  // Focus search
  if (searchInput) searchInput.focus();

  // Hero search focus button
  if (heroSearchFocus) {
    heroSearchFocus.addEventListener('click', function () {
      if (searchInput) searchInput.focus();
    });
  }

  // Quick chips
  document.querySelectorAll('.chip[data-q]').forEach((chip) => {
    chip.addEventListener('click', function () {
      const q = this.dataset.q;
      syncSearchInputs(q);
      performSearch(q);
    });
  });

  // Nav Tabs Switching
  const navHomeTab = $('navHomeTab');
  const navPlayerTab = $('navPlayerTab');
  const navKaraokeTab = $('navKaraokeTab');

  if (navHomeTab) {
    navHomeTab.addEventListener('click', function () {
      showHomeScreen();
    });
  }

  if (navPlayerTab) {
    navPlayerTab.addEventListener('click', function () {
      if (!currentVideoId) {
        toast('Pick a song to open Player page');
        return;
      }
      showPlayerScreen();
    });
  }

  if (navKaraokeTab) {
    navKaraokeTab.addEventListener('click', function () {
      if (!currentVideoId) {
        toast('Pick a song to open Karaoke room');
        return;
      }
      showKaraokeScreen();
    });
  }

  // Disk Rack Cards (Left Sidebar)
  document.querySelectorAll('.disk-rack-card').forEach((card) => {
    card.addEventListener('click', function () {
      const id = this.dataset.id;
      const title = this.dataset.title;
      const channel = this.dataset.channel;
      const thumb = this.dataset.thumb;
      if (id) {
        toast(`Spinning ${title.split('—')[0].trim()}...`);
        playVideo(id, title, channel, thumb);
      }
    });
  });

  const diskRackMoreBtn = $('diskRackMoreBtn');
  if (diskRackMoreBtn) diskRackMoreBtn.addEventListener('click', togglePlaylistDrawer);

  // Trending Track Cards & Add to Queue (+) Button
  document.querySelectorAll('.track-card').forEach((card) => {
    card.addEventListener('click', function (e) {
      const addBtn = e.target.closest('.track-card__add-btn');
      const id = this.dataset.id;
      const title = this.dataset.title;
      const channel = this.dataset.channel;
      const thumb = this.dataset.thumb;

      if (addBtn) {
        e.stopPropagation();
        addToQueue({ id, title, channel, thumbnail: thumb });
        addBtn.textContent = '✓';
        addBtn.classList.add('added');
        setTimeout(() => {
          addBtn.textContent = '+';
          addBtn.classList.remove('added');
        }, 1500);
        return;
      }

      if (id) {
        toast(`Playing ${title.split('—')[0].trim()}...`);
        playVideo(id, title, channel, thumb);
      }
    });
  });

  // DJ Vinyl interactive scratch & toggle
  const djVinylEl = $('djVinyl');
  if (djVinylEl) {
    djVinylEl.addEventListener('click', function () {
      djVinylEl.style.transition = 'transform 0.15s ease';
      djVinylEl.style.transform = 'rotate(-30deg)';
      setTimeout(() => {
        djVinylEl.style.transform = '';
        djVinylEl.style.transition = '';
      }, 160);

      if (currentVideoId && ytPlayer) {
        togglePlayPause();
      } else {
        const firstCard = document.querySelector('.track-card');
        if (firstCard) firstCard.click();
      }
    });
  }

  // ── Drawer Functions ──
  function openCollection() {
    const drawer = $('collectionDrawer');
    const overlay = $('collectionOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.style.display = 'block';
  }

  function closeCollection() {
    const drawer = $('collectionDrawer');
    const overlay = $('collectionOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
  }

  function toggleCollection() {
    const drawer = $('collectionDrawer');
    if (drawer && drawer.classList.contains('open')) {
      closeCollection();
    } else {
      openCollection();
    }
  }

  function togglePlaylistDrawer() {
    if (queuePanel) {
      queuePanel.classList.toggle('open');
      if (queueOverlay) queueOverlay.style.display = queuePanel.classList.contains('open') ? 'block' : 'none';
    }
  }

  // Playlist / Queue Drawer Toggles (Top-left drawer & Hero "My Playlist")
  const navPlaylistBtn = $('navPlaylistBtn');
  const heroQueueBtn = $('heroQueueBtn');

  if (navPlaylistBtn) navPlaylistBtn.addEventListener('click', toggleCollection);
  if (heroQueueBtn) heroQueueBtn.addEventListener('click', togglePlaylistDrawer);

  // Floating Mini Screen Popup Controls
  const miniPlayerPopup = $('miniPlayerPopup');
  const miniPlayPauseBtn = $('miniPlayPauseBtn');
  const miniPrevBtn = $('miniPrevBtn');
  const miniNextBtn = $('miniNextBtn');
  const miniKaraokeBtn = $('miniKaraokeBtn');
  const miniExpandBtn = $('miniExpandBtn');
  const miniCloseBtn = $('miniCloseBtn');
  const miniPlayerScreen = $('miniPlayerScreen');
  const miniProgressContainer = $('miniProgressContainer');

  if (miniPlayPauseBtn) miniPlayPauseBtn.addEventListener('click', togglePlayPause);
  if (miniPrevBtn) miniPrevBtn.addEventListener('click', playPrev);
  if (miniNextBtn) miniNextBtn.addEventListener('click', playNext);

  if (miniKaraokeBtn) {
    miniKaraokeBtn.addEventListener('click', function () {
      showKaraokeScreen();
    });
  }

  if (miniPlayerScreen) {
    miniPlayerScreen.addEventListener('click', function () {
      showPlayerScreen();
    });
  }

  if (miniExpandBtn) {
    miniExpandBtn.addEventListener('click', function () {
      showPlayerScreen();
    });
  }

  if (miniCloseBtn) {
    miniCloseBtn.addEventListener('click', function () {
      if (miniPlayerPopup) miniPlayerPopup.style.display = 'none';
    });
  }

  if (miniProgressContainer) {
    miniProgressContainer.addEventListener('click', function (e) {
      if (!ytPlayer || !ytPlayer.getDuration) return;
      const rect = miniProgressContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const seekTime = pct * ytPlayer.getDuration();
      ytPlayer.seekTo(seekTime, true);
    });
  }

  // Mini Player Button on Song Page (Image 1)
  const playerMiniBtn = $('playerMiniBtn');
  if (playerMiniBtn) {
    playerMiniBtn.addEventListener('click', function () {
      showHomeScreen();
      toast('Player minimized to bottom-right floating screen');
    });
  }

  // Collection Drawer (Far Left Slide-out)
  const collectionDrawer = $('collectionDrawer');
  const collectionOverlay = $('collectionOverlay');
  const collectionHandle = $('collectionHandle');
  const collectionCloseBtn = $('collectionCloseBtn');
  const heroCollectionBtn = $('heroCollectionBtn');
  const collectionOpenQueueBtn = $('collectionOpenQueueBtn');

  function openCollection() {
    if (collectionDrawer) collectionDrawer.classList.add('open');
    if (collectionOverlay) collectionOverlay.style.display = 'block';
  }

  function closeCollection() {
    if (collectionDrawer) collectionDrawer.classList.remove('open');
    if (collectionOverlay) collectionOverlay.style.display = 'none';
  }

  if (collectionHandle) collectionHandle.addEventListener('click', openCollection);
  if (heroCollectionBtn) heroCollectionBtn.addEventListener('click', toggleCollection);
  if (collectionCloseBtn) collectionCloseBtn.addEventListener('click', closeCollection);
  if (collectionOverlay) collectionOverlay.addEventListener('click', closeCollection);
  if (collectionOpenQueueBtn) {
    collectionOpenQueueBtn.addEventListener('click', function () {
      closeCollection();
      togglePlaylistDrawer();
    });
  }

  // DJ Pitch Slider & RPM Selector
  const djPitchSlider = $('djPitchSlider');
  if (djPitchSlider) {
    djPitchSlider.addEventListener('input', function () {
      const rate = parseFloat(this.value);
      if (ytPlayer && ytPlayer.setPlaybackRate) {
        ytPlayer.setPlaybackRate(rate);
      }
      if (speedLabel) speedLabel.textContent = rate.toFixed(2) + '×';
    });
  }

  const djRpm33 = $('djRpm33');
  const djRpm45 = $('djRpm45');
  if (djRpm33 && djRpm45) {
    djRpm33.addEventListener('click', function () {
      djRpm33.classList.add('active');
      djRpm45.classList.remove('active');
      if (ytPlayer && ytPlayer.setPlaybackRate) ytPlayer.setPlaybackRate(1.0);
      if (djPitchSlider) djPitchSlider.value = '1.0';
      if (speedLabel) speedLabel.textContent = '1×';
      toast('Turntable: 33⅓ RPM Standard');
    });
    djRpm45.addEventListener('click', function () {
      djRpm45.classList.add('active');
      djRpm33.classList.remove('active');
      if (ytPlayer && ytPlayer.setPlaybackRate) ytPlayer.setPlaybackRate(1.25);
      if (djPitchSlider) djPitchSlider.value = '1.25';
      if (speedLabel) speedLabel.textContent = '1.25×';
      toast('Turntable: 45 RPM Fast');
    });
  }

  // Queue Quick Add (Image 2)
  const queueAddInput = $('queueAddInput');
  const queueAddBtn = $('queueAddBtn');

  async function handleQueueQuickAdd() {
    if (!queueAddInput) return;
    const val = queueAddInput.value.trim();
    if (!val) return;
    queueAddInput.value = '';

    // Check if it's a YouTube link
    const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const ytMatch = val.match(ytRegex);
    if (ytMatch) {
      const vidId = ytMatch[1];
      addToQueue({
        id: vidId,
        title: 'YouTube Track (' + vidId + ')',
        channel: 'Direct URL',
        thumbnail: `https://i.ytimg.com/vi/${vidId}/mqdefault.jpg`,
        duration: ''
      });
      return;
    }

    // Match curated hits
    const qLower = val.toLowerCase();
    for (const [key, hits] of Object.entries(CURATED_HITS)) {
      if (qLower.includes(key) || key.includes(qLower)) {
        addToQueue(hits[0]);
        return;
      }
    }

    // Fallback search
    try {
      const resp = await fetch(`https://api.piped.private.coffee/search?q=${encodeURIComponent(val)}&filter=videos`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.items && data.items.length > 0) {
          const it = data.items[0];
          const vidId = it.url.includes('v=') ? it.url.split('v=')[1].split('&')[0] : it.url.replace('/watch?v=', '');
          addToQueue({
            id: vidId,
            title: it.title || val,
            channel: it.uploaderName || 'Artist',
            thumbnail: `https://i.ytimg.com/vi/${vidId}/mqdefault.jpg`,
            duration: formatDuration(it.duration)
          });
          return;
        }
      }
    } catch (e) {}

    // Final fallback: Add as requested
    addToQueue({
      id: 'BddP6PYo2gs',
      title: val,
      channel: 'Selected Track',
      thumbnail: 'https://i.ytimg.com/vi/BddP6PYo2gs/mqdefault.jpg',
      duration: ''
    });
  }

  if (queueAddBtn) queueAddBtn.addEventListener('click', handleQueueQuickAdd);
  if (queueAddInput) {
    queueAddInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleQueueQuickAdd();
      }
    });
  }

  // Queue Panel Toolbar: Shuffle All & Loop Toggle (Image 2)
  const queuePanelShuffleBtn = $('queuePanelShuffleBtn');
  if (queuePanelShuffleBtn) queuePanelShuffleBtn.addEventListener('click', shuffleQueue);

  const queueLoopToggleBtn = $('queueLoopToggleBtn');
  const queueLoopStatus = $('queueLoopStatus');
  if (queueLoopToggleBtn) {
    queueLoopToggleBtn.addEventListener('click', function () {
      isLooping = !isLooping;
      if (loopBtn) loopBtn.classList.toggle('active', isLooping);
      if (karaokeLoopBtn) karaokeLoopBtn.classList.toggle('active', isLooping);
      if (queueLoopStatus) queueLoopStatus.textContent = isLooping ? 'On' : 'Off';
      queueLoopToggleBtn.classList.toggle('active', isLooping);
      toast(isLooping ? 'Queue loop enabled' : 'Queue loop disabled');
    });
  }

  // ═══════════════════════════════════════════
  // Up Next 5-Second Auto-Play Countdown Listeners
  // ═══════════════════════════════════════════
  const upNextPlayNowBtn = $('upNextPlayNowBtn');
  const upNextCancelBtn = $('upNextCancelBtn');
  const upNextOverlayEl = $('upNextOverlay');

  if (upNextPlayNowBtn) {
    upNextPlayNowBtn.addEventListener('click', function () {
      const nextSong = upNextTargetSong;
      dismissUpNextPopup();
      if (nextSong) {
        playVideo(nextSong.id, nextSong.title, nextSong.channel, nextSong.thumbnail);
      }
    });
  }

  if (upNextCancelBtn) {
    upNextCancelBtn.addEventListener('click', function () {
      dismissUpNextPopup();
      toast('Auto-play cancelled');
    });
  }

  if (upNextOverlayEl) {
    upNextOverlayEl.addEventListener('click', function () {
      dismissUpNextPopup();
    });
  }

  // ═══════════════════════════════════════════
  // Queue & Playback Settings (Image 8: "All setting")
  // ═══════════════════════════════════════════
  const queueSettingsToggle = $('queueSettingsToggle');
  const queueSettingsBody = $('queueSettingsBody');
  const queueSettingsChevron = $('queueSettingsChevron');

  if (queueSettingsToggle && queueSettingsBody) {
    queueSettingsToggle.addEventListener('click', function () {
      const isClosed = queueSettingsBody.style.display === 'none';
      queueSettingsBody.style.display = isClosed ? 'flex' : 'none';
      if (queueSettingsChevron) {
        queueSettingsChevron.style.transform = isClosed ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  }

  const queueAutoPlayToggle = $('queueAutoPlayToggle');
  if (queueAutoPlayToggle) {
    queueAutoPlayToggle.addEventListener('click', function () {
      isAutoPlayNext = !isAutoPlayNext;
      queueAutoPlayToggle.classList.toggle('active', isAutoPlayNext);
      queueAutoPlayToggle.textContent = isAutoPlayNext ? 'ENABLED' : 'DISABLED';
      toast(isAutoPlayNext ? 'Auto-play Next: ON (5s timer)' : 'Auto-play Next: OFF');
    });
  }

  document.querySelectorAll('.q-speed-pill').forEach(pill => {
    pill.addEventListener('click', function () {
      const rate = parseFloat(this.dataset.speed);
      if (ytPlayer && typeof ytPlayer.setPlaybackRate === 'function') {
        ytPlayer.setPlaybackRate(rate);
      }
      if (speedLabel) speedLabel.textContent = rate + '×';
      if (karaokeSpeedLabel) karaokeSpeedLabel.textContent = rate + '×';
      document.querySelectorAll('.q-speed-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      toast(`Speed: ${rate}×`);
    });
  });

  document.querySelectorAll('.q-vibe-pill').forEach(pill => {
    pill.addEventListener('click', function () {
      const vibe = this.dataset.vibe;
      document.querySelectorAll('.q-vibe-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      if (vibe === 'neon') {
        document.documentElement.style.setProperty('--primary', '#ec4899');
        document.documentElement.style.setProperty('--accent', '#06b6d4');
      } else if (vibe === 'chill') {
        document.documentElement.style.setProperty('--primary', '#3b82f6');
        document.documentElement.style.setProperty('--accent', '#10b981');
      } else {
        if (currentThumbnail) extractColors(currentThumbnail);
      }
      toast(`Ambient Vibe: ${vibe.toUpperCase()}`);
    });
  });

  // Initialize Turntable to Empty state on launch
  updateTurntableUI();
  
  // Nav Brand Logo click -> Home
  const navBrand = document.querySelector('.nav__brand');
  if (navBrand) {
    navBrand.style.cursor = 'pointer';
    navBrand.addEventListener('click', function () {
      showHomeScreen();
      closeSuggestions();
    });
  }

  // Init particles
  initParticles();

  // Init volume UI
  updateVolumeUI();

  // Init queue
  renderQueue();
})();
