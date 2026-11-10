function updateDate() {
  const el = document.getElementById("date-heure");
  if (el)
    el.textContent =
      new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      " - " +
      new Date().toLocaleTimeString("fr-FR");
}
setInterval(updateDate, 1000);
updateDate();

const actualites = [
  {
    type: "note",
    titre: "Note N°0342/MEMP/DC/SGM",
    desc: "Rentrée pédagogique.",
    date: "03 Oct 2026",
    fichier: "#",
  },
  {
    type: "arrete",
    titre: "Arrêté N°2026-089 AME",
    desc: "12 000 AME.",
    date: "01 Oct 2026",
    fichier: "#",
  },
  {
    type: "decret",
    titre: "Décret N°2026-412",
    desc: "Statut des normaliens.",
    date: "28 Sept 2026",
    fichier: "#",
  },
];

function afficherActus() {
  const c = document.getElementById("liste-actus");
  if (!c) return;
  c.innerHTML = "";
  actualites.forEach((a) => {
    c.innerHTML += `<div class="actu-item"><span class="badge ${a.type}">${a.type.toUpperCase()}</span><div><h4>${a.titre}</h4><p>${a.desc} (${a.date})</p></div></div>`;
  });
}
afficherActus();

const dataBenin = {
  ALIBORI: [
    "Banikoara",
    "Gogounou",
    "Kandi",
    "Karimama",
    "Malanville",
    "Ségbana",
  ],
  ATACORA: [
    "Boukoumbé",
    "Cobly",
    "Kérou",
    "Kouandé",
    "Matéri",
    "Natitingou",
    "Péhunco",
    "Tanguiéta",
    "Toucountouna",
  ],
  ATLANTIQUE: [
    "Abomey-Calavi",
    "Allada",
    "Kpomassè",
    "Ouidah",
    "Sô-Ava",
    "Toffo",
    "Tori-Bossito",
    "Zè",
  ],
  BORGOU: [
    "Bembèrèkè",
    "Kalalé",
    "N'Dali",
    "Nikki",
    "Parakou",
    "Pèrèrè",
    "Sinendé",
    "Tchaourou",
  ],
  COLLINES: ["Bantè", "Dassa-Zoumè", "Glazoué", "Ouèssè", "Savalou", "Savè"],
  COUFFO: ["Aplahoué", "Djakotomey", "Dogbo", "Klouékanmè", "Lalo", "Toviklin"],
  DONGA: ["Bassila", "Copargo", "Djougou", "Ouaké"],
  LITTORAL: ["Cotonou"],
  MONO: ["Athiémé", "Bopa", "Comè", "Grand-Popo", "Houéyogbé", "Lokossa"],
  OUEME: [
    "Adjarra",
    "Adjohoun",
    "Aguégués",
    "Akpro-Missérété",
    "Avrankou",
    "Bonou",
    "Dangbo",
    "Porto-Novo",
    "Sèmè-Kpodji",
  ],
  PLATEAU: ["Adja-Ouèrè", "Ifangni", "Kétou", "Pobè", "Sakété"],
  ZOU: [
    "Abomey",
    "Agbangnizoun",
    "Bohicon",
    "Covè",
    "Djidja",
    "Ouinhi",
    "Za-Kpota",
    "Zangnanado",
    "Zogbodomey",
  ],
};

const dept = document.getElementById("dept"),
  commune = document.getElementById("commune"),
  cs = document.getElementById("cs");
if (dept) {
  dept.innerHTML =
    '<option value="">-- Département --</option>' +
    Object.keys(dataBenin)
      .map((d) => `<option>${d}</option>`)
      .join("");
  dept.onchange = () => {
    commune.innerHTML =
      '<option value="">-- Commune --</option>' +
      (dataBenin[dept.value] || [])
        .map((c) => `<option>${c}</option>`)
        .join("");
    if (cs) cs.innerHTML = '<option value="">Choisir la commune</option>';
  };
}
if (commune) {
  commune.onchange = () => {
    if (cs)
      cs.innerHTML = `<option value="CS ${commune.value}">CS ${commune.value}</option><option value="CS ${commune.value} 1">CS ${commune.value} 1</option><option value="CS ${commune.value} 2">CS ${commune.value} 2</option>`;
    let info = document.getElementById("info-ecole");
    if (info) info.textContent = commune.value;
  };
}
const ecoleInput = document.getElementById("ecole");
if (ecoleInput) {
  ecoleInput.oninput = (e) => {
    let info = document.getElementById("info-ecole");
    if (info)
      info.textContent =
        e.target.value || (commune ? commune.value : "l'entité");
  };
}

function fermer(id) {
  document.getElementById(id).classList.add("hidden");
}
function allerPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}
function retourAccueil() {
  allerPage("page-accueil");
  actualiserAffichageDernieresConnexions();
}
function deconnexion() {
  currentUser = null;
  retourAccueil();
}

let currentRole = "collab";

function configurerEspace(role, titreEspace) {
  currentRole = role;
  document.getElementById("titre-espace-nom").innerHTML = `👥 ${titreEspace}`;

  const groupZone = document.getElementById("group-zone");
  const groupEcole = document.getElementById("group-ecole");
  const groupCs = document.getElementById("group-cs");
  const groupSignature = document.getElementById("group-signature-import");
  const groupDept = document.getElementById("group-dept");
  const groupCommune = document.getElementById("group-commune");

  if (groupZone) groupZone.style.display = "block";
  if (groupEcole) groupEcole.style.display = "block";
  if (groupCs) groupCs.style.display = "block";
  if (groupDept) groupDept.style.display = "block";
  if (groupCommune) groupCommune.style.display = "block";

  if (groupSignature) {
    if (role !== "collab") {
      groupSignature.style.display = "block";
    } else {
      groupSignature.style.display = "none";
    }
  }

  // Retrait des rubriques selon le rôle pour DDEMP et Ministère
  if (role === "ddemp") {
    if (groupCommune) groupCommune.style.display = "none"; // DDEMP : pas de commune
    if (groupZone) groupZone.style.display = "none";
    if (groupEcole) groupEcole.style.display = "none";
    if (groupCs) groupCs.style.display = "none";
  } else if (role === "ministere") {
    if (groupDept) groupDept.style.display = "none"; // Ministère : pas de département
    if (groupCommune) groupCommune.style.display = "none"; // Ministère : pas de commune
    if (groupZone) groupZone.style.display = "none";
    if (groupEcole) groupEcole.style.display = "none";
    if (groupCs) groupCs.style.display = "none";
  } else if (role === "cp") {
    if (groupEcole) groupEcole.style.display = "none";
  } else if (role === "ccs") {
    if (groupZone) groupZone.style.display = "none";
    if (groupEcole) groupEcole.style.display = "none";
  }

  const btnCourriers = document.getElementById("btn-ouvrir-courriers");
  if (btnCourriers) {
    btnCourriers.style.display = "inline-block";
  }

  const btnBiblio = document.getElementById("btn-ouvrir-bibliotheque");
  if (btnBiblio) {
    btnBiblio.style.display = "inline-block";
  }

  const btnListeCCS = document.getElementById("btn-liste-enseignants-ccs");
  if (btnListeCCS) {
    if (currentUser && currentUser.role === "ccs") {
      btnListeCCS.style.display = "inline-block";
      btnListeCCS.textContent = `📋 Liste des enseignants de la ${currentUser.cs || "CS"}`;
    } else {
      btnListeCCS.style.display = "none";
    }
  }

  if (currentUser) {
    allerPage("page-mon-espace");
  } else {
    document.getElementById("modal-connexion").classList.remove("hidden");
  }
}

document.getElementById("btn-collab").onclick = (e) => {
  e.preventDefault();
  configurerEspace("collab", "ESPACE COLLABORATEURS");
};
document.getElementById("btn-directeur").onclick = (e) => {
  e.preventDefault();
  configurerEspace("directeur", "ESPACE DIRECTEUR");
};
document.getElementById("btn-up").onclick = (e) => {
  e.preventDefault();
  configurerEspace("up", "ESPACE UP");
};
document.getElementById("btn-cp").onclick = (e) => {
  e.preventDefault();
  configurerEspace("cp", "ESPACE CP");
};
document.getElementById("btn-ccs").onclick = (e) => {
  e.preventDefault();
  configurerEspace("ccs", "ESPACE C/CS");
};
document.getElementById("btn-ddemp").onclick = (e) => {
  e.preventDefault();
  configurerEspace("ddemp", "ESPACE DDEMP");
};
document.getElementById("btn-ministere").onclick = (e) => {
  e.preventDefault();
  configurerEspace("ministere", "ESPACE MINISTÈRE");
};

const formInscription = document.getElementById("form-inscription");
if (formInscription) {
  formInscription.onsubmit = (e) => {
    e.preventDefault();

    const signatureInput = document.getElementById("signature-file");
    let signatureDataUrl = "";

    const enregistrerUtilisateur = (sigUrl) => {
      let deptVal =
        currentRole === "ministere"
          ? "Niveau Central"
          : dept
            ? dept.value
            : "MONO";
      let communeVal =
        currentRole === "ddemp" || currentRole === "ministere"
          ? "Départemental"
          : commune
            ? commune.value
            : "Lokossa";

      const d = {
        dept: deptVal,
        commune: communeVal,
        cs:
          cs && cs.value
            ? cs.value
            : communeVal
              ? "CS " + communeVal
              : "CS LOKOSSA-2",
        zone:
          document.getElementById("zone") &&
          document.getElementById("zone").style.display !== "none"
            ? document.getElementById("zone").value
            : "1",
        ecole:
          document.getElementById("ecole") &&
          document.getElementById("ecole").style.display !== "none" &&
          document.getElementById("ecole").value
            ? document.getElementById("ecole").value
            : currentRole === "ddemp"
              ? "Direction Départementale"
              : currentRole === "ministere"
                ? "Niveau Central"
                : "Circonscription Scolaire",
        matricule: document.getElementById("matricule").value,
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        email: document.getElementById("email").value,
        contact: document.getElementById("contact").value,
        password: document.getElementById("password").value,
        signature: sigUrl,
        statut: "en_attente",
        date: new Date().toLocaleString(),
        derniereConnexion: "Jamais",
        role: currentRole,
      };

      try {
        let allInscriptions = JSON.parse(
          localStorage.getItem("toutes_inscriptions") || "[]",
        );
        allInscriptions.push(d);
        localStorage.setItem(
          "toutes_inscriptions",
          JSON.stringify(allInscriptions),
        );

        alert(
          "✅ Inscription réussie ! Votre demande a été transmise à votre supérieur hiérarchique direct.",
        );
        fermer("modal-inscription");
        formInscription.reset();
      } catch (err) {
        console.error(err);
        alert("⚠️ Une erreur est survenue lors de l'enregistrement.");
      }
    };

    if (signatureInput && signatureInput.files && signatureInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (event) {
        signatureDataUrl = event.target.result;
        enregistrerUtilisateur(signatureDataUrl);
      };
      reader.readAsDataURL(signatureInput.files[0]);
    } else {
      enregistrerUtilisateur("");
    }
  };
}

