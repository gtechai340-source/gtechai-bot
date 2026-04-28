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
  "1": { id: "phone_10k", nom: "📱 Comment gagner 10 000 FCFA/jour avec son téléphone", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1KNaY8u6eiIzlx3HKfvVmRez5dh1rbWTm" },
  "2": { id: "effet_x10", nom: "💰 L'Effet x10 — Transformer 50 000 en 500 000 FCFA en 90 jours", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1EAZ9carjB7QJAn3ZCguH0bSot9DE5gHD" },
  "3": { id: "gagner_tel", nom: "📗 Gagner de l'argent avec votre téléphone — Guide Pratique Afrique", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1oh82zO1Au7k_QpRdOF_XJSDCNmN168y2" },
  "4": { id: "ecommerce_ia", nom: "🛒 E-Commerce x IA — Blueprint pour scaler une boutique", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1GbXB1EfaTFwlv6GndmuyRJiuPRTaE_9P" },
  "5": { id: "facebook_gold", nom: "📘 Facebook Goldmine — Transformer ta Page en Machine a Prospects", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1Jt97l3kxxNOhWEByphNNzc98UFO3IO4L" },
  "6": { id: "tiktok_fortune", nom: "🎵 TikTok Fortune — De 0 a 10 000 Abonnes en 60 Jours", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1Z7A5hUZD2_TRddtBefL4qUYnOxTywnIJ" },
  "7": { id: "whatsapp_cash", nom: "💬 WhatsApp Cash Machine — Transformer tes Contacts en Clients", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1l72X0Ru4xTLVjxYt5DIcisooxQu7e_oF" },
  "8": { id: "revenus_passifs", nom: "💤 Revenus Passifs Africains — 500 000 FCFA/mois pendant que tu Dors", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1XVDyq7tfnLfvB9Z91fQoawHIRQetvCVl" },
  "9": { id: "mindset", nom: "🧠 Mindset Millionnaire Africain — Les 7 Reprogrammations Mentales", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1UEfOOjq3tOR0iUpytu9-1J68KHNqjNQw" },
  "10": { id: "leader", nom: "👑 L'Eveil du Leader Digital — De l'Ombre a l'Influence en 30 Jours", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1uuN_yQv94cx9cH6ptm85qsbrfuFHcjWj" },
  "11": { id: "pharmacopee", nom: "🌿 Pharmacopee Africaine — 100 plus Remedes Naturels Ancestraux", prix: 9900, fichier: "https://drive.google.com/uc?export=download&id=15GFVB75rkJCdl7WQqhmSTeZaJF5rMpcN" },
  "12": { id: "manger_guerir", nom: "🥗 Manger pour Guerir — Guide Nutritionnel contre les Maladies Chroniques", prix: 9900, fichier: "https://drive.google.com/uc?export=download&id=1GgZ8pEN4kLCaK9a8rppBN3BVLrknHw1C" },
  "13": { id: "tension_sucre", nom: "💊 Tension et Sucre — Reprendre le Controle Naturellement", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1LSzbp4u403bMTRubqbWk40YtiNXzQRLx" },
  "14": { id: "hemorroides", nom: "🔴 En Finir avec les Hemorroides — Guide Naturel Sans Chirurgie", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1GOnNE45gIqAoCc0jxxR2DzExVoYXBnKq" },
  "15": { id: "whatsapp_ia", nom: "🤖 Comment gagner 100 000 FCFA/mois avec WhatsApp et l'IA", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1u9sgVCH3nbxjhxcGejz0uEoFpY3fvQDB" },
  // ✅ NOUVEAUX — Ajoutés le 20/04/2026
  "16": { id: "chomeur_patron", nom: "🚀 De Chomeur a Patron — 100 000 FCFA/mois avec l'IA et le Business Digital", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1tm9ijldQZT15LLhsazZ_2A4DhvNLXLdO" },
  "17": { id: "sans_limite", nom: "♿ Sans Limite — Guide de la Liberte Financiere pour Personnes Handicapees", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=1z_FRVgwcbR1faZXWgmzBUy7E97C2nIuC" },
  "18": { id: "terre_ia", nom: "🌱 La Terre et l'IA — Guide de l'Agriculteur Connecte (100 000 FCFA/mois)", prix: 4900, fichier: "https://drive.google.com/uc?export=download&id=16-KZK9oY5lhed51d11bdrgRk82y0s3hd" },
};

const sessions = {};
function getSession(phone) {
  if (!sessions[phone]) {
    sessions[phone] = { etape: "menu", commande: null, tentatives: 0 };
  }
  return sessions[phone];async function envoyerMessage(to, message) {
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
  return "👋 Bonjour ! Je suis *GTECHAI*, ton assistant IA personnel.\n\nJe peux t'aider a obtenir :\n📚 Des eBooks premium\n📸 Des photos IA personnalisees\n🎵 Des chansons IA sur mesure\n🎬 Des videos IA uniques\n\nQue souhaites-tu faire ?\n\n1️⃣ Voir le catalogue\n2️⃣ Passer une commande\n3️⃣ Suivre ma commande\n4️⃣ Parler a un humain\n\nReponds avec le numero de ton choix 👇";
}

function msgCatalogue() {
  let msg = "🛍️ *CATALOGUE GTECHAI SOLUTIONS IA*\n━━━━━━━━━━━━━━━━━━━━━\n\n";
  for (const [num, p] of Object.entries(PRODUITS)) {
    msg += `*${num}. ${p.nom}*\n💰 Prix : *${p.prix.toLocaleString()} XAF*\n\n`;
  }
  msg += "━━━━━━━━━━━━━━━━━━━━━\nReponds avec le *numero* du produit qui t'interesse 👇";
  return msg;
}

function msgPaiement(produit, methode) {
  const isMTN = methode === "1";
  const numero = isMTN ? "+237 674 188 511" : "+237 697 368 463";
  const reseau = isMTN ? "MTN Mobile Money 📱" : "Orange Money 🟠";
  return `${reseau}\n\n1️⃣ Envoie *${produit.prix.toLocaleString()} XAF* au :\n   👉 *${numero}*\n\n2️⃣ Note la *reference* recue par SMS\n\n3️⃣ Envoie-moi :\n   - La *reference* de transaction\n   - Ton *nom complet*\n\nExemple : *AB123456 / Jean Mbarga*\n\n⏱️ Livraison dans les *5 minutes* apres confirmation.`;async function traiterMessage(phone, texte) {
  const session = getSession(phone);
  const msg = texte.trim().toLowerCase();

  if (["menu","accueil","bonjour","salut","hello","bonsoir","hi"].some(m => msg.includes(m))) {
    session.etape = "menu";
    session.commande = null;
    await envoyerMessage(phone, msgAccueil());
    return;
  }

  if (msg === "aide" || msg === "help") {
    await envoyerMessage(phone, "🆘 *Besoin d'aide ?*\n\n- Tape *MENU* pour recommencer\n- Tape *CATALOGUE* pour voir les produits\n- Tape *HUMAIN* pour parler a notre equipe\n\n📞 Contact : +237 697 368 463");
    return;
  }

  if (msg === "humain" || msg === "agent") {
    await envoyerMessage(phone, "👨 Je te mets en contact avec notre equipe.\n📲 *+237 697 368 463*\n⏰ Disponible 8h-22h tous les jours.");
    await envoyerMessage(CONFIG.OWNER_PHONE, "⚠️ DEMANDE HUMAIN\nClient " + phone + " demande un agent.");
    return;
  }

  if (session.etape === "menu") {
    if (msg === "1" || msg.includes("catalogue")) {
      session.etape = "catalogue";
      await envoyerMessage(phone, msgCatalogue());
    } else if (msg === "2" || msg.includes("commander")) {
      session.etape = "catalogue";
      await envoyerMessage(phone, msgCatalogue());
    } else if (msg === "3" || msg.includes("suivre")) {
      session.etape = "suivi";
      await envoyerMessage(phone, "🔍 Envoie-moi ta *reference de transaction* pour verifier ta commande.");
    } else if (msg === "4") {
      await envoyerMessage(phone, "👨 Contact : *+237 697 368 463*\nDisponible 8h-22h.");
    } else {
      await envoyerMessage(phone, msgAccueil());
    }
    return;
  }

  if (session.etape === "catalogue") {
    const produit = PRODUITS[msg];
    if (produit) {
      session.etape = "choix_paiement";
      session.commande = { produit };
      await envoyerMessage(phone, "*" + produit.nom + "*\n\n💰 Prix : *" + produit.prix.toLocaleString() + " XAF*\n\nChoisis ton paiement :\n\n1. MTN Mobile Money 📱\n   → +237 674 188 511\n\n2. Orange Money 🟠\n   → +237 697 368 463\n\nReponds *1* pour MTN ou *2* pour Orange.");
    } else {
      await envoyerMessage(phone, "Reponds avec le *numero* du produit (1 a 15).\n\nOu tape *MENU* pour revenir au debut.");
    }
    return;
  }

  if (session.etape === "choix_paiement") {
    if (msg === "1" || msg.includes("mtn")) {
      session.commande.methode = "1";
      session.etape = "attente_paiement";
      await envoyerMessage(phone, msgPaiement(session.commande.produit, "1"));
    } else if (msg === "2" || msg.includes("orange")) {
      session.commande.methode = "2";
      session.etape = "attente_paiement";
      await envoyerMessage(phone, msgPaiement(session.commande.produit, "2"));
    } else {
      await envoyerMessage(phone, "Reponds *1* pour MTN ou *2* pour Orange Money.");
    }
    return;
  }

  if (session.etape === "attente_paiement") {
    const parts = texte.split(/[\/\-\|,]/);
    const ref = parts[0] ? parts[0].trim() : "";
    const nom = parts[1] ? parts[1].trim() : "Client";
    if (ref && ref.length >= 4) {
      await envoyerMessage(CONFIG.OWNER_PHONE, "🔔 NOUVELLE COMMANDE\n👤 " + nom + "\n📱 " + phone + "\n🛍️ " + session.commande.produit.nom + "\n💰 " + session.commande.produit.prix.toLocaleString() + " XAF\n💳 " + (session.commande.methode === "1" ? "MTN" : "Orange") + "\n🔖 Ref: " + ref);
      await envoyerMessage(phone, "🎉 *Merci " + nom + " !*\n\n✅ Commande confirmee.\n\n📥 Lien de telechargement :\n" + session.commande.produit.fichier + "\n\n⚠️ Lien valable 7 jours.\n\n🙏 Merci de faire confiance a *GTECHAI Solutions IA* !");
      session.etape = "menu";
      session.commande = null;
    } else {
      session.tentatives++;
      if (session.tentatives >= 3) {
        await envoyerMessage(phone, "Contacte-nous au *+237 697 368 463*");
        session.etape = "menu";
      } else {
        await envoyerMessage(phone, "Envoie dans ce format :\n👉 *REFERENCE / Ton Nom*\n\nExemple : *AB123456 / Jean Mbarga*");
      }
    }
    return;
  }

  if (session.etape === "suivi") {
    await envoyerMessage(CONFIG.OWNER_PHONE, "🔍 SUIVI\nClient : " + phone + "\nRef : " + texte);
    await envoyerMessage(phone, "🔍 Demande transmise. Reponse dans quelques minutes. 🙏");
    session.etape = "menu";
    return;
  }

  await envoyerMessage(phone, msgAccueil());
  }
}
}app.get("/webhook", (req, res) => {
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
      await envoyerMessage(phone, "Je traite uniquement les messages texte. Tape MENU pour commencer.");
      return;
    }
    await traiterMessage(phone, texte);
  } catch (err) {
    console.error("Erreur webhook:", err);
  }
});

app.get("/", (req, res) => {
  res.json({ status: "GTECHAI Bot operationnel", version: "1.0.0" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("GTECHAI Bot demarre sur le port " + PORT);
});
