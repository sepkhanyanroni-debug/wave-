/* WAVE — каталог метаданных. Полные аудиофайлы не хранятся без лицензии. */
window.WAVE_DATA = {
  artists: [
    { id: "miyagi", name: "Miyagi & Andy Panda", alsoKnownAs: "MiyaGi & Эндшпиль",
      bio: "Владикавказский дуэт Азамата Кудзаева (Miyagi) и Сослана Бурнацева (Andy Panda). Лейбл Hajime Records.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80", followers: "2.6M" },
    { id: "xcho", name: "XCHO", alsoKnownAs: "Xcho",
      bio: "Хачик Дунамалян. Альбомы CROSS, Immigrant, LTM. Хиты Memories, Вороны, Ты и я.",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba35e271?auto=format&fit=crop&w=800&q=80",
      cover: "https://images.unsplash.com/photo-1459749411177-0415442865ab?auto=format&fit=crop&w=1200&q=80", followers: "1.2M" },
    { id: "feduk", name: "FEDUK", alsoKnownAs: "Федук",
      bio: "Фёдор Инсаров. Альбомы Фри, More Love, ЙАЙ. Хиты Моряк, Хлопья летят наверх, Розовое вино.",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80", followers: "1.6M" }
  ],
  albums: [
    { id: "hajime1", artistId: "miyagi", title: "Hajime, Pt. 1", year: 2016, type: "album", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80" },
    { id: "hajime2", artistId: "miyagi", title: "Hajime, Pt. 2", year: 2016, type: "album", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80&sat=-40" },
    { id: "umshakalaka", artistId: "miyagi", title: "Умшакалака", year: 2017, type: "album", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80", note: "с Amigo" },
    { id: "hajime3", artistId: "miyagi", title: "Hajime, Pt. 3", year: 2018, type: "album", cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80" },
    { id: "yamakasi", artistId: "miyagi", title: "YAMAKASI", year: 2020, type: "album", cover: "https://upload.wikimedia.org/wikipedia/en/8/85/Yamakasi_%28album%29.jpg" },
    { id: "hattori", artistId: "miyagi", title: "Hattori", year: 2022, type: "ep", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" },
    { id: "narrative", artistId: "miyagi", title: "Narrative", year: 2024, type: "album", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba35e271?auto=format&fit=crop&w=600&q=80" },
    { id: "miyagi-singles", artistId: "miyagi", title: "Синглы и коллабы", year: 2024, type: "compilation", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80" },
    { id: "cross", artistId: "xcho", title: "CROSS", year: 2020, type: "album", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba35e271?auto=format&fit=crop&w=600&q=80" },
    { id: "immigrant", artistId: "xcho", title: "Immigrant", year: 2022, type: "album", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" },
    { id: "xcho-singles", artistId: "xcho", title: "Синглы XCHO", year: 2024, type: "compilation", cover: "https://images.unsplash.com/photo-1459749411177-0415442865ab?auto=format&fit=crop&w=600&q=80" },
    { id: "fri", artistId: "feduk", title: "Фри", year: 2016, type: "album", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" },
    { id: "morelove", artistId: "feduk", title: "More Love", year: 2018, type: "album", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" },
    { id: "yay", artistId: "feduk", title: "ЙАЙ", year: 2020, type: "album", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba35e271?auto=format&fit=crop&w=600&q=80" },
    { id: "feduk-singles", artistId: "feduk", title: "Синглы FEDUK", year: 2024, type: "compilation", cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80" },
  ],
  tracks: []
};

(function () {
  const T = window.WAVE_DATA.tracks;
  const add = (o) => T.push(Object.assign({ id: "t" + T.length, playable: false, audio: null }, o));

  [["Atlant","3:07"],["Utopia","3:29"],["Мало нам","3:48"],["Психопатия","3:28"],["Tantra","4:16"],["Medicine","3:38"],["Minor","2:56"],["Там ревели горы","2:57"],["Yamakasi","4:24"]]
    .forEach(([title,duration],i) => add({ title, duration, albumId: "yamakasi", artistId: "miyagi", trackNo: i+1 }));

  [["Умшакалака","3:10"],["Райзап","4:28"],["Be My Sky","4:38"],["Отцу отсыпь","3:40"],["I Got My Way","4:07"],["Believe Me Tonight","4:32"],["Заплаканная","4:06"],["God Damn","3:16"]]
    .forEach(([title,duration],i) => add({ title, duration, albumId: "umshakalaka", artistId: "miyagi", trackNo: i+1, feat: "Amigo" }));

  [["I Got Love","3:35","hajime2"],["Бошка","3:20","hajime2"],["Двигайся","3:10","hajime2"],["Hajime","3:30","hajime1"],["Музыка","3:15","hajime1"],
   ["Kosandra","3:41","miyagi-singles"],["Патрон","3:45","miyagi-singles"],["Freeman","3:50","miyagi-singles"],["Brooklyn","3:13","miyagi-singles"],
   ["Marmalade","3:40","miyagi-singles"],["Не жалея","3:20","miyagi-singles"],["All the Time","3:10","miyagi-singles"],["Буревестник","4:06","miyagi-singles"],
   ["Оттепель","4:01","miyagi-singles"],["Silhouette","3:49","hattori"],["Самурай","2:44","miyagi-singles"],["Get Up","3:00","miyagi-singles"],["При своём","3:12","miyagi-singles"]]
    .forEach(([title,duration,albumId],i) => add({ title, duration, albumId, artistId: "miyagi", trackNo: i+1 }));

  [["Memories","3:20","cross"],["Дай мне огня","3:15","cross"],["Лондон","3:15","xcho-singles"],["I Can Fly","3:18","xcho-singles"],
   ["Волна","3:05","xcho-singles"],["Only You","3:20","xcho-singles"],["Вороны","3:10","xcho-singles"],["Эскизы","3:12","immigrant"],
   ["Ты и я","3:25","immigrant"],["Вера","3:08","immigrant"],["Баллада","3:16","xcho-singles"],["Мир на двоих","3:10","xcho-singles"],
   ["6.3","3:05","xcho-singles"],["Diamond","3:08","xcho-singles"],["Январь","3:22","xcho-singles"],["Уйду","3:08","xcho-singles"]]
    .forEach(([title,duration,albumId],i) => add({ title, duration, albumId, artistId: "xcho", trackNo: i+1 }));

  [["Моряк","2:48","feduk-singles"],["Хлопья летят наверх","4:22","morelove"],["Закрывай глаза","3:20","morelove"],["27","2:27","feduk-singles"],
   ["Будапешт","3:09","feduk-singles"],["Tour de France","3:15","fri"],["Околофутбола","3:05","feduk-singles"],["Краски","3:10","feduk-singles"],
   ["Розовое вино","4:06","feduk-singles"],["Холостяк","3:01","feduk-singles"],["More Love","3:20","morelove"],["Бэнгер","3:00","feduk-singles"],
   ["Водолей","3:08","feduk-singles"],["Модели","3:12","morelove"],["Аста ла виста","3:10","feduk-singles"],["Заново","3:14","feduk-singles"]]
    .forEach(([title,duration,albumId],i) => add({ title, duration, albumId, artistId: "feduk", trackNo: i+1 }));

  // Не добавляем посторонние демо-записи: кнопки прослушивания ведут к поиску трека на музыкальных платформах.
})();