let currentUser = null;
const formConnexion = document.getElementById("form-connexion");
if (formConnexion) {
  formConnexion.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-pass").value;
    const momentConnexion = new Date().toLocaleString();

    if (email === "mikejuniormc3@gmail.com" && pass === "1234") {
      localStorage.setItem("admin_derniere_connexion", momentConnexion);
      currentUser = {
        nom: "ADMIN",
        prenom: "Ministère",
        email: email,
        contact: "+229 00000000",
        ecole: "Niveau Central",
        cs: "CS LOKOSSA-2",
        zone: "1",
        dept: "Niveau Central",
        role: "ministere",
        derniereConnexion: momentConnexion,
        signature: "",
      };

      document.getElementById("collab-nom").textContent =
        currentUser.nom + " " + currentUser.prenom;
      document.getElementById("collab-ecole").textContent = currentUser.ecole;
      document.getElementById("collab-derniere-connexion").textContent =
        `Dernière connexion : ${currentUser.derniereConnexion}`;

      fermer("modal-connexion");
      configurerEspace("ministere", "ESPACE MINISTÈRE");
      actualiserAffichageDernieresConnexions();
      return;
    }

    let valides = JSON.parse(
      localStorage.getItem("utilisateurs_valides") || "[]",
    );
    const found = valides.find(
      (u) => u.email === email && u.password === pass && u.role === currentRole,
    );
    if (found) {
      found.derniereConnexion = momentConnexion;
      localStorage.setItem("utilisateurs_valides", JSON.stringify(valides));

      currentUser = found;
      document.getElementById("collab-nom").textContent =
        found.nom + " " + found.prenom;
      document.getElementById("collab-ecole").textContent = found.ecole;
      document.getElementById("collab-derniere-connexion").textContent =
        `Dernière connexion : ${found.derniereConnexion}`;

      fermer("modal-connexion");
      configurerEspace(found.role, "ESPACE " + found.role.toUpperCase());
      actualiserAffichageDernieresConnexions();
    } else {
      alert(
        "Identifiants incorrects ou compte non encore validé par votre supérieur hiérarchique direct.",
      );
    }
  };
}

