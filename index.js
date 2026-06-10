const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const CONFIG = {
  VERIFY_TOKEN: process.env.VERIFY_TOKEN || "gtechai_webhook_2026",
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || "VOTRE_TOKEN_META",
  PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID || "VOTRE_PHONE_NUMBER_ID",
  OWNER_PHONE: "237697368463",
  MTN_NUMBER: "237674188511",
  ORANGE_NUMBER: "237697368463",
};

const PRODUITS = {
  "1":  { id: "phone_10k",      nom: "📱 Comment gagner 10 000 FCFA/jour avec son téléphone",                         prix: 4900,  fichier: "https://gtechai.netlify.app/ebooks/phone-10k.pdf" },
  "2":  { id: "effet_x10",      nom: "🤑 L'Effet x10 — Transformer 50 000 en 500 000 FCFA",                            prix: 7900,  fichier: "https://gtechai.netlify.app/ebooks/effet-x10.pdf" },
  "3":  { id: "gagner_tel",     nom: "📲 Gagner de l'argent avec votre téléphone — Guide Pratique",                    prix: 4900,  fichier: "https://gtechai.netlify.app/ebooks/gagner-tel.pdf" },
  "4":  { id: "ecommerce_ia",   nom: "🛒 E-Commerce x IA — Blueprint pour scaler une boutique",                        prix: 9900,  fichier: "https://gtechai.netlify.app/ebooks/ecommerce-ia.pdf" },
  "5":  { id: "facebook_gold",  nom: "💰 Facebook Goldmine — Transformer ta Page en Machine à Vendre",                prix: 9900,  fichier: "https://gtechai.netlify.app/ebooks/facebook-goldmine.pdf" },
  "6":  { id: "tiktok_fortune", nom: "🎵 TikTok Fortune — De 0 à 10 000 Abonnés en 60 jours",                         prix: 9900,  fichier: "https://gtechai.netlify.app/ebooks/tiktok-fortune.pdf" },
  "7":  { id: "whatsapp_cash",  nom: "💬 WhatsApp Cash Machine — Transformer tes Contacts en Clients",                prix: 9900,  fichier: "https://gtechai.netlify.app/ebooks/whatsapp-cash.pdf" },
  "8":  { id: "revenus_passifs",nom: "💤 Revenus Passifs Africains — 500 000 FCFA/mois en automatique",               prix: 12900, fichier: "https://gtechai.netlify.app/ebooks/revenus-passifs.pdf" },
  "9":  { id: "mindset",        nom: "🧠 Mindset Millionnaire Africain — Les 7 Reprogrammations",                     prix: 7900,  fichier: "https://gtechai.netlify.app/ebooks/mindset.pdf" },
  "10": { id: "leader",         nom: "👑 L'Éveil du Leader Digital — De l'Ombre à l'Influence",                       prix: 7900,  fichier: "https://gtechai.netlify.app/ebooks/leader.pdf" },
  "11": { id: "pharmacopee",    nom: "🌿 Pharmacopée Africaine — 100 plus Remèdes Naturels",                          prix: 6900,  fichier: "https://gtechai.netlify.app/ebooks/pharmacopee.pdf" },
  "12": { id: "manger_guerir",  nom: "🥗 Manger pour Guérir — Guide Nutritionnel Complet",                            prix: 5900,  fichier: "https://gtechai.netlify.app/ebooks/manger-guerir.pdf" },
  "13": { id: "tension_sucre",  nom: "🍬 Tension et Sucre — Reprendre le Contrôle Naturellement",                    prix: 5900,  fichier: "https://gtechai.netlify.app/ebooks/tension-sucre.pdf" },
  "14": { id: "hemorroides",    nom: "🍎 En Finir avec les Hémorroïdes — Guide Naturel",                              prix: 5900,  fichier: "https://gtechai.netlify.app/ebooks/hemorroides.pdf" },
  "15": { id: "whatsapp_ia",    nom: "📊 Comment gagner 100 000 FCFA/mois avec WhatsApp",                             prix: 9900,  fichier: "https://gtechai.netlify.app/ebooks/whatsapp-ia.pdf" },
  "16": { id: "chomeur_patron", nom: "🚀 De Chômeur à Patron — 100 000 FCFA/mois avec ton Smartphone",               prix: 9900,  fichier: "https://gtechai.netlify.app/ebooks/chomeur-patron.pdf" },
  "17": { id: "sans_limite",    nom: "🔓 Sans Limite — Guide de la Liberté Financière pour Africains",               prix: 7900,  fichier: "https://gtechai.netlify.app/ebooks/sans-limite.pdf" },
  "18": { id: "terre_ia",       nom: "🌱 La Terre et l'IA — Guide de l'Agriculteur Connecté",                         prix: 7900,  fichier: "https://gtechai.netlify.app/ebooks/terre-ia.pdf" },
};

