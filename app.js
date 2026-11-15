
(function () {
  const D = window.WAVE_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const state = {
    view: "home",
    params: {},
    queue: [],
    queueIndex: -1,
    shuffle: false,
    repeat: "off", // off | one | all
    liked: new Set(JSON.parse(localStorage.getItem("wave_liked") || "[]")),
    playlists: JSON.parse(localStorage.getItem("wave_playlists") || "{}"),
  };

  const audio = $("#audio");
  const toastEl = $("#toast");

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  function saveLiked() {
    localStorage.setItem("wave_liked", JSON.stringify([...state.liked]));
  }
  function savePlaylists() {
    localStorage.setItem("wave_playlists", JSON.stringify(state.playlists));
  }

  function artistById(id) { return D.artists.find((a) => a.id === id); }
  function albumById(id) { return D.albums.find((a) => a.id === id); }
  function trackById(id) { return D.tracks.find((t) => t.id === id); }
  function tracksOfAlbum(id) { return D.tracks.filter((t) => t.albumId === id); }
  function tracksOfArtist(id) { return D.tracks.filter((t) => t.artistId === id); }

  function coverForTrack(t) {
    const al = albumById(t.albumId);
    return (al && al.cover) || artistById(t.artistId).image;
  }

  /* ---------- PLAYER ---------- */
  function setQueue(tracks, startId) {
    state.queue = tracks.map((t) => t.id);
    state.queueIndex = Math.max(0, state.queue.indexOf(startId));
    playCurrent();
  }


  function musicSearchUrl(track, platform = "youtube") {
    const artist = artistById(track.artistId);
    const query = encodeURIComponent((artist ? artist.name + " " : "") + track.title + (track.feat ? " " + track.feat : "") + " official");
    if (platform === "spotify") return "https://open.spotify.com/search/" + query;
    if (platform === "apple") return "https://music.apple.com/search?term=" + query;
    if (platform === "deezer") return "https://www.deezer.com/search/" + query;
    return "https://music.youtube.com/search?q=" + query;
  }

  function openTrackSource(track) {
    if (!track) return;
    const url = musicSearchUrl(track, "youtube");
    window.open(url, "_blank", "noopener,noreferrer");
    toast("Открываю поиск этой композиции в YouTube Music");
  }

  function playCurrent() {
    const id = state.queue[state.queueIndex];
    const t = trackById(id);
    if (!t) return;

    $("#pTitle").textContent = t.title + (t.isDemo ? " (demo)" : "");
    $("#pArtist").textContent = artistById(t.artistId).name + (t.feat ? " feat. " + t.feat : "");
    $("#pCover").src = coverForTrack(t);

    if (!t.playable || !t.audio) {
      audio.pause();
      audio.removeAttribute("src");
      $("#btnPlay").textContent = "▶";
      openTrackSource(t);
      render();
      return;
    }
    if (audio.src !== t.audio) {
      audio.src = t.audio;
    }
    audio.play().then(() => {
      $("#btnPlay").textContent = "⏸";
    }).catch(() => toast("Не удалось воспроизвести (сеть / автоплей)"));
    render();
  }

  function togglePlay() {
    const id = state.queue[state.queueIndex];
    const t = id && trackById(id);
    if (!t || !t.playable) {
      if (t) openTrackSource(t);
      else toast("Сначала выберите композицию");
      return;
    }
    if (audio.paused) {
      audio.play();
      $("#btnPlay").textContent = "⏸";
    } else {
      audio.pause();
      $("#btnPlay").textContent = "▶";
    }
  }

  function nextTrack() {
    if (!state.queue.length) return;
    if (state.repeat === "one") {
      audio.currentTime = 0;
      audio.play();
      return;
    }
    if (state.shuffle) {
      state.queueIndex = Math.floor(Math.random() * state.queue.length);
    } else {
      state.queueIndex++;
      if (state.queueIndex >= state.queue.length) {
        if (state.repeat === "all") state.queueIndex = 0;
        else {
          state.queueIndex = state.queue.length - 1;
          audio.pause();
          $("#btnPlay").textContent = "▶";
          return;
        }
      }
    }
    playCurrent();
  }

  function prevTrack() {
    if (!state.queue.length) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    state.queueIndex = (state.queueIndex - 1 + state.queue.length) % state.queue.length;
    playCurrent();
  }

  function fmt(sec) {
    if (!isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    $("#seek").value = (audio.currentTime / audio.duration) * 100;
    $("#tCur").textContent = fmt(audio.currentTime);
  });
  audio.addEventListener("loadedmetadata", () => {
    $("#tTot").textContent = fmt(audio.duration);
  });
  audio.addEventListener("ended", nextTrack);
  audio.addEventListener("play", () => { $("#btnPlay").textContent = "⏸"; });
  audio.addEventListener("pause", () => { $("#btnPlay").textContent = "▶"; });


  const openSpotify = $("#openSpotify");
  if (openSpotify) openSpotify.onclick = () => {
    const t = trackById(state.queue[state.queueIndex]);
    if (t) window.open(musicSearchUrl(t, "spotify"), "_blank", "noopener,noreferrer");
  };
  const openApple = $("#openApple");
  if (openApple) openApple.onclick = () => {
    const t = trackById(state.queue[state.queueIndex]);
    if (t) window.open(musicSearchUrl(t, "apple"), "_blank", "noopener,noreferrer");
  };
  audio.addEventListener("error", () => toast("Не удалось загрузить аудиофайл"));

  $("#btnPlay").onclick = togglePlay;
  $("#btnNext").onclick = nextTrack;
  $("#btnPrev").onclick = prevTrack;
  $("#btnShuffle").onclick = () => {
    state.shuffle = !state.shuffle;
    $("#btnShuffle").classList.toggle("on", state.shuffle);
    toast(state.shuffle ? "Shuffle on" : "Shuffle off");
  };
  $("#btnRepeat").onclick = () => {
    state.repeat = state.repeat === "off" ? "all" : state.repeat === "all" ? "one" : "off";
    $("#btnRepeat").classList.toggle("on", state.repeat !== "off");
    $("#btnRepeat").textContent = state.repeat === "one" ? "🔂" : "🔁";
    toast("Repeat: " + state.repeat);
  };
  $("#seek").oninput = () => {
    if (audio.duration) audio.currentTime = ($("#seek").value / 100) * audio.duration;
  };
  $("#vol").oninput = () => { audio.volume = $("#vol").value; };
  audio.volume = $("#vol").value;

  /* ---------- ROUTER ---------- */
  function go(view, params = {}) {
    state.view = view;
    state.params = params;
    location.hash = view + (params.id ? "/" + params.id : "") + (params.q ? "?q=" + encodeURIComponent(params.q) : "");
    render();
    window.scrollTo(0, 0);
  }

  function parseHash() {
    const h = location.hash.replace(/^#/, "") || "home";
    const [path, qs] = h.split("?");
    const [view, id] = path.split("/");
    const q = qs && qs.startsWith("q=") ? decodeURIComponent(qs.slice(2)) : "";
    state.view = view || "home";
    state.params = { id, q };
  }

  window.addEventListener("hashchange", () => { parseHash(); render(); });

  /* ---------- RENDER HELPERS ---------- */
  function trackRow(t, idx) {
    const art = artistById(t.artistId);
    const al = albumById(t.albumId);
    const liked = state.liked.has(t.id);
    const playing = state.queue[state.queueIndex] === t.id;
    const disabled = false;
    return `<div class="tr ${playing ? "playing" : ""}" data-tid="${t.id}">
      <span class="num">${idx + 1}</span>
      <img class="cov" src="${coverForTrack(t)}" alt="">
      <div><div class="tt">${esc(t.title)}${t.isDemo ? ' <span class="pill">DEMO</span>' : ""}${t.feat ? " · " + esc(t.feat) : ""}</div>
      <div class="ta">${esc(art.name)}</div></div>
      <div class="al">${esc(al ? al.title : "")}</div>
      <div class="dur">${t.duration}</div>
      <button class="icon-btn ${liked ? "on" : ""}" data-like="${t.id}" title="Избранное">${liked ? "♥" : "♡"}</button>
      <button class="play-sm" data-play="${t.id}" ${disabled ? "disabled title=\"Аудио недоступно\"" : "title=\"Слушать\""}>▶</button>
    </div>`;
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function bindTrackTable(root) {
    root.querySelectorAll("[data-play]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-play");
        const t = trackById(id);
        if (!t.playable || !t.audio) {
          openTrackSource(t);
          return;
        }
        const list = state.view === "album" ? tracksOfAlbum(state.params.id)
          : state.view === "artist" ? tracksOfArtist(state.params.id)
          : state.view === "search" ? filterTracks($("#searchInput").value)
          : state.view === "liked" ? D.tracks.filter((x) => state.liked.has(x.id))
          : D.tracks.filter((x) => x.playable);
        setQueue(list.length ? list : [t], id);
      };
    });
    root.querySelectorAll("[data-like]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-like");
        if (state.liked.has(id)) state.liked.delete(id);
        else state.liked.add(id);
        saveLiked();
        render();
      };
    });
    root.querySelectorAll(".tr[data-tid]").forEach((row) => {
      row.onclick = () => {
        const id = row.getAttribute("data-tid");
        const btn = row.querySelector("[data-play]");
        if (btn) btn.click();
      };
    });
  }

  function norm(s) {
    return String(s || "").toLocaleLowerCase("ru").replace(/ё/g, "е").normalize("NFKC").trim();
  }

  function filterTracks(q) {
    q = norm(q);
    if (!q) return [];
    return D.tracks.filter((t) => {
      const art = artistById(t.artistId);
      const al = albumById(t.albumId);
      return (
        norm(t.title).includes(q) ||
        norm(art.name).includes(q) ||
        norm(art.alsoKnownAs).includes(q) ||
        (al && norm(al.title).includes(q))
      );
    });
  }

  function filterAlbums(q) {
    q = norm(q);
    if (!q) return [];
    return D.albums.filter((a) => norm(a.title).includes(q) || norm(artistById(a.artistId).name).includes(q));
  }

  function filterArtists(q) {
    q = norm(q);
    if (!q) return [];
    return D.artists.filter((a) => norm(a.name).includes(q) || norm(a.alsoKnownAs).includes(q));
  }

  /* ---------- VIEWS ---------- */
  function viewHome() {
    const popular = D.tracks.filter((t) => !t.isDemo).slice(0, 12);
    const demos = D.tracks.filter((t) => t.playable);
    return `
      <div class="hero-home">
        <div class="hero-card">
          <img src="${D.artists[0].cover}" alt="">
          <div class="inner">
            <span class="badge">WAVE Pro</span>
            <h1>Miyagi, XCHO, FEDUK — в одной библиотеке</h1>
            <p style="color:var(--muted);max-width:420px;margin-bottom:16px">Каталог артистов, альбомов и композиций. Прослушивание открывается через музыкальные платформы, если запись там доступна.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-primary" data-go="artist" data-id="miyagi">Открыть Miyagi</button>
              <button class="btn btn-ghost" data-go="album" data-id="umshakalaka">Умшакалака</button>

            </div>
          </div>
        </div>
        <div class="hero-card" style="background:linear-gradient(160deg,#1e1b4b,#09090b)">
          <div class="inner">
            <span class="badge">Каталог</span>
            <h1 style="font-size:28px">${D.tracks.filter(t=>!t.isDemo).length}+ треков</h1>
            <p style="color:var(--muted)">${D.albums.length - 1} релизов · 3 артиста</p>
            <button class="btn btn-primary" style="margin-top:16px" data-go="search">Поиск по каталогу</button>
          </div>
        </div>
      </div>
      <div class="section-h"><h2>Артисты</h2></div>
      <div class="grid-artists">${D.artists.map((a) => `
        <div class="artist-card" data-go="artist" data-id="${a.id}">
          <img src="${a.image}" alt="${esc(a.name)}">
          <div class="body"><h3>${esc(a.name)}</h3><p>${esc(a.followers)} · ${tracksOfArtist(a.id).length} треков</p></div>
        </div>`).join("")}</div>
      <div class="section-h"><h2>Альбомы</h2></div>
      <div class="grid-albums">${D.albums.map((a) => `
        <div class="album-card" data-go="album" data-id="${a.id}">
          <img src="${a.cover}" alt="">
          <h3>${esc(a.title)}</h3>
          <p>${a.year} · ${esc(artistById(a.artistId).name)}</p>
        </div>`).join("")}</div>
      <div class="section-h"><h2>Популярное</h2></div>
      <div class="track-table">
        <div class="tr tr-head"><span class="num">#</span><span></span><span>Название</span><span class="al">Альбом</span><span class="dur">Время</span><span></span><span></span></div>
        ${popular.map((t, i) => trackRow(t, i)).join("")}
      </div>

    `;
  }

  function viewArtist() {
    const a = artistById(state.params.id);
    if (!a) return `<div class="empty"><h3>Артист не найден</h3></div>`;
    const albums = D.albums.filter((x) => x.artistId === a.id);
    const tracks = tracksOfArtist(a.id).filter((t) => !t.isDemo);
    return `
      <div class="banner">
        <img class="cover" src="${a.image}" alt="">
        <div>
          <span class="badge">Исполнитель</span>
          <h1>${esc(a.name)}</h1>
          <div class="meta">${esc(a.alsoKnownAs || "")} · ${a.followers} · ${tracks.length} треков</div>
          <p style="margin-top:10px;color:var(--muted);max-width:520px">${esc(a.bio)}</p>
          <div style="margin-top:14px;display:flex;gap:8px">
            <button class="btn btn-primary" data-play-artist="${a.id}">▶ Популярное</button>
          </div>
        </div>
      </div>
      <div class="section-h"><h2>Дискография</h2></div>
      <div class="grid-albums">${albums.map((al) => `
        <div class="album-card" data-go="album" data-id="${al.id}">
          <img src="${al.cover}" alt=""><h3>${esc(al.title)}</h3>
          <p>${al.year}${al.note ? " · " + esc(al.note) : ""}</p>
        </div>`).join("")}</div>
      <div class="section-h"><h2>Треки</h2></div>
      <div class="track-table">
        <div class="tr tr-head"><span class="num">#</span><span></span><span>Название</span><span class="al">Альбом</span><span class="dur">Время</span><span></span><span></span></div>
        ${tracks.map((t, i) => trackRow(t, i)).join("")}
      </div>`;
  }

  function viewAlbum() {
    const al = albumById(state.params.id);
    if (!al) return `<div class="empty"><h3>Альбом не найден</h3></div>`;
    const art = artistById(al.artistId);
    const tracks = tracksOfAlbum(al.id);
    const playableCount = tracks.filter((t) => t.playable).length;
    return `
      <div class="banner">
        <img class="cover" src="${al.cover}" alt="">
        <div>
          <span class="badge">${al.type === "ep" ? "EP" : al.type === "compilation" ? "Сборник" : "Альбом"}</span>
          <h1>${esc(al.title)}</h1>
          <div class="meta"><a href="#artist/${art.id}" style="text-decoration:underline">${esc(art.name)}</a> · ${al.year} · ${tracks.length} треков${al.note ? " · " + esc(al.note) : ""}</div>
          <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-primary" data-play-album="${al.id}">▶ Слушать альбом</button>
            <button class="btn btn-ghost" data-go="artist" data-id="${art.id}">К артисту</button>
          </div>
        </div>
      </div>
      ${al.id === "umshakalaka" ? `<p class="notice"><strong>Умшакалака (2017)</strong> — альбом Miyagi & Эндшпиль feat. Amigo. Треклист по официальной выгрузке альбома: Умшакалака, Райзап, Be My Sky, Отцу отсыпь, I Got My Way, Believe Me Tonight, Заплаканная, God Damn. Файлы © не хостятся.</p>` : ""}
      ${al.id === "yamakasi" ? `<p class="notice"><strong>YAMAKASI (2020)</strong> — треклист по Wikipedia: Atlant, Utopia, Мало нам, Психопатия, Tantra, Medicine, Minor, Там ревели горы, Yamakasi.</p>` : ""}
      <p class="notice">Кнопка воспроизведения открывает поиск этой композиции в YouTube Music. Если трек доступен на площадке, его можно слушать там. Сайт не выдаёт сторонние аудиофайлы за оригинальные записи.</p>
      <div class="track-table">
        <div class="tr tr-head"><span class="num">#</span><span></span><span>Название</span><span class="al">Альбом</span><span class="dur">Время</span><span></span><span></span></div>
        ${tracks.map((t, i) => trackRow(t, i)).join("")}
      </div>`;
  }

  function viewSearch() {
    const q = state.params.q || $("#searchInput").value || "";
    $("#searchInput").value = q;
    const tracks = filterTracks(q);
    const albums = filterAlbums(q);
    const artists = filterArtists(q);
    if (!q.trim()) {
      return `<div class="empty"><h3>Поиск</h3><p>Введите название трека, альбома или артиста</p></div>`;
    }
    if (!tracks.length && !albums.length && !artists.length) {
      return `<div class="empty"><h3>Ничего не найдено</h3><p>Попробуйте изменить поисковый запрос</p></div>`;
    }
    return `
      <h2 style="margin-bottom:16px">Результаты: «${esc(q)}»</h2>
      ${artists.length ? `<div class="section-h"><h2>Артисты</h2></div><div class="grid-artists">${artists.map((a) => `
        <div class="artist-card" data-go="artist" data-id="${a.id}"><img src="${a.image}"><div class="body"><h3>${esc(a.name)}</h3></div></div>`).join("")}</div>` : ""}
      ${albums.length ? `<div class="section-h"><h2>Альбомы</h2></div><div class="grid-albums">${albums.map((a) => `
        <div class="album-card" data-go="album" data-id="${a.id}"><img src="${a.cover}"><h3>${esc(a.title)}</h3><p>${a.year}</p></div>`).join("")}</div>` : ""}
      ${tracks.length ? `<div class="section-h"><h2>Треки (${tracks.length})</h2></div><div class="track-table">${tracks.map((t, i) => trackRow(t, i)).join("")}</div>` : ""}
    `;
  }

  function viewLiked() {
    const tracks = D.tracks.filter((t) => state.liked.has(t.id));
    if (!tracks.length) return `<div class="empty"><h3>Избранное пусто</h3><p>Нажмите ♡ у трека</p></div>`;
    return `<div class="section-h"><h2>Избранное</h2></div><div class="track-table">${tracks.map((t, i) => trackRow(t, i)).join("")}</div>`;
  }

  function render() {
    $$(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === state.view));
    let html = "";
    if (state.view === "home") html = viewHome();
    else if (state.view === "artist") html = viewArtist();
    else if (state.view === "album") html = viewAlbum();
    else if (state.view === "search") html = viewSearch();
    else if (state.view === "liked") html = viewLiked();
    else html = viewHome();
    $("#content").innerHTML = html;

    $$("[data-go]").forEach((el) => {
      el.onclick = () => go(el.getAttribute("data-go"), { id: el.getAttribute("data-id") });
    });
    $$("[data-play-album]").forEach((btn) => {
      btn.onclick = () => {
        const list = tracksOfAlbum(btn.getAttribute("data-play-album"));
        if (!list.length) return toast("В альбоме пока нет добавленных композиций");
        setQueue(list, list[0].id);
      };
    });
    $$("[data-play-artist]").forEach((btn) => {
      btn.onclick = () => {
        const list = tracksOfArtist(btn.getAttribute("data-play-artist"));
        if (list.length) setQueue(list, list[0].id);
        else toast("В каталоге этого исполнителя пока нет композиций");
      };
    });
    bindTrackTable($("#content"));
  }

  /* search */
  const searchInput = $("#searchInput");
  const searchClear = $("#searchClear");
  let searchTimer;
  searchInput.addEventListener("input", () => {
    searchClear.style.display = searchInput.value ? "block" : "none";
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      go("search", { q: searchInput.value });
    }, 200);
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") go("search", { q: searchInput.value });
  });
  searchClear.onclick = () => {
    searchInput.value = "";
    searchClear.style.display = "none";
    go("home");
  };

  $$(".nav-btn").forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.view === "search") {
        go("search", { q: searchInput.value });
        searchInput.focus();
      } else go(btn.dataset.view, btn.dataset.id ? { id: btn.dataset.id } : {});
      $("#side").classList.remove("open");
    };
  });
  $("#menuBtn").onclick = () => $("#side").classList.toggle("open");

  parseHash();
  render();
})();
