# PWA Setup Guide

## ✅ PWA Implementation Complete

L'app è ora configurata come Progressive Web App (PWA) completa e installabile.

## 📱 Caratteristiche PWA

### Implementate
- ✅ **Manifest.json** - Metadati app (nome, icone, colori)
- ✅ **Service Worker** - Cache automatica con next-pwa
- ✅ **Icone PWA** - Set completo 72px-512px
- ✅ **Apple Meta Tags** - Supporto iOS
- ✅ **Offline Support** - App funziona senza connessione
- ✅ **Installabile** - Prompt "Add to Home Screen"
- ✅ **Shortcuts** - Quick actions (Start Review, Browse Cards)

### Configurazione

#### 1. Manifest (`/public/manifest.json`)
```json
{
  "name": "English Vocabulary Trainer",
  "short_name": "VocabTrainer",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
```

#### 2. Service Worker (next-pwa)
```js
// next.config.mjs
const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
});
```

#### 3. Icone
Tutte le icone richieste sono in `/public/icons/`:
- `icon-72x72.png` → `icon-512x512.png`

## 🧪 Come Testare la PWA

### Desktop (Chrome/Edge)
1. Avvia l'app: `npm run dev`
2. Apri Chrome DevTools → Application → Manifest
3. Verifica che tutti i campi siano corretti
4. Vai su Application → Service Workers
5. Verifica che il SW sia registrato
6. Nella barra URL, clicca l'icona "Installa app"

### Mobile (Android)
1. Accedi all'app da Chrome mobile
2. Menu → "Aggiungi a schermata Home"
3. L'app si installa come app nativa
4. Aprila dalla home screen (modalità standalone)

### Mobile (iOS)
1. Accedi all'app da Safari
2. Tap sull'icona Share
3. "Aggiungi a schermata Home"
4. L'app si installa sulla home screen

## 🔧 Comandi Disponibili

```bash
# Genera nuove icone (se modifichi icon.svg)
npm run generate-icons

# Build produzione (genera SW automaticamente)
npm run build

# Avvia build produzione per testare SW
npm run start
```

## 📊 Verifica PWA

### Lighthouse Audit
1. Chrome DevTools → Lighthouse
2. Seleziona "Progressive Web App"
3. Run audit
4. Target: 100/100 score

### PWA Checklist
- ✅ Manifest con tutti i campi richiesti
- ✅ Service Worker registrato
- ✅ HTTPS (Vercel lo fornisce automaticamente)
- ✅ Icone 192px e 512px
- ✅ Responsive design
- ✅ Fast load time
- ✅ Works offline

## 🎨 Personalizzare Icone

### Sostituire icon.svg
1. Sostituisci `/public/icon.svg` con il tuo logo
2. Run: `npm run generate-icons`
3. Le icone PNG verranno rigenerate automaticamente

### Colori Tema
Modifica in `/public/manifest.json`:
```json
{
  "theme_color": "#3b82f6",      // Colore barra browser
  "background_color": "#ffffff"  // Colore splash screen
}
```

## 🚀 Deploy su Vercel

La PWA funziona automaticamente su Vercel:
1. `git push` → Vercel deploy automatico
2. HTTPS automatico ✅
3. Service Worker funziona in produzione
4. App installabile da qualsiasi dispositivo

## 📝 Note Importanti

### Development Mode
Il Service Worker è **disabilitato** in development per evitare problemi di caching durante lo sviluppo.

### Production Mode
Il Service Worker è **attivo** solo in production (`npm run build && npm run start` o Vercel).

### Cache Strategy
next-pwa usa workbox con strategia:
- **NetworkFirst** per HTML
- **CacheFirst** per assets statici (JS, CSS, images)
- **StaleWhileRevalidate** per API calls

### Aggiornamenti App
Quando fai deploy di nuove versioni:
1. Il SW rileva automaticamente la nuova versione
2. Scarica i nuovi file in background
3. Al prossimo refresh, l'utente vede la nuova versione

## 🐛 Troubleshooting

### "Service Worker not registered"
- Verifica di essere in production mode
- Controlla console per errori
- Verifica che HTTPS sia attivo

### "Icons not loading"
- Verifica che le icone esistano in `/public/icons/`
- Run `npm run generate-icons`
- Clear cache e reload

### "Install prompt not showing"
- Verifica PWA requirements su Chrome DevTools
- Assicurati che manifest sia valido
- Rimuovi cache e testa in incognito

## 📚 Risorse Utili

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [next-pwa Documentation](https://github.com/shadowwalker/next-pwa)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
