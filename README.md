# Mass Search Card

De **Mass Search Card** is een geavanceerde zoekkaart voor Home Assistant, ontworpen om interactie met Music Assistant te vereenvoudigen. 
Met deze kaart kun je eenvoudig zoeken naar artiesten, nummers, albums, afspeellijsten en radiozenders en deze afspelen op geselecteerde mediaplayers.

## Features

- Ondersteunt zoeken naar artiesten, nummers, albums, afspeellijsten en radio.
- Dynamische dropdown-selectie voor mediaplayers en mediatypen.
- Popup-weergave van zoekresultaten met gedetailleerde informatie.
- Ondersteuning voor meertalige labels (Engels en Nederlands).
- Eenvoudige integratie met Music Assistant.

## Screenshots

> **Voeg hier enkele screenshots in van je kaart in actie.**

---

## Installatie

### HACS (Home Assistant Community Store)
1. Zorg ervoor dat HACS is geïnstalleerd in je Home Assistant.
2. Voeg deze repository toe via HACS:
   - Ga naar **HACS > Integraties** en klik op **+**.
   - Voeg de GitHub-URL van deze repository toe.
3. Zoek naar `Mass Search Card` en installeer de kaart.
4. Voeg de volgende regel toe aan je `lovelace`-resources:
   ```yaml
   resources:
     - url: /hacsfiles/mass-search-card/mass-search-card.js
       type: module