// ══════════════════════════════════════════════
// NOUVEAUX KEYWORDS LANDING PAGE V2
// ══════════════════════════════════════════════
const KEYWORDS = {
  "gt-goldmine": {
    produit: PRODUITS["5"],
    msg: (p) =>
`💰 *Facebook Goldmine*
━━━━━━━━━━━━━━━━━━━━
Transforme ta Page Facebook en machine à vendre automatiquement.

✅ 50+ leads qualifiés/semaine
✅ Système de posts qui convertissent
✅ Adapté au marché africain francophone

💵 *Prix : ${p.prix.toLocaleString()} FCFA*
━━━━━━━━━━━━━━━━━━━━
📲 *Comment payer (Orange Money) :*
👉 Envoie *${p.prix.toLocaleString()} FCFA* au *+237 697 368 463*

Puis réponds avec :
*REFERENCE / Ton Prénom Nom*

Exemple : *AB123456 / Jean Mbarga*

⚡ Accès immédiat après confirmation !`
  },

  "gt-whatsapp": {
    produit: PRODUITS["7"],
    msg: (p) =>
`💬 *WhatsApp Cash Machine*
━━━━━━━━━━━━━━━━━━━━
La méthode complète pour vendre automatiquement via WhatsApp Business, 24h/24.

✅ 1ères ventes en 72h garanties
✅ Scripts de vente prêts à copier-coller
✅ Bot de réponse automatique inclus

💵 *Prix : ${p.prix.toLocaleString()} FCFA*
━━━━━━━━━━━━━━━━━━━━
📲 *Comment payer (Orange Money) :*
👉 Envoie *${p.prix.toLocaleString()} FCFA* au *+237 697 368 463*

Puis réponds avec :
*REFERENCE / Ton Prénom Nom*

Exemple : *AB123456 / Jean Mbarga*

⚡ Accès immédiat après confirmation !`
  },

  "gt-tiktok": {
    produit: PRODUITS["6"],
    msg: (p) =>
`🎵 *TikTok Fortune*
━━━━━━━━━━━━━━━━━━━━
De 0 à 10 000 abonnés en 60 jours avec du contenu viral africain.

✅ Stratégie de contenu semaine par semaine
✅ Idées de vidéos qui marchent en Afrique
✅ Monétisation dès 1 000 abonnés

💵 *Prix : ${p.prix.toLocaleString()} FCFA*
━━━━━━━━━━━━━━━━━━━━
📲 *Comment payer (Orange Money) :*
👉 Envoie *${p.prix.toLocaleString()} FCFA* au *+237 697 368 463*

Puis réponds avec :
*REFERENCE / Ton Prénom Nom*

Exemple : *AB123456 / Jean Mbarga*

⚡ Accès immédiat après confirmation !`
  },

  "gt-club": {
    produit: null,
    msg: () =>
`🏆 *GTECHAI Club Premium*
━━━━━━━━━━━━━━━━━━━━
L'abonnement qui change tout pour les entrepreneurs africains sérieux.

✅ Accès à *TOUTES* les 18 formations
✅ 2 nouvelles formations chaque mois
✅ Groupe WhatsApp VIP membres
✅ Templates & bots préconfigurés
✅ Coaching mensuel en live

💵 *9 900 FCFA / mois*
~~19 900 FCFA~~ → -50% lancement !
━━━━━━━━━━━━━━━━━━━━
📲 *Comment rejoindre (Orange Money) :*
👉 Envoie *9 900 FCFA* au *+237 697 368 463*

Puis réponds avec :
*CLUB / Ton Prénom Nom*

Exemple : *CLUB / Marie Ekoto*

🔓 Sans engagement · Annulation en 1 message
⚡ Accès immédiat après confirmation !`
  },

  "gt-masterclass": {
    produit: { prix: 14900, fichier: "https://gtechai.netlify.app/masterclass/acces.html" },
    msg: (p) =>
`👑 *GTECHAI MasterClass*
━━━━━━━━━━━━━━━━━━━━
10 modules complets pour bâtir ton empire digital de A à Z avec l'IA.

✅ Module 1 : Mindset & Vision
✅ Module 2-4 : Produits numériques
✅ Module 5-7 : Vente & Automatisation
✅ Module 8-10 : Scale & Revenus passifs

⏱ Résultat : Système complet en 30 jours

💵 *Prix : ${p.prix.toLocaleString()} FCFA*
~~21 300 FCFA~~ → -30% limité !
━━━━━━━━━━━━━━━━━━━━
📲 *Comment payer (Orange Money) :*
👉 Envoie *${p.prix.toLocaleString()} FCFA* au *+237 697 368 463*

Puis réponds avec :
*MASTERCLASS / Ton Prénom Nom*

Exemple : *MASTERCLASS / Paul Biya Nguema*

⚡ Accès immédiat après confirmation !`
  },

  "gt-passifs": {
    produit: PRODUITS["8"],
    msg: (p) =>
`💤 *Revenus Passifs Africains*
━━━━━━━━━━━━━━━━━━━━
6 sources de revenus passifs accessibles depuis l'Afrique, étape par étape.

✅ 1er revenu passif en 30 jours
✅ Zéro capital requis pour 3 méthodes
✅ Adapté aux réalités africaines

💵 *Prix : ${p.prix.toLocaleString()} FCFA*
━━━━━━━━━━━━━━━━━━━━
📲 *Comment payer (Orange Money) :*
👉 Envoie *${p.prix.toLocaleString()} FCFA* au *+237 697 368 463*

Puis réponds avec :
*REFERENCE / Ton Prénom Nom*

Exemple : *AB123456 / Jean Mbarga*

⚡ Accès immédiat après confirmation !`
  },

  "gt-mindset": {
    produit: PRODUITS["9"],
    msg: (p) =>
`🧠 *Mindset Millionnaire Africain*
━━━━━━━━━━━━━━━━━━━━
Les 7 reprogrammations mentales pour attirer l'abondance et passer à l'action.

✅ Clarté d'objectifs en 48h
✅ Méthodes testées par 500+ Africains
✅ Audios de méditation inclus

💵 *Prix : ${p.prix.toLocaleString()} FCFA*
━━━━━━━━━━━━━━━━━━━━
📲 *Comment payer (Orange Money) :*
👉 Envoie *${p.prix.toLocaleString()} FCFA* au *+237 697 368 463*

Puis réponds avec :
*REFERENCE / Ton Prénom Nom*

Exemple : *AB123456 / Jean Mbarga*

⚡ Accès immédiat après confirmation !`
  },
};