function actualiserAffichageDernieresConnexions() {
  let valides = JSON.parse(
    localStorage.getItem("utilisateurs_valides") || "[]",
  );
  const roles = ["collab", "directeur", "up", "cp", "ccs", "ddemp"];

  roles.forEach((r) => {
    let el = document.getElementById(`info-cnx-${r}`);
    if (el) {
      let user = valides
        .slice()
        .reverse()
        .find((u) => u.role === r);
      el.textContent = `Dernière cnx : ${user && user.derniereConnexion ? user.derniereConnexion : "Jamais"}`;
    }
  });

  let elMin = document.getElementById("info-cnx-ministere");
  if (elMin) {
    let adminCnx = localStorage.getItem("admin_derniere_connexion") || "Jamais";
    elMin.textContent = `Dernière cnx : ${adminCnx}`;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  actualiserAffichageDernieresConnexions,
);

function getNomChefCS(csNom, deptNom) {
  let valides = JSON.parse(
    localStorage.getItem("utilisateurs_valides") || "[]",
  );
  let ccs = valides.find(
    (u) => u.role === "ccs" && u.cs === csNom && u.dept === deptNom,
  );
  if (ccs) {
    return ccs.nom + " " + ccs.prenom;
  }
  return "Nom du C/CS";
}

function getTelephoneDDEMP(deptNom) {
  let valides = JSON.parse(
    localStorage.getItem("utilisateurs_valides") || "[]",
  );
  let ddemp = valides.find(
    (u) => u.role === "ddemp" && (!deptNom || u.dept === deptNom),
  );
  if (ddemp && ddemp.contact) {
    return ddemp.contact;
  }
  let anyDdemp = valides.find((u) => u.role === "ddemp");
  if (anyDdemp && anyDdemp.contact) {
    return anyDdemp.contact;
  }
  return currentUser && currentUser.contact ? currentUser.contact : "—";
}

function getInfosSignataireParRole(roleName, deptNom, csNom) {
  let valides = JSON.parse(
    localStorage.getItem("utilisateurs_valides") || "[]",
  );
  let u = valides.find(
    (item) =>
      item.role === roleName && item.dept === deptNom && item.cs === csNom,
  );
  if (u)
    return {
      nomPrenom: (u.nom || "") + " " + (u.prenom || ""),
      contact: u.contact || "N/A",
      signature: u.signature || "",
    };
  let anyU = valides.find((item) => item.role === roleName);
  if (anyU)
    return {
      nomPrenom: (anyU.nom || "") + " " + (anyU.prenom || ""),
      contact: anyU.contact || "N/A",
      signature: anyU.signature || "",
    };
  return { nomPrenom: "", contact: "", signature: "" };
}

const listePiecesOfficielles = [
  "CERTIFICAT DE TRAVAIL",
  "CERTIFICAT DE TRAVAIL (RETRAITE / DÉCÉDÉ)",
  "ATTESTATION D'EXONÉRATION (SCOLAIRE)",
  "ATTESTATION D'EXONÉRATION (DÉCÈS)",
  "ATTESTATION D'EXONÉRATION (RETRAITE)",
  "ATTESTATION DE SERVICE (RETRAITE PROBABLE)",
  "ATTESTATION DE PRÉSENCE AU POSTE (EN COURS)",
  "ATTESTATION DE PRÉSENCE AU POSTE (PÉRIODE DÉTERMINÉE)",
  "ATTESTATION DE PRÉSENCE AU POSTE (RETRAITE)",
  "ATTESTATION DE PRÉSENCE AU POSTE - DIRECTEUR (EN COURS)",
  "ATTESTATION DE PRÉSENCE AU POSTE - DIRECTEUR (VISÉ CS)",
  "ATTESTATION DE PRÉSENCE AU POSTE - DIRECTEUR (PÉRIODE DÉTERMINÉE)",
  "ATTESTATION DE PRÉSENCE AU POSTE - DIRECTEUR",
  "CERTIFICAT DE SERVICE FAIT - DIRECTEUR",
  "ATTESTATION DE DIRECTION",
  "CERTIFICAT DE PRISE DE SERVICE (AVEC REMPLACEMENT)",
  "CERTIFICAT DE PRISE DE SERVICE (SIMPLE)",
  "CERTIFICAT DE REPRISE DE SERVICE (APRÈS ABSENCE)",
  "CERTIFICAT DE PRISE DE SERVICE - ÉCOLE (AVEC AFFECTATION)",
  "CERTIFICAT DE PRISE DE SERVICE - ÉCOLE (VISÉ CS)",
  "FICHE D'ÉVALUATION ACE (SANS SUPÉRIEUR IMMÉDIAT - PARTIE 1)",
  "FICHE D'ÉVALUATION ACE (SANS SUPÉRIEUR IMMÉDIAT - PARTIE 2)",
  "FICHE D'ÉVALUATION ACE (AVEC SUPÉRIEUR IMMÉDIAT - PARTIE 1)",
  "FICHE D'ÉVALUATION ACE (AVEC SUPÉRIEUR IMMÉDIAT - PARTIE 2)",
  "DEMANDE ET BULLETIN DE VISITE MÉDICALE",
  "CERTIFICAT DE PRISE DE SERVICE - PRÉ-INSERTION PROFESSIONNELLE",
  "ATTESTATION DE PRÉSENCE AU POSTE (MULTI-POSTES - DIRECTEUR)",
  "ATTESTATION DE PRÉSENCE AU POSTE (MULTI-POSTES - CS)",
  "ATTESTATION DE PRÉSENCE AU POSTE - ÉCOLE PRIVÉE",
  "ATTESTATION D'ABSENCE DE SANCTION",
  "ATTESTATION DE PRÉSENCE AU POSTE (AVEC ARRIVÉE DÉPARTEMENT - CS)",
  "ATTESTATION DE PRÉSENCE AU POSTE (AVEC ARRIVÉE DÉPARTEMENT - ÉCOLE)",
  "IMPORTER MON CIP",
  "IMPORTER MON ACTE DE NAISSANCE",
  "IMPORTER MA PREMIÈRE PRISE DE SERVICE",
];

function initialiserCheckboxesPieces() {
  const container = document.getElementById("container-checkboxes-pieces");
  if (!container) return;
  container.innerHTML = listePiecesOfficielles
    .map(
      (piece, idx) => `
  <label class="check-item">
   <input type="checkbox" class="cb-piece" value="${idx + 1}" ${idx === 0 ? "checked" : ""}> ${idx + 1}. ${piece}
  </label>
 `,
    )
    .join("");
}
document.addEventListener("DOMContentLoaded", initialiserCheckboxesPieces);

function getFormHTML(
  id,
  nomExpediteur = "",
  ecoleExpediteur = "",
  csExpediteur = "",
  deptExpediteur = "",
  contactExpediteur = "",
  cachetSigne = false,
  signateurs = [],
  deptCourrier = "",
  csCourrier = "",
) {
  let num = parseInt(id);
  let titrePiece =
    listePiecesOfficielles[num - 1] || "PIÈCE ADMINISTRATIVE OFFICIELLE";
  let userCS =
    csExpediteur || (currentUser && currentUser.cs) || "CS LOKOSSA-2";
  let userDept = deptExpediteur || (currentUser && currentUser.dept) || "MONO";
  let userContact =
    contactExpediteur || (currentUser && currentUser.contact) || "";
  let telephoneDDEMP = getTelephoneDDEMP(userDept);
  let codeDept = userDept.substring(0, 4).toUpperCase();
  let codeCS = userCS.toLowerCase().replace(/\s+/g, "-");
  let nomChefCS = getNomChefCS(userCS, userDept);
  let lieuSignature = userCS.replace(/^CS\s+/i, "");
  let nomAgent =
    nomExpediteur ||
    (currentUser ? currentUser.nom + " " + currentUser.prenom : "");
  let matriculeAgent = currentUser ? currentUser.matricule || "" : "";
  let ecoleAgent = ecoleExpediteur || (currentUser ? currentUser.ecole : "");

  let signaturesHTML = "";
  if (signateurs && signateurs.length > 0) {
    let deptRef = deptCourrier || userDept;
    let csRef = csCourrier || userCS;

    signateurs.forEach((sigRole) => {
      let roleKey = sigRole.toLowerCase();
      let infosSignataire = getInfosSignataireParRole(roleKey, deptRef, csRef);
      let libelleSignataire = sigRole.toUpperCase();
      if (infosSignataire.signature) {
        signaturesHTML += `
     <div style="margin-top:15px; text-align:right;">
      <p style="font-weight:bold;">Le ${libelleSignataire},</p>
      <img src="${infosSignataire.signature}" alt="Signature" style="max-height:60px; max-width:150px; display:inline-block; margin-top:5px;">
      <p style="font-size:12px; margin-top:4px; font-weight:bold; color:#111;">${infosSignataire.nomPrenom} (Tél : ${infosSignataire.contact})</p>
     </div>
    `;
      }
    });
  }

  if (num >= 33) {
    return `<div class="page-container piece-container" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
   <div class="piece-title-banner" style="width:100%;">${titrePiece}</div>
   <div class="upload-box" style="width:100%; max-width:500px; margin:30px 0;">
    <p style="font-weight:bold; color:var(--bleu); margin-bottom:12px;">📁 ${titrePiece}</p>
    <p style="font-size:12px; color:#555; margin-bottom:15px;">Fichier numérique joint :</p>
    <p style="font-weight:bold; color:#111;">Document joint</p>
   </div>
   <div style="width:100%; text-align:left; margin-top:20px; font-size:12px;">
    <p><b>Agent :</b> ${nomAgent} (Matricule : ${matriculeAgent})</p>
    <p><b>Contact :</b> <input type="text" class="w-48 champ-form" data-label="Contact téléphonique" value="${userContact}"></p>
    <p><b>Structure :</b> ${ecoleAgent} — <b>CS :</b> ${userCS}</p>
   </div>
   ${signaturesHTML}
  </div>`;
  }

  let enteteMinisteriel = `
  <div class="piece-title-banner">${titrePiece}</div>
  <div class="flex justify-between items-start text-center mb-6 pb-4 border-b border-gray-300">
   <div class="text-xs text-left leading-tight font-serif">
    MINISTÈRE DES ENSEIGNEMENTS MATERNEL ET PRIMAIRE<br>
    <strong>CIRCONSCRIPTION SCOLAIRE DE ${lieuSignature.toUpperCase()}</strong><br>
    /${codeCS}/DDEMP-${codeDept}
   </div>
   <div class="text-xs text-right leading-tight font-serif">
    RÉPUBLIQUE DU BÉNIN<br>
    DIRECTION DÉPARTEMENTALE DU ${userDept.toUpperCase()}<br>
    Tél : ${telephoneDDEMP}
   </div>
  </div>
  <div class="text-right text-xs mb-6">N° <input type="text" class="w-24 champ-form" data-label="Numéro"> /${codeCS}/DDEMP-${codeDept}</div>
 `;

  if (num === 21 || num === 23) {
    return `<div class="page-container piece-container">
   <div class="piece-title-banner">${titrePiece}</div>
   <div class="text-center mb-4"><p class="text-xs">MINISTÈRE DES ENSEIGNEMENTS MATERNEL ET PRIMAIRE</p><p class="text-xs font-bold">RÉPUBLIQUE DU BÉNIN</p><p class="text-xs">DIRECTION DE L'ADMINISTRATION ET DES FINANCES</p></div>
   <h2 class="text-center font-bold text-base uppercase bg-gray-200 py-2 mb-4 rounded">FICHE D'ÉVALUATION DE L'AGENT CONTRACTUEL DE L'ÉTAT</h2>
   <div class="space-y-3 text-sm">
    <h3 class="font-bold bg-teal-50 text-teal-900 p-2 rounded border-l-4 border-teal-600">1. IDENTIFICATION DE L'AGENT</h3>
    <div class="grid grid-cols-2 gap-3">
     <p>Nom et prénoms : <input type="text" class="w-full champ-form champ-nom-agent" data-label="Nom et prénoms" value="${nomAgent}"></p>
     <p>Matricule : <input type="text" class="w-full champ-form" data-label="Matricule" value="${matriculeAgent}"></p>
     <p>Date et lieu de naissance : <input type="text" class="w-full champ-form" data-label="Date et lieu de naissance"></p>
     <p>Contact / Téléphone : <input type="text" class="w-full champ-form" data-label="Contact téléphonique" value="${userContact}"></p>
    </div>
   </div>
   ${signaturesHTML}
  </div>`;
  }

  return `<div class="page-container piece-container">
  ${enteteMinisteriel}
  <div class="space-y-4 text-justify leading-relaxed">
   <p>Le Chef de la Circonscription Scolaire de ${lieuSignature} soussigné, certifie que l<input type="text" class="w-8 champ-form" data-label="Genre"> nommé(e) <input type="text" class="w-64 champ-form champ-nom-agent" data-label="Nom et prénoms" value="${nomAgent}">,</p>
   <div class="grid grid-cols-3 gap-4">
    <p>Matricule : <input type="text" class="w-32 champ-form" data-label="Matricule" value="${matriculeAgent}"></p>
    <p>Corps : <input type="text" class="w-32 champ-form" data-label="Corps"></p>
    <p>Grade : <input type="text" class="w-32 champ-form" data-label="Grade"></p>
   </div>
   <p>Contact téléphonique : <input type="text" class="w-48 champ-form" data-label="Contact téléphonique" value="${userContact}"></p>
   <p>en service à <input type="text" class="w-64 champ-form" data-label="Structure/École" value="${ecoleAgent}"> en qualité de <input type="text" class="w-48 champ-form" data-label="Fonction"> suivant le titre d'affectation N° <input type="text" class="w-28 champ-form" data-label="N° Affectation"> du <input type="date" class="w-32 champ-form" data-label="Date Affectation"> depuis le <input type="date" class="w-32 champ-form" data-label="Date début"> jusqu'à ce jour.</p>
   <p class="pt-6">En foi de quoi le présent document lui est délivré pour servir et valoir ce que de droit.</p>
  </div>
  <div class="mt-12 flex justify-between items-end text-xs">
   <div><p class="font-semibold text-gray-700">CIRCONSCRIPTION SCOLAIRE DE ${lieuSignature.toUpperCase()}</p></div>
   <div class="text-right">
    <p>Fait à ${lieuSignature}, le <input type="date" class="w-36 champ-form" data-label="Date de signature"></p>
    <p class="font-bold mt-2">Le Chef de la Circonscription Scolaire,</p>
    <div class="h-16"></div>
    <p class="font-bold"><b>${nomChefCS}</b></p>
    ${signaturesHTML}
   </div>
  </div>
 </div>`;
}

function constituerDossier() {
  let checkedPieces = document.querySelectorAll(".cb-piece:checked");
  if (checkedPieces.length === 0) {
    alert("Cochez au moins une pièce officielle ou justificative.");
    return;
  }

  document.getElementById("dossier-nom").textContent = currentUser
    ? currentUser.nom + " " + currentUser.prenom
    : "";
  let html = "";
  checkedPieces.forEach((cb) => {
    html += getFormHTML(cb.value);
  });
  html += `<div class="form-section max-w-[210mm] mx-auto mt-6 shadow-md" style="border:2px solid var(--jaune);background:#fffbe6"><h3>📝 Notes complémentaires</h3><label>Commentaires</label><textarea id="autre-info-d" class="champ-form" data-label="Commentaires complémentaires" placeholder="Ajoutez des précisions..."></textarea></div>`;
  html += `<div style="text-align:center;margin-top:20px"><button class="btn-principal" style="width:auto;padding:12px 30px" onclick="envoyerToutDossier()">📤 Transmettre le dossier officiel (${checkedPieces.length} pièces)</button></div>`;

  document.getElementById("contenu-dossier").innerHTML = html;
  allerPage("page-dossier");
}

function envoyerPiece(type) {
  let checkedCheckboxes = document.querySelectorAll(".cb-piece:checked");
  let indicesPieces = [];
  checkedCheckboxes.forEach((cb) => {
    indicesPieces.push(cb.value);
  });
  if (indicesPieces.length === 0) indicesPieces.push("1");

  let piecesEnvoyees = [];
  checkedCheckboxes.forEach((cb) => {
    let idx = parseInt(cb.value) - 1;
    piecesEnvoyees.push(listePiecesOfficielles[idx] || "Pièce officielle");
  });
  if (piecesEnvoyees.length === 0) piecesEnvoyees.push(type);

  let nomSaisiSurPiece = currentUser
    ? currentUser.nom + " " + currentUser.prenom
    : "Expéditeur";
  let inputNomField = document.querySelector(".champ-nom-agent");
  if (inputNomField && inputNomField.value.trim() !== "") {
    nomSaisiSurPiece = inputNomField.value.trim();
  }

  let detailsRemplis = [];
  document.querySelectorAll(".champ-form").forEach((el) => {
    let label = el.getAttribute("data-label") || "Champ";
    let valeur =
      el.value ||
      (el.files && el.files[0] ? el.files[0].name : "Non renseigné");
    detailsRemplis.push(`<b>${label} :</b> ${valeur}`);
  });

  let roleCible = "directeur";
  let labelDestinataire = "au Directeur";

  if (currentRole === "collab") {
    roleCible = "directeur";
    labelDestinataire = "au Directeur d'école";
  } else if (currentRole === "directeur") {
    roleCible = "ccs";
    labelDestinataire = "au Chef de la Circonscription Scolaire (C/CS)";
  } else if (currentRole === "up") {
    roleCible = "cp";
    labelDestinataire = "au Conseiller Pédagogique (CP)";
  } else if (currentRole === "cp") {
    roleCible = "ccs";
    labelDestinataire = "au Chef de Circonscription (C/CS)";
  } else if (currentRole === "ccs") {
    roleCible = "ddemp";
    labelDestinataire = "à la Direction Départementale (DDEMP)";
  } else if (currentRole === "ddemp") {
    roleCible = "ministere";
    labelDestinataire = "au Ministère";
  }

  const p = {
    type: type,
    indicesPieces: indicesPieces,
    nomsPieces: piecesEnvoyees.join(", "),
    ecole: currentUser.ecole,
    matricule: currentUser.matricule || "N/A",
    nom: nomSaisiSurPiece,
    emailOwner: currentUser.email,
    contact: currentUser.contact,
    date: new Date().toLocaleString(),
    role: currentRole,
    dept: currentUser.dept,
    cs: currentUser.cs,
    zone: currentUser.zone,
    roleActuel: roleCible,
    destinataireSpecifiqueEmail: null,
    cachetApposeParPiece: {},
    signateursParPiece: {},
    remarquesPieces: {},
    traiteEtClasse: false,
    historiqueTraitements: [],
    details: detailsRemplis.join("<br>"),
  };

  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");
  allCourriers.push(p);
  localStorage.setItem("tous_courriers", JSON.stringify(allCourriers));

  alert(`✅ Votre document a été transmis avec succès ${labelDestinataire}.`);
}

function envoyerToutDossier() {
  envoyerPiece("Dossier officiel de pièces & justificatifs");
  allerPage("page-mon-espace");
}

const courrierFlow = ["collab", "directeur", "cp", "ccs", "ddemp", "ministere"];

function getNextRole(currentRoleName) {
  if (currentRoleName === "directeur") return "ccs";
  let idx = courrierFlow.indexOf(currentRoleName);
  if (idx >= 0 && idx < courrierFlow.length - 1) {
    return courrierFlow[idx + 1];
  }
  return "cloture";
}

function afficherFormulaireRenvoiPiece(pieceIdx, courantIdx) {
  const divBox = document.getElementById(
    `renvoi-box-${courantIdx}-${pieceIdx}`,
  );
  if (!divBox) return;

  if (!divBox.classList.contains("hidden")) {
    divBox.classList.add("hidden");
    return;
  }

  document
    .querySelectorAll(".box-renvoi")
    .forEach((b) => b.classList.add("hidden"));

  let optionsHTML = "";
  if (currentUser.role === "ministere") {
    optionsHTML += `
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="collab"> 1. Un enseignant adjoint</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="directeur"> 2. Un directeur</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="cp"> 3. Un CP</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="ccs"> 4. Un C/CS</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="ddemp"> 5. Un DDEMP</label>
  `;
  } else if (currentUser.role === "ddemp") {
    optionsHTML += `
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="collab"> 1. Un enseignant adjoint</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="directeur"> 2. Un directeur</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="cp"> 3. Un CP</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="ccs"> 4. Un C/CS</label>
  `;
  } else if (currentUser.role === "ccs") {
    optionsHTML += `
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="collab"> 1. Un enseignant adjoint</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="directeur"> 2. Un directeur</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="cp"> 3. Un CP</label>
  `;
  } else if (currentUser.role === "cp") {
    optionsHTML += `
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="collab"> 1. Un enseignant adjoint</label>
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="directeur"> 2. Un directeur</label>
  `;
  } else if (currentUser.role === "directeur") {
    optionsHTML += `
   <label class="check-item"><input type="radio" name="dest-renvoi-${courantIdx}-${pieceIdx}" value="collab"> 1. Un enseignant adjoint</label>
  `;
  }

  divBox.innerHTML = `
  <p style="font-size:12px; font-weight:bold; color:var(--bleu); margin-bottom:8px;">🔄 Choisir le destinataire du renvoi pour cette pièce :</p>
  <div class="check-grid" style="margin:5px 0;">
   ${optionsHTML}
  </div>
  <button onclick="confirmerRenvoiPiece(${pieceIdx}, ${courantIdx})" class="btn-small" style="background:var(--rouge); margin-top:8px;">Confirmer le renvoi de cette pièce</button>
 `;

  divBox.classList.remove("hidden");
}

function confirmerRenvoiPiece(pieceIdx, courantIdx) {
  const selected = document.querySelector(
    `input[name="dest-renvoi-${courantIdx}-${pieceIdx}"]:checked`,
  );
  if (!selected) {
    alert("Veuillez sélectionner un destinataire pour le renvoi.");
    return;
  }

  const roleDestinataire = selected.value;
  const remarqueInput = document.getElementById(
    `remarque-input-${courantIdx}-${pieceIdx}`,
  );
  const remarqueValeur = remarqueInput ? remarqueInput.value.trim() : "";

  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");
  let mesCourriers = getMesCourriersActuels(allCourriers);
  let cible = mesCourriers[courantIdx];

  let pieceNomConcerne =
    cible.indicesPieces && cible.indicesPieces[pieceIdx]
      ? listePiecesOfficielles[parseInt(cible.indicesPieces[pieceIdx]) - 1]
      : "Pièce";

  let destinataireEmailCible = null;
  if (roleDestinataire === "collab") {
    destinataireEmailCible = cible.emailOwner;
  }

  let existingCachets = cible.cachetApposeParPiece
    ? { ...cible.cachetApposeParPiece }
    : {};
  let existingSignateurs = cible.signateursParPiece
    ? { ...cible.signateursParPiece }
    : {};

  if (existingCachets[pieceIdx]) {
    if (!existingSignateurs[pieceIdx]) existingSignateurs[pieceIdx] = [];
    if (
      !existingSignateurs[pieceIdx].includes(currentUser.role.toUpperCase())
    ) {
      existingSignateurs[pieceIdx].push(currentUser.role.toUpperCase());
    }
  }

  const nouvellePieceSeule = {
    type: cible.type,
    indicesPieces: [cible.indicesPieces[pieceIdx]],
    nomsPieces: pieceNomConcerne,
    ecole: cible.ecole,
    matricule: cible.matricule,
    nom: cible.nom,
    emailOwner: cible.emailOwner,
    contact: cible.contact,
    date: new Date().toLocaleString(),
    role: currentUser.role,
    dept: cible.dept,
    cs: cible.cs,
    zone: cible.zone,
    roleActuel: roleDestinataire,
    destinataireSpecifiqueEmail: destinataireEmailCible,
    cachetApposeParPiece: { 0: existingCachets[pieceIdx] || false },
    signateursParPiece: { 0: existingSignateurs[pieceIdx] || [] },
    remarquesPieces: { 0: remarqueValeur },
    auteurRemarqueRole: currentUser.role,
    traiteEtClasse: false,
    historiqueTraitements: [
      {
        role: currentUser.role,
        action: `renvoye_piece_seule_a_${roleDestinataire}`,
        date: new Date().toLocaleString(),
      },
    ],
    details: cible.details,
  };

  allCourriers.push(nouvellePieceSeule);
  localStorage.setItem("tous_courriers", JSON.stringify(allCourriers));
  alert(
    `🔄 Pièce renvoyée individuellement avec succès à ${roleDestinataire.toUpperCase()} !`,
  );
  ouvrirBoiteCourriersPleinEcran();
}

function transmettreAuteurRemarque(pieceIdx, courantIdx) {
  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");
  let mesCourriers = getMesCourriersActuels(allCourriers);
  let cible = mesCourriers[courantIdx];

  let roleDestinataire = cible.auteurRemarqueRole || "directeur";
  let pieceNomConcerne =
    cible.indicesPieces && cible.indicesPieces[pieceIdx]
      ? listePiecesOfficielles[parseInt(cible.indicesPieces[pieceIdx]) - 1]
      : "Pièce";

  let existingCachets = cible.cachetApposeParPiece
    ? { ...cible.cachetApposeParPiece }
    : {};
  let existingSignateurs = cible.signateursParPiece
    ? { ...cible.signateursParPiece }
    : {};

  if (existingCachets[pieceIdx]) {
    if (!existingSignateurs[pieceIdx]) existingSignateurs[pieceIdx] = [];
    if (
      !existingSignateurs[pieceIdx].includes(currentUser.role.toUpperCase())
    ) {
      existingSignateurs[pieceIdx].push(currentUser.role.toUpperCase());
    }
  }

  const nouvellePieceSeule = {
    type: cible.type,
    indicesPieces: [cible.indicesPieces[pieceIdx]],
    nomsPieces: pieceNomConcerne,
    ecole: cible.ecole,
    matricule: cible.matricule,
    nom: cible.nom,
    emailOwner: cible.emailOwner,
    contact: cible.contact,
    date: new Date().toLocaleString(),
    role: currentUser.role,
    dept: cible.dept,
    cs: cible.cs,
    zone: cible.zone,
    roleActuel: roleDestinataire,
    destinataireSpecifiqueEmail: null,
    cachetApposeParPiece: { 0: existingCachets[pieceIdx] || false },
    signateursParPiece: { 0: existingSignateurs[pieceIdx] || [] },
    remarquesPieces: {},
    traiteEtClasse: false,
    historiqueTraitements: [
      {
        role: currentUser.role,
        action: `transmis_auteur_remarque_${roleDestinataire}`,
        date: new Date().toLocaleString(),
      },
    ],
    details: cible.details,
  };

  allCourriers.push(nouvellePieceSeule);
  localStorage.setItem("tous_courriers", JSON.stringify(allCourriers));
  alert(
    `📤 Courrier transmis avec succès à l'auteur de la remarque (${roleDestinataire.toUpperCase()}) !`,
  );
  ouvrirBoiteCourriersPleinEcran();
}

function apposerCachetPieceUnique(pieceIdx, courantIdx) {
  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");
  let mesCourriers = getMesCourriersActuels(allCourriers);
  let cible = mesCourriers[courantIdx];

  allCourriers.forEach((it) => {
    if (it.date === cible.date && it.matricule === cible.matricule) {
      if (!it.cachetApposeParPiece) it.cachetApposeParPiece = {};
      it.cachetApposeParPiece[pieceIdx] = true;

      if (!it.signateursParPiece) it.signateursParPiece = {};
      if (!it.signateursParPiece[pieceIdx])
        it.signateursParPiece[pieceIdx] = [];
      if (
        !it.signateursParPiece[pieceIdx].includes(
          currentUser.role.toUpperCase(),
        )
      ) {
        it.signateursParPiece[pieceIdx].push(currentUser.role.toUpperCase());
      }
    }
  });

  localStorage.setItem("tous_courriers", JSON.stringify(allCourriers));
  alert(
    "🔏 Cachet et signature électronique apposés avec succès sur cette pièce !",
  );
  ouvrirVisualisationPiece(cible.date, cible.matricule);
}

function transmettrePieceUnique(pieceIdx, courantIdx) {
  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");
  let mesCourriers = getMesCourriersActuels(allCourriers);
  let cible = mesCourriers[courantIdx];

  let currentSignateurs =
    cible.signateursParPiece && cible.signateursParPiece[pieceIdx]
      ? [...cible.signateursParPiece[pieceIdx]]
      : [];
  if (!currentSignateurs.includes(currentUser.role.toUpperCase())) {
    currentSignateurs.push(currentUser.role.toUpperCase());
  }

  let nextRole = getNextRole(currentUser.role);
  let pieceNomConcerne =
    cible.indicesPieces && cible.indicesPieces[pieceIdx]
      ? listePiecesOfficielles[parseInt(cible.indicesPieces[pieceIdx]) - 1]
      : "Pièce";

  const nouvellePieceSeule = {
    type: cible.type,
    indicesPieces: [cible.indicesPieces[pieceIdx]],
    nomsPieces: pieceNomConcerne,
    ecole: cible.ecole,
    matricule: cible.matricule,
    nom: cible.nom,
    emailOwner: cible.emailOwner,
    contact: cible.contact,
    date: new Date().toLocaleString(),
    role: currentUser.role,
    dept: cible.dept,
    cs: cible.cs,
    zone: cible.zone,
    roleActuel: nextRole,
    destinataireSpecifiqueEmail: null,
    cachetApposeParPiece: {
      0:
        (cible.cachetApposeParPiece && cible.cachetApposeParPiece[pieceIdx]) ||
        true,
    },
    signateursParPiece: { 0: currentSignateurs },
    remarquesPieces: {},
    traiteEtClasse: false,
    historiqueTraitements: [
      {
        role: currentUser.role,
        action: `transmis_piece_seule_a_${nextRole}`,
        date: new Date().toLocaleString(),
      },
    ],
    details: cible.details,
  };

  allCourriers.push(nouvellePieceSeule);
  localStorage.setItem("tous_courriers", JSON.stringify(allCourriers));
  alert(
    "📤 Pièce transmise individuellement avec succès au niveau supérieur !",
  );
  ouvrirVisualisationPiece(cible.date, cible.matricule);
}

function archiverPieceUnique(pieceIdx, courantIdx) {
  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");
  let mesCourriers = getMesCourriersActuels(allCourriers);
  let cible = mesCourriers[courantIdx];

  let currentSignateurs =
    cible.signateursParPiece && cible.signateursParPiece[pieceIdx]
      ? [...cible.signateursParPiece[pieceIdx]]
      : [];
  if (!currentSignateurs.includes(currentUser.role.toUpperCase())) {
    currentSignateurs.push(currentUser.role.toUpperCase());
  }
  let isSigne =
    (cible.cachetApposeParPiece && cible.cachetApposeParPiece[pieceIdx]) ||
    false;

  let pieceNomConcerne =
    cible.indicesPieces && cible.indicesPieces[pieceIdx]
      ? listePiecesOfficielles[parseInt(cible.indicesPieces[pieceIdx]) - 1]
      : "Pièce";

  const nouvellePieceSeule = {
    type: cible.type,
    indicesPieces: [cible.indicesPieces[pieceIdx]],
    nomsPieces: pieceNomConcerne,
    ecole: cible.ecole,
    matricule: cible.matricule,
    nom: cible.nom,
    emailOwner: cible.emailOwner,
    contact: cible.contact,
    date: new Date().toLocaleString(),
    role: currentUser.role,
    dept: cible.dept,
    cs: cible.cs,
    zone: cible.zone,
    roleActuel: "archive",
    destinataireSpecifiqueEmail: null,
    cachetApposeParPiece: { 0: isSigne },
    signateursParPiece: { 0: currentSignateurs },
    remarquesPieces: {},
    traiteEtClasse: true,
    historiqueTraitements: [
      {
        role: currentUser.role,
        action: "archive_piece_seule",
        date: new Date().toLocaleString(),
      },
    ],
    details: cible.details,
  };

  allCourriers.push(nouvellePieceSeule);

  // Marquer comme traité sans supprimer de chez l'expéditeur
  allCourriers.forEach((it) => {
    if (
      it.date === cible.date &&
      it.matricule === cible.matricule &&
      it.roleActuel === currentUser.role
    ) {
      it.traiteEtClasse = true;
    }
  });

  localStorage.setItem("tous_courriers", JSON.stringify(allCourriers));
  alert(
    "📦 Pièce archivée individuellement avec succès dans la Bibliothèque !",
  );
  ouvrirBoiteCourriersPleinEcran();
}

function telechargerCourrierDirect(dateInit, matriculeInit) {
  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");
  const c = allCourriers.find(
    (item) => item.date === dateInit && item.matricule === matriculeInit,
  );
  if (!c) return;

  let formulairesHtmlComplet = "";
  let indices = c.indicesPieces || ["1"];

  indices.forEach((numPiece, pIdx) => {
    let estSignePiece =
      (c.cachetApposeParPiece && c.cachetApposeParPiece[pIdx]) || false;
    let signateursPiece =
      (c.signateursParPiece && c.signateursParPiece[pIdx]) || [];
    let formulaireHtml = getFormHTML(
      numPiece,
      c.nom,
      c.ecole,
      c.cs,
      c.dept,
      c.contact,
      estSignePiece,
      signateursPiece,
      c.dept,
      c.cs,
    );
    let remarqueExistante =
      c.remarquesPieces && c.remarquesPieces[pIdx]
        ? c.remarquesPieces[pIdx]
        : "";

    let blocRemarque =
      remarqueExistante !== ""
        ? `
   <div style="background:#fff8dc; border:1px solid #f9ca24; padding:10px; border-radius:6px; margin-bottom:15px; font-size:12px; color:#856404; font-weight:bold;">
    💬 Remarque de votre supérieur pour cette pièce : ${remarqueExistante}
   </div>
  `
        : "";

    let blocCachet = estSignePiece
      ? `
   <div style="border:2px dashed #079992; padding:10px; margin-top:10px; background:#f0fff4; font-size:11px; text-align:center; border-radius:6px; color:#079992; font-weight:bold;">
    ✅ Signé pour cette pièce (${signateursPiece.join(" ➔ ")})
   </div>
  `
      : "";

    formulairesHtmlComplet += `
   <div style="margin-bottom:40px; border-bottom:2px dashed #cbd5e1; padding-bottom:30px;">
    ${blocRemarque}
    ${formulaireHtml}
    ${blocCachet}
   </div>
  `;
  });

  const contenuHTML = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
   <meta charset="UTF-8">
   <title>${c.type} - ${c.nom}</title>
   <script src="https://cdn.tailwindcss.com"></script>
   <style>
    body { font-family: "Times New Roman", Times, serif; padding: 20px; background: #eef2f7; color: #111; }
    .page-container { width: 100%; max-width: 210mm; padding: 15mm; margin: 10mm auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; }
    .piece-title-banner { background: #0a3d62; color: white; text-align: center; padding: 10px; font-size: 15px; font-weight: bold; text-transform: uppercase; border-radius: 8px; margin-bottom: 20px; }
   </style>
  </head>
  <body>
   <div style="max-width:210mm; margin:0 auto; background:white; padding:30px; border-radius:12px;">
    <div style="border-bottom:2px solid #f9ca24; padding-bottom:15px; margin-bottom:20px;">
     <h3 style="color:#0a3d62; font-size:18px;">📄 Document officiel : ${c.nomsPieces || c.type}</h3>
     <p style="font-size:13px; color:#555;">Expéditeur : <b>${c.nom}</b> (Matricule : ${c.matricule}) — Entité : ${c.ecole}</p>
    </div>
    ${formulairesHtmlComplet}
   </div>
  </body>
  </html>
 `;

  const blob = new Blob([contenuHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${c.type.replace(/\s+/g, "_")}_${c.nom.replace(/\s+/g, "_")}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getMesCourriersActuels(allCourriers) {
  let result = allCourriers.filter((item) => {
    if (item.traiteEtClasse) return false;
    if (currentUser.role === "ministere") {
      return item.roleActuel === "ministere" && item.role !== "ministere";
    } else if (currentUser.role === "ddemp") {
      return (
        item.dept === currentUser.dept &&
        item.roleActuel === "ddemp" &&
        item.role !== "ministere"
      );
    } else if (currentUser.role === "collab") {
      return (
        item.roleActuel === "collab" &&
        (item.emailOwner === currentUser.email ||
          item.destinataireSpecifiqueEmail === currentUser.email)
      );
    } else {
      return (
        item.dept === currentUser.dept &&
        item.cs === currentUser.cs &&
        item.roleActuel === currentUser.role
      );
    }
  });
  return result.reverse();
}

function toggleDossierCollaborateur(idDossier) {
  const el = document.getElementById(idDossier);
  if (el) el.style.display = el.style.display === "none" ? "block" : "none";
}

function ouvrirVisualisationPiece(dateInit, matriculeInit) {
  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");
  const o = allCourriers.find(
    (item) => item.date === dateInit && item.matricule === matriculeInit,
  );
  if (!o) return;

  document.getElementById("visu-titre-piece").textContent =
    `${o.nomsPieces || o.type} - Envoyé par ${o.nom}`;

  let indexTrouve = 0;
  let mesCourriers = getMesCourriersActuels(allCourriers);
  mesCourriers.forEach((item, idx) => {
    if (item.date === dateInit && item.matricule === matriculeInit)
      indexTrouve = idx;
  });

  let formulairesRecusHTML = "";
  let indices = o.indicesPieces || ["1"];

  indices.forEach((numPiece, pIdx) => {
    let signateursPiece =
      (o.signateursParPiece && o.signateursParPiece[pIdx]) || [];
    let estSignePiece =
      (o.cachetApposeParPiece && o.cachetApposeParPiece[pIdx]) ||
      signateursPiece.length > 0;

    let formulaireHtml = getFormHTML(
      numPiece,
      o.nom,
      o.ecole,
      o.cs,
      o.dept,
      o.contact,
      estSignePiece,
      signateursPiece,
      o.dept,
      o.cs,
    );
    let remarqueExistante =
      o.remarquesPieces && o.remarquesPieces[pIdx]
        ? o.remarquesPieces[pIdx]
        : "";

    let blocRemarqueAffichage =
      remarqueExistante !== ""
        ? `
   <div class="remarque-box">
    💬 <b>Remarque de votre supérieur pour cette pièce :</b> ${remarqueExistante}
   </div>
  `
        : "";

    let blocCachetPiece = estSignePiece
      ? `
   <div class="cachet-box" style="margin-top:10px;">
    ✅ Signé pour cette pièce (${signateursPiece.join(" ➔ ")})
   </div>
  `
      : "";

    let boutonApposerCachetHTML =
      currentUser.role !== "collab"
        ? `
   <button onclick="apposerCachetPieceUnique(${pIdx}, ${indexTrouve})" class="btn-small" style="background:var(--vert)">🔏 Apposer cachet & signature</button>
  `
        : "";

    let boutonTransmettreAuteurRemarqueHTML =
      remarqueExistante !== ""
        ? `
   <button onclick="transmettreAuteurRemarque(${pIdx}, ${indexTrouve})" class="btn-small" style="background:var(--rouge)">📤 Transmettre à l'auteur de la remarque</button>
  `
        : "";

    let boutonsPieceHTML = `
   <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:12px; border-radius:8px; margin-bottom:25px; display:flex; flex-direction:column; gap:10px;">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
     <b style="color:var(--bleu); font-size:13px;">Actions pour cette pièce :</b>
     <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
      <button onclick="telechargerCourrierDirect('${o.date}', '${o.matricule}')" class="btn-small" style="background:var(--vert)">📥 Télécharger</button>
      ${boutonApposerCachetHTML}
      ${boutonTransmettreAuteurRemarqueHTML}
      ${currentUser.role !== "collab" ? `<button onclick="transmettrePieceUnique(${pIdx}, ${indexTrouve})" class="btn-small" style="background:#1e3799">📤 Transmettre</button>` : ""}
      <button onclick="archiverPieceUnique(${pIdx}, ${indexTrouve})" class="btn-small" style="background:#2d3748">📦 Archivé</button>
      ${currentUser.role !== "collab" ? `<button onclick="afficherFormulaireRenvoiPiece(${pIdx}, ${indexTrouve})" class="btn-small" style="background:var(--rouge)">🔄 Renvoyer à...</button>` : ""}
     </div>
    </div>
    
    ${
      currentUser.role !== "collab"
        ? `
     <div>
      <label style="font-size:11px; font-weight:bold; color:var(--bleu); margin-bottom:3px;">💬 Remarque (optionnelle) pour le renvoi de cette pièce :</label>
      <input type="text" id="remarque-input-${indexTrouve}-${pIdx}" placeholder="Saisir une remarque pour le destinataire..." style="background:white; border:1px solid #ccc; padding:6px 10px; font-size:12px;">
     </div>
    `
        : ""
    }

    <div id="renvoi-box-${indexTrouve}-${pIdx}" class="box-renvoi hidden"></div>
   </div>
  `;

    formulairesRecusHTML += `
   <div style="margin-bottom:40px; border-bottom:3px dashed #cbd5e1; padding-bottom:20px;">
    ${blocRemarqueAffichage}
    ${formulaireHtml}
    ${blocCachetPiece}
    ${boutonsPieceHTML}
   </div>
  `;
  });

  let html = `
  <div style="max-width:210mm; margin:0 auto; background:white; padding:30px; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.1);">
   <div style="border-bottom:2px solid var(--jaune); padding-bottom:15px; margin-bottom:20px;">
    <h3 style="color:var(--bleu); font-size:18px;">📄 Dossier de pièces reçues : ${o.nomsPieces || o.type}</h3>
    <p style="font-size:13px; color:#555;">Expéditeur : <b>${o.nom}</b> (Matricule : ${o.matricule}) — Entité : ${o.ecole}</p>
   </div>

   <div>
    ${formulairesRecusHTML}
   </div>
  </div>
 `;

  document.getElementById("contenu-visualisation-piece").innerHTML = html;
  allerPage("page-visualisation-piece");
}

function ouvrirBoiteCourriersPleinEcran() {
  if (!currentUser) return;

  document.getElementById("boite-user-nom").textContent =
    `${currentUser.nom} ${currentUser.prenom} (${currentUser.role.toUpperCase()})`;

  let allInscriptions = JSON.parse(
    localStorage.getItem("toutes_inscriptions") || "[]",
  );
  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");

  let mesInscriptions = allInscriptions
    .filter((item) => {
      if (item.statut !== "en_attente") return false;
      if (currentUser.role === "ministere") return item.role === "ddemp";
      else if (currentUser.role === "ddemp")
        return item.dept === currentUser.dept && item.role === "ccs";
      else if (currentUser.role === "ccs")
        return (
          item.dept === currentUser.dept &&
          item.cs === currentUser.cs &&
          item.role === "cp"
        );
      else if (currentUser.role === "cp")
        return (
          item.dept === currentUser.dept &&
          item.cs === currentUser.cs &&
          (item.role === "directeur" || item.role === "up")
        );
      else if (currentUser.role === "up")
        return (
          item.dept === currentUser.dept &&
          item.cs === currentUser.cs &&
          item.role === "directeur"
        );
      else if (currentUser.role === "directeur")
        return (
          item.dept === currentUser.dept &&
          item.cs === currentUser.cs &&
          item.ecole === currentUser.ecole &&
          item.role === "collab"
        );
      return false;
    })
    .reverse();

  let mesCourriersActuels = getMesCourriersActuels(allCourriers);

  const container = document.getElementById(
    "contenu-boite-courriers-plein-ecran",
  );
  let html = "";

  if (currentUser.role !== "collab" && mesInscriptions.length > 0) {
    html += `<h3 style="color:var(--bleu);margin-bottom:12px;border-bottom:2px solid var(--jaune);padding-bottom:5px;">📝 Demandes d'inscription en attente (${mesInscriptions.length})</h3>`;
    html += mesInscriptions
      .map(
        (o, i) => `
   <div class="demande-card">
    <div>
     <b>👤 [${o.role.toUpperCase()}] ${o.nom} ${o.prenom}</b> (${o.matricule}) — Contact : ${o.contact || "N/A"}<br>
     <small>Entité : ${o.ecole} — Zone : ${o.zone} — CS : ${o.cs} — Reçu le : ${o.date}</small>
    </div>
    <div>
     <button onclick="validerInscription(${i})" class="btn-small" style="background:var(--vert)">✅ Valider l'inscription</button>
    </div>
   </div>
  `,
      )
      .join("");
  }

  html += `<h3 style="color:var(--bleu);margin:20px 0 12px;border-bottom:2px solid var(--jaune);padding-bottom:5px;">📥 Pièces reçues et courriers actuels (${mesCourriersActuels.length})</h3>`;

  if (mesCourriersActuels.length === 0) {
    html +=
      '<p style="color:#666;font-size:13px;margin-bottom:25px;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #eee">Aucun courrier dans la boîte de réception.</p>';
  } else {
    // Classement hiérarchique pour le DDEMP et le Ministère
    if (currentUser.role === "ddemp") {
      let groupParCS = {};
      mesCourriersActuels.forEach((o) => {
        let csNom = o.cs || "CS non spécifiée";
        if (!groupParCS[csNom]) groupParCS[csNom] = {};
        let ecoleNom = o.ecole || "École non spécifiée";
        if (!groupParCS[csNom][ecoleNom]) groupParCS[csNom][ecoleNom] = [];
        groupParCS[csNom][ecoleNom].push(o);
      });

      for (let csNom in groupParCS) {
        html += `<div style="margin-bottom:20px; border:1px solid #cbd5e1; border-radius:8px; padding:15px; background:#f8fafc;">`;
        html += `<h4 style="color:var(--bleu); font-size:15px; border-bottom:2px solid var(--vert); padding-bottom:5px; margin-bottom:10px;">📋 Circonscription : ${csNom}</h4>`;

        for (let ecoleNom in groupParCS[csNom]) {
          html += `<div style="margin-left:15px; margin-bottom:12px;">`;
          html += `<h5 style="color:#1e3799; font-size:13px; font-weight:bold; margin-bottom:6px;">🏫 École / Entité : ${ecoleNom}</h5>`;

          groupParCS[csNom][ecoleNom].forEach((o) => {
            let hasRemarque =
              o.remarquesPieces &&
              Object.values(o.remarquesPieces).some(
                (rem) => rem && rem.trim() !== "",
              );
            html += `
       <div class="demande-card" style="cursor:pointer; border-left:5px solid var(--vert); margin-left:15px;" onclick="ouvrirVisualisationPiece('${o.date}', '${o.matricule}')">
        <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
         <div>
          <b style="font-size:14px; color:var(--bleu);">📄 ${o.nomsPieces || o.type}</b>
          ${hasRemarque ? `<span class="badge" style="background:var(--jaune); color:black; margin-left:5px;">💬 Remarque reçue</span>` : ""}<br>
          <small style="color:#333;">Expéditeur : <b>${o.nom}</b> (Matricule : ${o.matricule}) — Reçu le : ${o.date}</small>
         </div>
         <div>
          <span class="btn-small" style="background:var(--vert)">🔍 Ouvrir</span>
         </div>
        </div>
       </div>
      `;
          });
          html += `</div>`;
        }
        html += `</div>`;
      }
    } else if (currentUser.role === "ministere") {
      let groupParDept = {};
      mesCourriersActuels.forEach((o) => {
        let deptNom = o.dept || "Département non spécifié";
        if (!groupParDept[deptNom]) groupParDept[deptNom] = {};
        let csNom = o.cs || "CS non spécifiée";
        if (!groupParDept[deptNom][csNom]) groupParDept[deptNom][csNom] = {};
        let ecoleNom = o.ecole || "École non spécifiée";
        if (!groupParDept[deptNom][csNom][ecoleNom])
          groupParDept[deptNom][csNom][ecoleNom] = [];
        groupParDept[deptNom][csNom][ecoleNom].push(o);
      });

      for (let deptNom in groupParDept) {
        html += `<div style="margin-bottom:25px; border:2px solid var(--jaune); border-radius:10px; padding:18px; background:#fffbe6;">`;
        html += `<h3 style="color:var(--bleu); font-size:16px; border-bottom:2px solid var(--bleu); padding-bottom:6px; margin-bottom:12px;">🏛️ Département : ${deptNom}</h3>`;

        for (let csNom in groupParDept[deptNom]) {
          html += `<div style="margin-left:15px; margin-bottom:15px;">`;
          html += `<h4 style="color:#079992; font-size:14px; border-bottom:1px dashed #ccc; padding-bottom:4px; margin-bottom:8px;">📋 Circonscription : ${csNom}</h4>`;

          for (let ecoleNom in groupParDept[deptNom][csNom]) {
            html += `<div style="margin-left:20px; margin-bottom:10px;">`;
            html += `<h5 style="color:#1e3799; font-size:13px; font-weight:bold; margin-bottom:5px;">🏫 École / Entité : ${ecoleNom}</h5>`;

            groupParDept[deptNom][csNom][ecoleNom].forEach((o) => {
              let hasRemarque =
                o.remarquesPieces &&
                Object.values(o.remarquesPieces).some(
                  (rem) => rem && rem.trim() !== "",
                );
              html += `
        <div class="demande-card" style="cursor:pointer; border-left:5px solid var(--vert); margin-left:15px;" onclick="ouvrirVisualisationPiece('${o.date}', '${o.matricule}')">
         <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
          <div>
           <b style="font-size:14px; color:var(--bleu);">📄 ${o.nomsPieces || o.type}</b>
           ${hasRemarque ? `<span class="badge" style="background:var(--jaune); color:black; margin-left:5px;">💬 Remarque reçue</span>` : ""}<br>
           <small style="color:#333;">Expéditeur : <b>${o.nom}</b> (Matricule : ${o.matricule}) — Reçu le : ${o.date}</small>
          </div>
          <div>
           <span class="btn-small" style="background:var(--vert)">🔍 Ouvrir</span>
          </div>
         </div>
        </div>
       `;
            });
            html += `</div>`;
          }
          html += `</div>`;
        }
        html += `</div>`;
      }
    } else {
      html += mesCourriersActuels
        .map((o, i) => {
          let hasRemarque =
            o.remarquesPieces &&
            Object.values(o.remarquesPieces).some(
              (rem) => rem && rem.trim() !== "",
            );
          return `
     <div class="demande-card" style="cursor:pointer; border-left:5px solid var(--vert);" onclick="ouvrirVisualisationPiece('${o.date}', '${o.matricule}')">
      <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
       <div>
        <b style="font-size:14px; color:var(--bleu);">📄 ${o.nomsPieces || o.type}</b>
        ${hasRemarque ? `<span class="badge" style="background:var(--jaune); color:black; margin-left:5px;">💬 Remarque reçue</span>` : ""}<br>
        <small style="color:#333;">Expéditeur : <b>${o.nom}</b> (Matricule : ${o.matricule}) — Entité : ${o.ecole} — Reçu le : ${o.date}</small>
       </div>
       <div>
        <span class="btn-small" style="background:var(--vert)">🔍 Ouvrir</span>
       </div>
      </div>
     </div>
    `;
        })
        .join("");
    }
  }

  container.innerHTML = html;
  allerPage("page-boite-courriers-plein-ecran");
}

function ouvrirBibliothequePleinEcran() {
  if (!currentUser) return;

  document.getElementById("biblio-user-nom").textContent =
    `${currentUser.nom} ${currentUser.prenom} (${currentUser.role.toUpperCase()})`;

  let allCourriers = JSON.parse(localStorage.getItem("tous_courriers") || "[]");

  let mesCourriersBibliotheque = allCourriers
    .filter((item) => {
      if (!item.traiteEtClasse) return false;

      if (currentUser.role === "collab") {
        return (
          item.emailOwner === currentUser.email ||
          item.matricule === currentUser.matricule ||
          item.nom === currentUser.nom + " " + currentUser.prenom
        );
      } else if (currentUser.role === "directeur") {
        let estSonCollaborateur =
          item.ecole === currentUser.ecole && item.role === "collab";
        let aEteTraiteParLui =
          item.historiqueTraitements &&
          item.historiqueTraitements.some((h) => h.role === "directeur");
        return estSonCollaborateur || aEteTraiteParLui;
      } else if (currentUser.role === "cp" || currentUser.role === "ccs") {
        let aEteTraiteParLui =
          item.historiqueTraitements &&
          item.historiqueTraitements.some((h) => h.role === currentUser.role);
        let memeCS = item.cs === currentUser.cs;
        return aEteTraiteParLui && memeCS;
      } else if (currentUser.role === "ddemp") {
        let aEteTraiteParLui =
          item.historiqueTraitements &&
          item.historiqueTraitements.some((h) => h.role === "ddemp");
        let memeDept = item.dept === currentUser.dept;
        return aEteTraiteParLui && memeDept;
      } else if (currentUser.role === "ministere") {
        let aEteTraiteParLui =
          item.historiqueTraitements &&
          item.historiqueTraitements.some((h) => h.role === "ministere");
        return aEteTraiteParLui;
      } else {
        let aSigneOuPasse =
          item.signateursParPiece &&
          Object.values(item.signateursParPiece).some((arr) =>
            arr.some((s) => s.toLowerCase() === currentUser.role),
          );
        let estPasseParLa =
          item.historiqueTraitements &&
          item.historiqueTraitements.some((h) => h.role === currentUser.role);
        return aSigneOuPasse || estPasseParLa;
      }
    })
    .reverse();

  const container = document.getElementById("contenu-bibliotheque-plein-ecran");
  let html = `<h3 style="color:var(--bleu);margin-bottom:15px;border-bottom:2px solid var(--jaune);padding-bottom:5px;">📚 Votre Bibliothèque des Dossiers Archivés</h3>`;

  if (mesCourriersBibliotheque.length === 0) {
    html +=
      '<p style="color:#666;font-size:13px;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #eee">Aucun document archivé dans votre Bibliothèque pour le moment.</p>';
  } else {
    // Classement hiérarchique dans la bibliothèque pour DDEMP et Ministère
    if (currentUser.role === "ddemp") {
      let groupParCS = {};
      mesCourriersBibliotheque.forEach((p) => {
        let csNom = p.cs || "CS non spécifiée";
        if (!groupParCS[csNom]) groupParCS[csNom] = {};
        let ecoleNom = p.ecole || "École non spécifiée";
        if (!groupParCS[csNom][ecoleNom]) groupParCS[csNom][ecoleNom] = [];
        groupParCS[csNom][ecoleNom].push(p);
      });

      let csIdx = 0;
      for (let csNom in groupParCS) {
        let idCsDossier = `biblio-cs-${csIdx}`;
        html += `
     <div class="dossier-card" onclick="toggleDossierCollaborateur('${idCsDossier}')">
      <div style="display:flex; justify-content:space-between; align-items:center;">
       <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:28px;">📋</span>
        <div>
         <b style="font-size:15px; color:var(--bleu);">Circonscription : ${csNom}</b><br>
         <small style="color:#666;">Cliquez pour afficher les écoles et pièces archivées</small>
        </div>
       </div>
       <button class="btn-small" style="background:var(--bleu)" onclick="event.stopPropagation(); toggleDossierCollaborateur('${idCsDossier}')">📂 Ouvrir / Réduire</button>
      </div>
      <div id="${idCsDossier}" style="display:none; margin-top:15px; border-top:1px solid #eee; padding-top:12px;" onclick="event.stopPropagation()">
    `;

        for (let ecoleNom in groupParCS[csNom]) {
          let piecesEco = groupParCS[csNom][ecoleNom];
          html += `<div style="margin-bottom:12px; background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0;">`;
          html += `<h5 style="color:#1e3799; font-size:13px; font-weight:bold; margin-bottom:8px;">🏫 École / Entité : ${ecoleNom} (${piecesEco.length} pièces)</h5>`;

          piecesEco.forEach((p) => {
            let nomPieceFichier =
              p.nomsPieces || p.type || "Pièce administrative";
            html += `
       <div style="background:white; border:1px solid #ddd; padding:8px 12px; border-radius:6px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
        <div>
         <b style="color:var(--bleu); font-size:12px;">📄 ${nomPieceFichier}</b> — <small>Expéditeur : <b>${p.nom}</b></small><br>
         <small style="color:#555;">Archivé le : ${p.date}</small>
        </div>
        <button onclick="telechargerCourrierDirect('${p.date}', '${p.matricule}')" class="btn-small" style="background:var(--vert)">📥 Télécharger</button>
       </div>
      `;
          });
          html += `</div>`;
        }
        html += `</div></div>`;
        csIdx++;
      }
    } else if (currentUser.role === "ministere") {
      let groupParDept = {};
      mesCourriersBibliotheque.forEach((p) => {
        let deptNom = p.dept || "Département non spécifié";
        if (!groupParDept[deptNom]) groupParDept[deptNom] = {};
        let csNom = p.cs || "CS non spécifiée";
        if (!groupParDept[deptNom][csNom]) groupParDept[deptNom][csNom] = {};
        let ecoleNom = p.ecole || "École non spécifiée";
        if (!groupParDept[deptNom][csNom][ecoleNom])
          groupParDept[deptNom][csNom][ecoleNom] = [];
        groupParDept[deptNom][csNom][ecoleNom].push(p);
      });

      let deptIdx = 0;
      for (let deptNom in groupParDept) {
        let idDeptDossier = `biblio-dept-${deptIdx}`;
        html += `
     <div class="dossier-card" onclick="toggleDossierCollaborateur('${idDeptDossier}')" style="border:2px solid var(--jaune);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
       <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:28px;">🏛️</span>
        <div>
         <b style="font-size:15px; color:var(--bleu);">Département : ${deptNom}</b><br>
         <small style="color:#666;">Cliquez pour ouvrir les circonscriptions et écoles</small>
        </div>
       </div>
       <button class="btn-small" style="background:var(--jaune); color:black;" onclick="event.stopPropagation(); toggleDossierCollaborateur('${idDeptDossier}')">📂 Ouvrir / Réduire</button>
      </div>
      <div id="${idDeptDossier}" style="display:none; margin-top:15px; border-top:1px solid #eee; padding-top:12px;" onclick="event.stopPropagation()">
    `;

        for (let csNom in groupParDept[deptNom]) {
          html += `<div style="margin-bottom:15px; background:#fffbe6; padding:12px; border-radius:8px; border:1px solid #e2e8f0;">`;
          html += `<h4 style="color:#079992; font-size:14px; font-weight:bold; margin-bottom:8px;">📋 Circonscription : ${csNom}</h4>`;

          for (let ecoleNom in groupParDept[deptNom][csNom]) {
            let piecesEco = groupParDept[deptNom][csNom][ecoleNom];
            html += `<div style="margin-left:15px; margin-bottom:10px; background:white; padding:10px; border-radius:6px; border:1px solid #ddd;">`;
            html += `<h5 style="color:#1e3799; font-size:13px; font-weight:bold; margin-bottom:6px;">🏫 École / Entité : ${ecoleNom} (${piecesEco.length} pièces)</h5>`;

            piecesEco.forEach((p) => {
              let nomPieceFichier =
                p.nomsPieces || p.type || "Pièce administrative";
              html += `
        <div style="background:#f8fafc; border:1px solid #eee; padding:8px 12px; border-radius:6px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
         <div>
          <b style="color:var(--bleu); font-size:12px;">📄 ${nomPieceFichier}</b> — <small>Expéditeur : <b>${p.nom}</b></small><br>
          <small style="color:#555;">Archivé le : ${p.date}</small>
         </div>
         <button onclick="telechargerCourrierDirect('${p.date}', '${p.matricule}')" class="btn-small" style="background:var(--vert)">📥 Télécharger</button>
        </div>
       `;
            });
            html += `</div>`;
          }
          html += `</div>`;
        }
        html += `</div></div>`;
        deptIdx++;
      }
    } else {
      let groupesParExpediteur = {};
      mesCourriersBibliotheque.forEach((p) => {
        let nomExp = p.nom || "Expéditeur inconnu";
        if (!groupesParExpediteur[nomExp]) {
          groupesParExpediteur[nomExp] = [];
        }
        groupesParExpediteur[nomExp].push(p);
      });

      let expIdx = 0;
      for (let nomExp in groupesParExpediteur) {
        let piecesExp = groupesParExpediteur[nomExp];
        let idDossierExp = `dossier-exp-${expIdx}`;

        html += `
     <div class="dossier-card" onclick="toggleDossierCollaborateur('${idDossierExp}')">
      <div style="display:flex; justify-content:space-between; align-items:center;">
       <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:28px;">📁</span>
        <div>
         <b style="font-size:14px; color:var(--bleu);">dossier personnel : ${nomExp}</b><br>
         <small style="color:#666;">Cliquez pour ouvrir le dossier et afficher les pièces archivées (${piecesExp.length} éléments)</small>
        </div>
       </div>
       <button class="btn-small" style="background:var(--bleu)" onclick="event.stopPropagation(); toggleDossierCollaborateur('${idDossierExp}')">📂 Ouvrir / Réduire</button>
      </div>

      <div id="${idDossierExp}" style="display:none; margin-top:15px; border-top:1px solid #eee; padding-top:12px;" onclick="event.stopPropagation()">
    `;

        piecesExp.forEach((p) => {
          let nomPieceFichier =
            p.nomsPieces || p.type || "Pièce administrative";
          html += `
      <div style="background:#f8fafc; border:1px solid #ddd; padding:10px 14px; border-radius:6px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
       <div>
        <b style="color:var(--bleu); font-size:13px;">📄 ${nomPieceFichier}</b><br>
        <small style="color:#555;">Archivé le : ${p.date}</small>
       </div>
       <button onclick="telechargerCourrierDirect('${p.date}', '${p.matricule}')" class="btn-small" style="background:var(--vert)">📥 Télécharger</button>
      </div>
     `;
        });

        html += `
      </div>
     </div>
    `;
        expIdx++;
      }
    }
  }

  container.innerHTML = html;
  allerPage("page-bibliotheque-plein-ecran");
}

function validerInscription(index) {
  let allInscriptions = JSON.parse(
    localStorage.getItem("toutes_inscriptions") || "[]",
  );

  let mesInscriptions = allInscriptions
    .filter((item) => {
      if (item.statut !== "en_attente") return false;
      if (currentUser.role === "ministere") return item.role === "ddemp";
      else if (currentUser.role === "ddemp")
        return item.dept === currentUser.dept && item.role === "ccs";
      else if (currentUser.role === "ccs")
        return (
          item.dept === currentUser.dept &&
          item.cs === currentUser.cs &&
          item.role === "cp"
        );
      else if (currentUser.role === "cp")
        return (
          item.dept === currentUser.dept &&
          item.cs === currentUser.cs &&
          (item.role === "directeur" || item.role === "up")
        );
      else if (currentUser.role === "up")
        return (
          item.dept === currentUser.dept &&
          item.cs === currentUser.cs &&
          item.role === "directeur"
        );
      else if (currentUser.role === "directeur")
        return (
          item.dept === currentUser.dept &&
          item.cs === currentUser.cs &&
          item.ecole === currentUser.ecole &&
          item.role === "collab"
        );
      return false;
    })
    .reverse();

  let cible = mesInscriptions[index];
  cible.statut = "valide";

  allInscriptions.forEach((it) => {
    if (it.email === cible.email) it.statut = "valide";
  });
  localStorage.setItem("toutes_inscriptions", JSON.stringify(allInscriptions));

  let valides = JSON.parse(
    localStorage.getItem("utilisateurs_valides") || "[]",
  );
  valides.push(cible);
  localStorage.setItem("utilisateurs_valides", JSON.stringify(valides));

  alert("✅ Inscription validée avec succès !");
  ouvrirBoiteCourriersPleinEcran();
}

function ouvrirListeEnseignantsCCS() {
  if (!currentUser || currentUser.role !== "ccs") return;

  const userCS = currentUser.cs || "CS LOKOSSA-2";
  const userDept = currentUser.dept || "MONO";

  document.getElementById("titre-modal-liste-enseignants").textContent =
    `📋 Liste des enseignants de la '${userCS}'`;

  let valides = JSON.parse(
    localStorage.getItem("utilisateurs_valides") || "[]",
  );

  const normaliser = (str) => (str || "").toLowerCase().replace(/[\s\-_]/g, "");

  let enseignantsCS = valides.filter((u) => {
    let memeCS = normaliser(u.cs) === normaliser(userCS);
    let memeDept = normaliser(u.dept) === normaliser(userDept);
    let estEnseignant = u.role === "collab" || u.role === "directeur";
    return memeCS && memeDept && estEnseignant;
  });

  const container = document.getElementById("contenu-liste-enseignants");

  if (enseignantsCS.length === 0) {
    container.innerHTML = `<p style="color:#666; font-size:13px; text-align:center; padding:20px 0;">Aucun enseignant (collaborateur ou directeur) inscrit et validé pour la <b>${userCS}</b> pour le moment.</p>`;
  } else {
    let htmlTable = `
   <p style="font-size:12px; color:#555; margin-bottom:12px;">Nombre total d'enseignants enregistrés : <b>${enseignantsCS.length}</b></p>
   <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
     <thead>
      <tr style="background:var(--bleu); color:white;">
       <th style="padding:10px; border:1px solid #ccc;">N°</th>
       <th style="padding:10px; border:1px solid #ccc;">Matricule</th>
       <th style="padding:10px; border:1px solid #ccc;">Nom</th>
       <th style="padding:10px; border:1px solid #ccc;">Prénom</th>
       <th style="padding:10px; border:1px solid #ccc;">Rôle / Statut</th>
       <th style="padding:10px; border:1px solid #ccc;">Zone</th>
       <th style="padding:10px; border:1px solid #ccc;">École / Entité</th>
      </tr>
     </thead>
     <tbody>
  `;

    enseignantsCS.forEach((ens, i) => {
      let roleLibelle =
        ens.role === "directeur" ? "🏫 Directeur" : "👥 Enseignant Adjoint";
      htmlTable += `
    <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"};">
     <td style="padding:8px 10px; border:1px solid #eee;">${i + 1}</td>
     <td style="padding:8px 10px; border:1px solid #eee; font-weight:bold; color:var(--bleu);">${ens.matricule || "N/A"}</td>
     <td style="padding:8px 10px; border:1px solid #eee;">${ens.nom || ""}</td>
     <td style="padding:8px 10px; border:1px solid #eee;">${ens.prenom || ""}</td>
     <td style="padding:8px 10px; border:1px solid #eee;">${roleLibelle}</td>
     <td style="padding:8px 10px; border:1px solid #eee;">Zone ${ens.zone || "N/A"}</td>
     <td style="padding:8px 10px; border:1px solid #eee;">${ens.ecole || "N/A"}</td>
    </tr>
   `;
    });

    htmlTable += `
     </tbody>
    </table>
   </div>
  `;
    container.innerHTML = htmlTable;
  }

  document.getElementById("modal-liste-enseignants").classList.remove("hidden");
}
