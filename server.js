const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1481765935928053801/BoFnlZHpgTfJqGXKtxjFS-hcN40tYHFmB8JRituBgdVBWp0fEpp7rRqOS_FZFBZVxIWz";
 
app.use(cors({ origin: '*', methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type','Accept'] }));
app.options('*', cors());
app.use(express.json());
 
app.get('/', (req, res) => {
  res.json({ status: 'Némézis FA API — En ligne ✅' });
});
 
app.post('/candidature', async (req, res) => {
  console.log('📋 Candidature reçue:', req.body);
  const { pseudo, discord, age, disponibilite, experience, parrain, motivation } = req.body;
 
  if (!pseudo || !discord || !motivation) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }
 
  const payload = {
    username: "⚔ Némézis FA — Recrutement",
    embeds: [{
      title: "📋 NOUVELLE CANDIDATURE",
      color: 12517441,
      fields: [
        { name: "👤 Pseudo RP",     value: pseudo || "—",         inline: true },
        { name: "🎮 Discord",       value: discord || "—",        inline: true },
        { name: "🎂 Âge",           value: (age || "—") + " ans", inline: true },
        { name: "⏰ Disponibilité", value: disponibilite || "—",  inline: true },
        { name: "🎯 Expérience RP", value: experience || "—",     inline: true },
        { name: "🤝 Parrainé par",  value: parrain || "Aucun",    inline: true },
        { name: "💬 Motivation",    value: motivation || "—",     inline: false }
      ],
      footer: { text: "Némézis FA — Candidature reçue via le site de recrutement" },
      timestamp: new Date().toISOString()
    }]
  };
 
  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('Discord status:', response.status);
    if (response.ok || response.status === 204) {
      res.json({ success: true });
    } else {
      const text = await response.text();
      console.error('Discord error:', text);
      res.status(500).json({ error: 'Erreur Discord' });
    }
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ error: err.message });
  }
});
 
app.listen(PORT, () => console.log(`✅ Serveur Némézis FA lancé sur le port ${PORT}`));
