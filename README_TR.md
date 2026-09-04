# QuestApp Frontend

**QuestApp** için React tek sayfa uygulaması (SPA). Kullanıcılar kayıt olur, giriş yapar, gönderi oluşturur, beğenir ve yorum yazar.

| Belge | Dil |
|-------|-----|
| [README.md](./README.md) | English |
| [README_TR.md](./README_TR.md) | Türkçe |
| [README_DE.md](./README_DE.md) | Deutsch |
| [architecture-uml.md](./architecture-uml.md) | Mimari & UML |

## Özellikler

- Kullanıcı kaydı ve girişi (`localStorage` içinde JWT)
- Tüm gönderilerin listelendiği ana akış
- Gönderi oluşturma (oturum gerekli)
- Beğenme / beğeniyi kaldırma
- Genişletilebilir yorumlar ve yorum ekleme formu
- Gönderi, yorum ve beğeni sayılarıyla kullanıcı profili

## Teknoloji yığını

| Teknoloji | Sürüm / not |
|-----------|-------------|
| React | 19 |
| Create React App | `react-scripts` 5 |
| React Router | 7 |
| Material UI | 7 (`@mui/material`, `@mui/icons-material`) |
| HTTP | Native `fetch` (göreli URL’ler) |
| Backend proxy | `http://localhost:8080` |

## Gereksinimler

- Node.js 18+ ve npm
- **8080** portunda çalışan QuestApp backend (Spring Boot API)

## Başlangıç

```bash
npm install
npm start
```

[http://localhost:3000](http://localhost:3000) adresini açın. API istekleri `package.json` içindeki `proxy` alanı üzerinden `http://localhost:8080` adresine yönlendirilir.

### Diğer komutlar

| Komut | Açıklama |
|-------|----------|
| `npm start` | Geliştirme sunucusu |
| `npm test` | Jest / Testing Library |
| `npm run build` | Üretim derlemesi → `build/` |
| `npm run eject` | CRA yapılandırmasını dışa aktar (geri alınamaz) |

## Proje yapısı

```
src/
├── App.js                 # Router, /auth için oturum kontrolü
├── index.js               # Giriş noktası
└── components/
    ├── Auth/Auth.js       # Kayıt & giriş
    ├── Home/Home.js       # Akış + PostForm
    ├── Navbar/Navbar.js   # Navigasyon & çıkış
    ├── Post/Post.js       # Gönderi kartı, beğeniler, yorumlar
    ├── Post/PostForm.js   # Gönderi oluşturma
    ├── Comment/Comment.js
    ├── Comment/CommentForm.js
    └── User/User.js       # Profil & aktivite sayıları
```

## Rotalar

| Yol | Bileşen | Açıklama |
|-----|---------|----------|
| `/` | `Home` | Gönderi akışı |
| `/users/:userId` | `User` | Kullanıcı profili |
| `/posts` | `Post` | Bağımsız gönderi rotası (akıştan props bekler) |
| `/auth` | `Auth` | Giriş / kayıt (oturum varsa `/` yönlendirmesi) |

## Kimlik doğrulama

1. `{ userName, password }` ile `POST /auth/register` veya `POST /auth/login`
2. Yanıt: `{ message: "<token>", userId: <id> }`
3. `localStorage` anahtarları:
   - `tokenKey` — JWT / token
   - `currentUser` — kullanıcı id
   - `userName` — kullanıcı adı
4. Yetkili istekler: `Authorization: <tokenKey>` başlığı (`Bearer` öneki yok)
5. Çıkış: anahtarlar silinir, sayfa yenilenir

Misafirler akışı görebilir. Gönderi oluşturma, beğenme ve yorum için giriş gerekir.

## Kullanılan API uç noktaları

Geliştirmede taban URL: göreli yollar → CRA proxy → `http://localhost:8080`.

| Metot | Uç nokta | Kullanan |
|-------|----------|----------|
| `POST` | `/auth/register` | Auth |
| `POST` | `/auth/login` | Auth |
| `GET` | `/posts` | Home |
| `POST` | `/posts` | PostForm |
| `GET` | `/posts?userId=` | User |
| `GET` | `/comments?postId=` | Post |
| `GET` | `/comments?userId=` | User |
| `POST` | `/comments` | CommentForm |
| `POST` | `/likes` | Post |
| `DELETE` | `/likes/{likeId}` | Post |
| `GET` | `/likes?userId=` | User |
| `GET` | `/users/{userId}` | User |

## Yapılandırma

- Yerel geliştirme için `.env` / `REACT_APP_*` gerekmez.
- Backend URL’sini `package.json` içindeki `"proxy"` ile değiştirin.
- Üretim derlemesinde aynı köken (reverse proxy) veya açık bir API taban URL’si gerekir.

## Mimari

Bileşen hiyerarşisi, akış diyagramları ve UML için [architecture-uml.md](./architecture-uml.md) dosyasına bakın.

## Lisans

Özel proje (`package.json` içinde `"private": true`).
