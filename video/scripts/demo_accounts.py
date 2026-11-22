"""Comptes fictifs pour les captures du film. Usage :
  python demo_accounts.py create <fichier.json>   cree deux comptes vides et confirmes (fr, en)
  python demo_accounts.py delete                  supprime ces comptes et toutes leurs donnees
A lancer depuis cvgen-backend (lit son .env). Les identifiants ne servent qu'en local.
"""
import json
import secrets
import sys
from datetime import datetime, timezone

import app.main  # noqa: F401  (enregistre tous les modeles)
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.profil import Profil
from app.models.utilisateur import Utilisateur
from app.services import compte_service

EMAILS = {"fr": "film-fr@example.com", "en": "film-en@example.com"}

db = SessionLocal()
action = sys.argv[1]

if action == "delete":
    for email in EMAILS.values():
        u = db.query(Utilisateur).filter(Utilisateur.email == email).first()
        if u:
            compte_service.supprimer(db, u.id)
            print("supprime :", email)
    print("restants :", db.query(Utilisateur).filter(Utilisateur.email.like("film-%@example.com")).count())
elif action == "create":
    mdp = "Film-" + secrets.token_urlsafe(12)
    for lang, email in EMAILS.items():
        assert db.query(Utilisateur).filter(Utilisateur.email == email).first() is None, f"{email} existe deja"
        u = Utilisateur(
            nom="Exemple", prenom="Amina", email=email, mot_de_passe=hash_password(mdp), email_verifie=True,
            langue=lang, cgu_acceptees_le=datetime.now(timezone.utc), cgu_version="2026-11-01",
        )
        db.add(u)
        db.flush()
        db.add(Profil(utilisateur_id=u.id))
    db.commit()
    with open(sys.argv[2], "w", encoding="utf-8") as f:
        json.dump({"emails": EMAILS, "mdp": mdp}, f)
    print("comptes crees")
db.close()