// ══════════════════════════════════════════════

const sessions = {};
function getSession(phone) {
  if (!sessions[phone]) {
    sessions[phone] = { etape: "menu", commande: null, tentatives: 0 };
  }
  return sessions[phone];
}

async function envoyerMessage(to, message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${CONFIG.PHONE_NUMBER_ID}/messages`,
      { messaging_product: "whatsapp", to, type: "text", text: { body: message } },
      { headers: { Authorization: `Bearer ${CONFIG.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Erreur envoi:", err.response?.data || err.message);
  }
}

function msgAccueil() {
  return `👋 Bonjour ! Je suis *GTECHAI*, ton assistant IA personnel.\n\nJe peux t'aider à :\n\n1️⃣ Voir le *Catalogue* (18 formations)\n2️⃣ Commande *rapide* par keyword\n\nTape *MENU* pour le catalogue complet\nOu envoie directement :\n\n💬 *GT-WHATSAPP* → WhatsApp Cash Machine\n💰 *GT-GOLDMINE* → Facebook Goldmine\n🎵 *GT-TIKTOK* → TikTok Fortune\n🏆 *GT-CLUB* → Abonnement Premium\n👑 *GT-MASTERCLASS* → MasterClass complète\n💤 *GT-PASSIFS* → Revenus Passifs\n🧠 *GT-MINDSET* → Mindset Millionnaire\n\n📞 Support : *+237 697 368 463*`;
}

function msgCatalogue() {
  let msg = `🛍️ *CATALOGUE GTECHAI SOLUTIONS IA*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
  for (const [num, p] of Object.entries(PRODUITS)) {
    msg += `*${num}.* ${p.nom}\n💰 Prix : *${p.prix.toLocaleString()} XAF*\n\n`;
  }
  msg += `━━━━━━━━━━━━━━━━━━━━\nRéponds avec le *numéro* du produit qui t'intéresse.`;
  return msg;
}

function msgPaiement(produit, methode) {
  const isMTN = methode === "1";
  const numero = isMTN ? "+237 674 188 511" : "+237 697 368 463";
  const reseau = isMTN ? "MTN Mobile Money 📱" : "Orange Money 🟠";
  return `${reseau}\n\n1️⃣ Envoie *${produit.prix.toLocaleString()} XAF* au :\n👉 *${numero}*\n\n2️⃣ Puis réponds avec :\n*REFERENCE / Ton Prénom Nom*\n\nExemple : *AB123456 / Jean Mbarga*\n\n✅ Accès immédiat après confirmation !`;
}

async function traiterMessage(phone, texte) {
  const session = getSession(phone);
  const msg = texte.trim().toLowerCase();

  // ══ KEYWORDS DIRECTS (priorité haute) ══
  const kwKey = Object.keys(KEYWORDS).find(k => msg === k);
  if (kwKey) {
    const kw = KEYWORDS[kwKey];
    const produit = kw.produit;
    // Pour GT-CLUB et GT-MASTERCLASS : pas de sélection méthode, livraison manuelle
    if (kwKey === "gt-club") {
      await envoyerMessage(phone, kw.msg());
      // Notifier le owner
      await envoyerMessage(CONFIG.OWNER_PHONE, `🔔 INTÉRÊT CLUB\n📱 ${phone}\n⏰ ${new Date().toLocaleString("fr-FR")}`);
      session.etape = "attente_paiement_club";
      session.commande = { produit: { nom: "GTECHAI Club Premium", prix: 9900, fichier: "" }, methode: "2" };
    } else if (kwKey === "gt-masterclass") {
      await envoyerMessage(phone, kw.msg(produit));
      await envoyerMessage(CONFIG.OWNER_PHONE, `🔔 INTÉRÊT MASTERCLASS\n📱 ${phone}\n⏰ ${new Date().toLocaleString("fr-FR")}`);
      session.etape = "attente_paiement";
      session.commande = { produit: { nom: "GTECHAI MasterClass", prix: 14900, fichier: produit.fichier }, methode: "2" };
    } else {
      await envoyerMessage(phone, kw.msg(produit));
      await envoyerMessage(CONFIG.OWNER_PHONE, `🔔 INTÉRÊT ${kwKey.toUpperCase()}\n📱 ${phone}\n🛍️ ${produit.nom}\n💰 ${produit.prix.toLocaleString()} FCFA\n⏰ ${new Date().toLocaleString("fr-FR")}`);
      session.etape = "attente_paiement";
      session.commande = { produit, methode: "2" };
    }
    session.tentatives = 0;
    return;
  }

  // ══ MOTS-CLÉS DE BASE ══
  if (["menu", "accueil", "bonjour", "salut", "hello", "bonsoir", "hi"].some(m => msg.includes(m))) {
    session.etape = "menu";
    session.commande = null;
    await envoyerMessage(phone, msgAccueil());
    return;
  }

  if (msg === "aide" || msg === "help") {
    await envoyerMessage(phone, `🆘 *Besoin d'aide ?*\n\n- Tape *MENU* pour recommencer\n- Tape *HUMAIN* pour parler à quelqu'un\n- Support direct : *+237 697 368 463*`);
    return;
  }

  if (msg === "humain" || msg === "agent") {
    await envoyerMessage(phone, `👤 Je te mets en contact avec notre équipe.\n\n📞 *+237 697 368 463*`);
    await envoyerMessage(CONFIG.OWNER_PHONE, `⚠️ DEMANDE HUMAIN\nClient : ${phone}`);
    return;
  }

  // ══ ÉTAPE CATALOGUE ══
  if (session.etape === "menu") {
    if (msg === "1" || msg.includes("catalogue")) {
      session.etape = "catalogue";
      await envoyerMessage(phone, msgCatalogue());
      return;
    }
    // BOT keyword existant
    if (msg === "bot") {
      await envoyerMessage(phone, `🤖 *Le Bot GTECHAI*\n\nNotre système automatisé traite tes commandes 24h/24 :\n\n✅ Catalogue de 18 formations\n✅ Paiement MTN & Orange Money\n✅ Livraison instantanée\n✅ Keywords directs pour accès rapide\n\nTape *MENU* pour démarrer !`);
      return;
    }
    await envoyerMessage(phone, msgAccueil());
    return;
  }

  if (session.etape === "catalogue") {
    const produit = PRODUITS[msg];
    if (produit) {
      session.etape = "choix_paiement";
      session.commande = { produit, methode: null };
      await envoyerMessage(phone, `✅ *${produit.nom}*\n💰 *${produit.prix.toLocaleString()} XAF*\n\nChoisis ton mode de paiement :\n1️⃣ MTN Mobile Money\n2️⃣ Orange Money`);
    } else {
      await envoyerMessage(phone, `Réponds avec le *numéro* du produit (1 à 18).\n\nTape *MENU* pour recommencer.`);
    }
    return;
  }

  if (session.etape === "choix_paiement") {
    if (msg === "1" || msg === "2") {
      session.commande.methode = msg;
      session.etape = "attente_paiement";
      await envoyerMessage(phone, msgPaiement(session.commande.produit, msg));
    } else {
      await envoyerMessage(phone, `Réponds *1* pour MTN ou *2* pour Orange Money.`);
    }
    return;
  }

  if (session.etape === "attente_paiement" || session.etape === "attente_paiement_club") {
    const parts = texte.split(/[\/\-\|,]/);
    const ref = parts[0] ? parts[0].trim() : "";
    const nom = parts[1] ? parts[1].trim() : "Client";
    if (ref && ref.length >= 4) {
      const methodeLabel = session.commande.methode === "1" ? "MTN" : "Orange Money";
      await envoyerMessage(CONFIG.OWNER_PHONE,
        `🔔 NOUVELLE COMMANDE\n👤 ${nom}\n📱 ${phone}\n🛍️ ${session.commande.produit.nom}\n💰 ${session.commande.produit.prix.toLocaleString()} XAF\n💳 ${methodeLabel}\n🔖 Réf: ${ref}\n⏰ ${new Date().toLocaleString("fr-FR")}`
      );
      if (session.etape === "attente_paiement_club") {
        await envoyerMessage(phone,
          `🎉 *Merci ${nom} !*\n\n✅ Inscription Club confirmée.\n\n🏆 Tu seras ajouté au groupe VIP dans les 5 minutes.\n\n📞 Contact : *+237 697 368 463*\n\n🙏 Bienvenue dans *GTECHAI Club Premium* !`
        );
      } else {
        await envoyerMessage(phone,
          `🎉 *Merci ${nom} !*\n\n✅ Commande confirmée.\n\n📥 Lien de téléchargement :\n${session.commande.produit.fichier}\n\n⚠️ Lien valable 7 jours.\n\n🙏 Merci de faire confiance à *GTECHAI Solutions IA* !`
        );
      }
      session.etape = "menu";
      session.commande = null;
      session.tentatives = 0;
    } else {
      session.tentatives++;
      if (session.tentatives >= 3) {
        await envoyerMessage(phone, `Contacte-nous directement au *+237 697 368 463*`);
        session.etape = "menu";
      } else {
        await envoyerMessage(phone, `Envoie dans ce format :\n👉 *REFERENCE / Ton Nom*\n\nExemple : *AB123456 / Jean Mbarga*`);
      }
    }
    return;
  }

  if (session.etape === "suivi") {
    await envoyerMessage(CONFIG.OWNER_PHONE, `🔍 SUIVI\nClient : ${phone}\nRef : ${texte}`);
    await envoyerMessage(phone, `🔍 Demande transmise. Réponse dans quelques minutes. 🙏`);
    session.etape = "menu";
    return;
  }

  await envoyerMessage(phone, msgAccueil());
}

// ══ WEBHOOK ══
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === CONFIG.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
  try {
    const body = req.body;
    if (body.object !== "whatsapp_business_account") return;
    const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;
    if (!messages || messages.length === 0) return;
    const message = messages[0];
    const phone = message.from;
    let texte = "";
    if (message.type === "text") {
      texte = message.text.body;
    } else {
      await envoyerMessage(phone, "Je traite uniquement les messages texte. Tape *MENU* pour commencer.");
      return;
    }
    await traiterMessage(phone, texte);
  } catch (err) {
    console.error("Erreur webhook:", err);
  }
});

app.get("/", (req, res) => {
  res.json({ status: "GTECHAI Bot operationnel", version: "2.0.0", keywords: Object.keys(KEYWORDS) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("GTECHAI Bot v2.0 démarré sur le port " + PORT);
});
