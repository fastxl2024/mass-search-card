/**
 * @customElement
 * @cardType mass-search-card
 * @description Search and play media using Music Assistant in Home Assistant
 */

class MassSearchCardEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
        this._config = config;
        this._render();
    }

    set hass(hass) {
        this._hass = hass;
        if (this._form) {
            this._form.hass = hass;
            this._form.schema = this._schema();
        } else {
            this._render();
        }
    }

    _schema() {
        const maPlayers = this._hass
            ? Object.entries(this._hass.states)
                .filter(([id, state]) => id.startsWith('media_player.') && state.attributes.mass_player_type)
                .map(([id, state]) => ({ value: id, label: state.attributes.friendly_name || id }))
            : [];

        return [
            {
                name: 'language',
                selector: {
                    select: {
                        options: [
                            { value: 'en', label: 'English' },
                            { value: 'nl', label: 'Nederlands' },
                            { value: 'cz', label: 'Čeština' },
                            { value: 'sv', label: 'Svenska' },
                            { value: 'sk', label: 'Slovenčina' },
                            { value: 'fr', label: 'Français' },
                            { value: 'de', label: 'Deutsch' },
                        ],
                    },
                },
            },
            {
                name: 'default_player',
                selector: {
                    select: {
                        mode: 'dropdown',
                        options: [
                            { value: '', label: '— geen standaard —' },
                            ...maPlayers,
                        ],
                    },
                },
            },
            {
                name: 'default_media_type',
                selector: {
                    select: {
                        options: [
                            { value: '', label: '— geen standaard —' },
                            { value: 'track', label: 'Nummer' },
                            { value: 'album', label: 'Album' },
                            { value: 'artist', label: 'Artiest' },
                            { value: 'playlist', label: 'Afspeellijst' },
                            { value: 'radio', label: 'Radio' },
                        ],
                    },
                },
            },
            {
                name: 'compact',
                selector: { boolean: {} },
            },
            {
                name: 'multiroom',
                selector: { boolean: {} },
            },
            {
                name: 'hide_selectors',
                selector: { boolean: {} },
            },
            {
                name: 'default_results',
                selector: { number: { min: 1, max: 100, step: 1, mode: 'box' } },
            },
        ];
    }

    _render() {
        if (!this._config) return;
        const form = document.createElement('ha-form');
        form.hass = this._hass;
        form.data = this._config;
        form.schema = this._schema();
        form.computeLabel = (s) =>
            ({ language: 'Taal', default_player: 'Standaard speler', default_media_type: 'Standaard media type', compact: 'Compacte weergave', multiroom: 'Multi-room (meerdere spelers)', hide_selectors: 'Verberg speler- en mediatypekeuze', default_results: 'Standaard aantal resultaten' }[s.name] || s.name);
        form.addEventListener('value-changed', (e) => {
            this.dispatchEvent(new CustomEvent('config-changed', {
                detail: { config: e.detail.value },
                bubbles: true,
                composed: true,
            }));
        });
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(form);
        this._form = form;
    }
}
customElements.define('mass-search-card-editor', MassSearchCardEditor);

class MassSearchCard extends HTMLElement {
    static getConfigElement() {
        return document.createElement('mass-search-card-editor');
    }

    static getStubConfig() {
        return { language: 'en' };
    }

    async setConfig(config) {
        this.config = config;

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
            
        }

        // Voeg de media query toe voor kleinere schermen
        const style = document.createElement('style');
        style.textContent = `
          @media (max-width: 600px) {
            .popup {
              width: 95vw !important;
              max-width: 95vw !important;
            }
          }
          @keyframes mass-spin {
            to { transform: rotate(360deg); }
          }
        `;
        
        // Stijl wordt pas aan shadowRoot toegevoegd na de innerHTML-reset verderop

        const translations = {
            nl: {
                album_label: 'Album',
                artist_label: 'Artiest',
                close_button: 'Sluiten',
                dropdown_label_media_player: 'Selecteer een media player',
                error_fetching: 'Er is een fout opgetreden bij het ophalen van de resultaten.',
                favorites_only_label: 'Alleen favorieten',
                library_only_label: 'Lokaal',
                media_type: 'Soort media',
                no_results: 'Geen resultaten gevonden.',
                playlist_label: 'Afspeellijst',
                popup_title: 'Zoekresultaten voor:',
                radio_label: 'Radio',
                results_label: 'Aantal resultaten',
                search_placeholder: 'Typ hier je zoekterm...',
                select_media_type: 'Selecteer media type',
                title_text: 'Zoek in Music Assistant',
                track_label: 'Nummer',
                unknown_artist: 'Onbekende artiest',
                unknown_duration: 'Onbekende duur',
                sort_label: 'Sortering',
                sort_default: 'Standaard',
                sort_name: 'Naam (A-Z)',
                sort_artist: 'Artiest (A-Z)',
                players_selected: '{n} spelers',
                play_all: 'Alles afspelen',
                loading: 'Laden...',
            },
            en: {
                album_label: 'Album',
                artist_label: 'Artist',
                close_button: 'Close',
                dropdown_label_media_player: 'Select a media player',
                error_fetching: 'An error occurred while fetching results.',
                favorites_only_label: 'Favourites only',
                library_only_label: 'Local library',
                media_type: 'Media type',
                no_results: 'No results found.',
                playlist_label: 'Playlist',
                popup_title: 'Search Results for:',
                radio_label: 'Radio',
                results_label: 'Number of results',
                search_placeholder: 'Type your search term here...',
                select_media_type: 'Select media type',
                title_text: 'Search in Music Assistant',
                track_label: 'Track',
                unknown_artist: 'Unknown artist',
                unknown_duration: 'Unknown duration',
                sort_label: 'Sort',
                sort_default: 'Default',
                sort_name: 'Name (A-Z)',
                sort_artist: 'Artist (A-Z)',
                players_selected: '{n} players',
                play_all: 'Play all',
                loading: 'Loading...',
            },
            sv: {
                album_label: 'Album',
                artist_label: 'Artist',
                close_button: 'Stäng',
                dropdown_label_media_player: 'Välj mediaspelare',
                error_fetching: 'Ett fel uppstod när resultat hämtades.',
                favorites_only_label: 'Endast favoriter',
                library_only_label: 'Endast bibliotek',
                media_type: 'Mediatyp',
                no_results: 'Inga resultat funna.',
                playlist_label: 'Spellista',
                popup_title: 'Sökresultat för:',
                radio_label: 'Radio',
                results_label: 'Antal resultat',
                search_placeholder: 'Sök här…',
                select_media_type: 'Välj mediatyp',
                title_text: 'Sök i Music Assistant',
                track_label: 'Spår',
                unknown_artist: 'Okänd artist',
                unknown_duration: 'Okänd varaktighet',
                sort_label: 'Sortering',
                sort_default: 'Standard',
                sort_name: 'Namn (A-Ö)',
                sort_artist: 'Artist (A-Ö)',
                players_selected: '{n} spelare',
                play_all: 'Spela alla',
                loading: 'Laddar...',
            },
            cz: {
                album_label: 'Album',
                artist_label: 'Umělec',
                close_button: 'Zavřít',
                dropdown_label_media_player: 'Vyberte přehrávač',
                error_fetching: 'Při načítání výsledků došlo k chybě.',
                favorites_only_label: 'Pouze oblíbené',
                library_only_label: 'Lokální knihovna',
                media_type: 'Typ média',
                no_results: 'Nebyly nalezeny žádné výsledky.',
                playlist_label: 'Seznam skladeb',
                popup_title: 'Výsledky hledání pro:',
                radio_label: 'Rádio',
                results_label: 'Počet výsledků',
                search_placeholder: 'Zadejte hledaný výraz...',
                select_media_type: 'Vyberte typ média',
                title_text: 'Hledat v Music Assistant',
                track_label: 'Skladba',
                unknown_artist: 'Neznámý umělec',
                unknown_duration: 'Neznámá délka',
                sort_label: 'Řazení',
                sort_default: 'Výchozí',
                sort_name: 'Název (A-Z)',
                sort_artist: 'Umělec (A-Z)',
                players_selected: '{n} přehrávačů',
                play_all: 'Přehrát vše',
                loading: 'Načítání...',
            },
            fr: {
                album_label: 'Album',
                artist_label: 'Artiste',
                close_button: 'Fermer',
                dropdown_label_media_player: 'Sélectionner un lecteur multimédia',
                error_fetching: 'Une erreur est survenue lors de la récupération des résultats.',
                favorites_only_label: 'Favoris uniquement',
                library_only_label: 'Local',
                media_type: 'Type de média',
                no_results: 'Aucun résultat trouvé.',
                playlist_label: 'Playlist',
                popup_title: 'Résultats de recherche pour :',
                radio_label: 'Radio',
                results_label: 'Nombre de résultats',
                search_placeholder: 'Tapez ici votre recherche...',
                select_media_type: 'Sélectionner un type de média',
                title_text: 'Rechercher dans Music Assistant',
                track_label: 'Morceau',
                unknown_artist: 'Artiste inconnu',
                unknown_duration: 'Durée inconnue',
                sort_label: 'Tri',
                sort_default: 'Par défaut',
                sort_name: 'Nom (A-Z)',
                sort_artist: 'Artiste (A-Z)',
                players_selected: '{n} lecteurs',
                play_all: 'Tout lire',
                loading: 'Chargement...',
            },
            sk: {
                album_label: 'Album',
                artist_label: 'Umelec',
                close_button: 'Zavrieť',
                dropdown_label_media_player: 'Vyberte prehrávač',
                error_fetching: 'Pri načítaní výsledkov nastala chyba.',
                favorites_only_label: 'Len obľúbené',
                library_only_label: 'Miestna knižnica',
                media_type: 'Typ média',
                no_results: 'Nenašli sa žiadne výsledky.',
                playlist_label: 'Zoznam skladieb',
                popup_title: 'Výsledky hľadania pre:',
                radio_label: 'Rádio',
                results_label: 'Počet výsledkov',
                search_placeholder: 'Zadajte hľadaný výraz...',
                select_media_type: 'Vyberte typ média',
                title_text: 'Hľadať v Music Assistant',
                track_label: 'Skladba',
                unknown_artist: 'Neznámy umelec',
                unknown_duration: 'Neznáma dĺžka',
                sort_label: 'Zoradiť',
                sort_default: 'Predvolené',
                sort_name: 'Názov (A-Z)',
                sort_artist: 'Umelec (A-Z)',
                players_selected: '{n} prehrávačov',
                play_all: 'Prehrať všetko',
                loading: 'Načítavanie...',
            },
            de: {
                album_label: 'Album',
                artist_label: 'Künstler',
                close_button: 'Schließen',
                dropdown_label_media_player: 'Medienplayer auswählen',
                error_fetching: 'Beim Abrufen der Ergebnisse ist ein Fehler aufgetreten.',
                favorites_only_label: 'Nur Favoriten',
                library_only_label: 'Lokale Bibliothek',
                media_type: 'Medientyp',
                no_results: 'Keine Ergebnisse gefunden.',
                playlist_label: 'Wiedergabeliste',
                popup_title: 'Suchergebnisse für:',
                radio_label: 'Radio',
                results_label: 'Anzahl der Ergebnisse',
                search_placeholder: 'Suchbegriff hier eingeben...',
                select_media_type: 'Medientyp auswählen',
                title_text: 'In Music Assistant suchen',
                track_label: 'Titel',
                unknown_artist: 'Unbekannter Künstler',
                unknown_duration: 'Unbekannte Dauer',
                sort_label: 'Sortierung',
                sort_default: 'Standard',
                sort_name: 'Name (A-Z)',
                sort_artist: 'Künstler (A-Z)',
                players_selected: '{n} Player',
                play_all: 'Alle abspielen',
                loading: 'Laden...',
            }
          };
      
          const language = this.config.language || this.hass?.language || 'en';
          const t = translations[language] || translations.en;
          this._t = t;
          this.selectedMediaPlayers = this.selectedMediaPlayers || [];
          this.configEntryId = '';
  
        // Maak een eigen invoerveld
        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.flexDirection = 'row';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.border = '1px solid var(--primary-color)';
        inputContainer.style.borderRadius = '24px'; // Ronde hoeken
        inputContainer.style.backgroundColor = 'var(--card-background-color)';
        inputContainer.style.position = 'relative';
        inputContainer.style.height = '48.4px';

        // Invoerveld
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = t.search_placeholder;
        input.style.flex = '1';
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.background = 'transparent';
        input.style.color = 'var(--primary-text-color)';
        input.style.fontSize = '16px';
        input.style.padding = '8px 16px';
        input.style.borderRadius = '12px';

        // Icoon
        const icon_searchbar = document.createElement('div');
        icon_searchbar.innerHTML = '&#128269;'; // Unicode voor vergrootglas
        icon_searchbar.style.cursor = 'pointer';
        icon_searchbar.style.marginRight = '16px';
        icon_searchbar.style.color = 'var(--primary-text-color)';
        icon_searchbar.addEventListener('click', async () => {
            if (this.hass) {
                const query = input.value.trim();
                const mediaType = selectedMediaType; // Geselecteerde waarde van de dropdown
                const mediaPlayers = this.selectedMediaPlayers;
                const configEntryId = this.configEntryId;
                const limit = this.config.default_results || parseInt(inputlimitresults.value, 10) || 8;
                const libraryOnly = checkbox.checked;
                const favoritesOnly = favoritesCheckbox.checked;
                const selectedSort = sortSelect.value;

                const message = {
                    type: 'call_service',
                    domain: 'music_assistant',
                    service: 'search',
                    service_data: {
                        name: query,
                        media_type: mediaType,
                        config_entry_id: configEntryId,
                        limit: limit,
                        library_only: libraryOnly,
                    },
                    return_response: true,
                };
                if (!mediaPlayers || !mediaPlayers.length) {
                    alert(t.dropdown_label_media_player);
                    return;
                }
                if (!mediaType) {
                    alert(t.select_media_type);
                    return;
                }
                if (!configEntryId) {
                    alert('Music Assistant is nog niet geladen. Probeer opnieuw.');
                    return;
                }
                try {
                    const response = await this.hass.connection.sendMessagePromise(message);
                    if (response) {
                        let title; // Dynamische titel gebaseerd op zoekterm
                        // Dynamische titel aanpassing op basis van lengte
                        if (query.length + mediaType.length > 39) {
                            title = `${t.popup_title}<br>"${query}" (${mediaType})`;
                        } else {
                            title = `${t.popup_title} "${query}" (${mediaType})`;
                        }
                        this.showPopup(response, title, t, mediaType, favoritesOnly, mediaPlayers, selectedSort);
                    }
                } catch (error) {
                    console.error('Error during service call:', error);
                }
            } else {
                console.error('No valid hass object found.');
            }
        });

        // Enter-toets triggert zoekopdracht
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') icon_searchbar.click();
        });

        // Samenvoegen
        inputContainer.appendChild(input);
        inputContainer.appendChild(icon_searchbar);

        const searchsettingContainer = document.createElement('div');
        searchsettingContainer.style.display = 'grid';
        searchsettingContainer.style.gridTemplateColumns = '1fr 1fr';
        searchsettingContainer.style.gap = '12px';
        searchsettingContainer.style.width = '100%';
        searchsettingContainer.style.boxSizing = 'border-box';
        searchsettingContainer.style.minWidth = '0';

        // Maak een eigen invoerveld voor maximale resultaten
        const inputlimitresultsContainer = document.createElement('div');
        inputlimitresultsContainer.style.display = 'flex';
        inputlimitresultsContainer.style.flexDirection = 'row';
        inputlimitresultsContainer.style.alignItems = 'center';
        inputlimitresultsContainer.style.border = '1px solid var(--primary-color)';
        inputlimitresultsContainer.style.borderRadius = '24px';
        inputlimitresultsContainer.style.backgroundColor = 'var(--card-background-color)';
        inputlimitresultsContainer.style.position = 'relative';
        inputlimitresultsContainer.style.height = '48.4px';
        inputlimitresultsContainer.style.minWidth = '0';
        inputlimitresultsContainer.style.overflow = 'hidden';
        if (this.config.default_results) inputlimitresultsContainer.style.display = 'none';

        // Invoerveld maximale resultaten
        const inputlimitresults = document.createElement('input');
        inputlimitresults.type = 'text';
        inputlimitresults.placeholder = t.results_label;
        inputlimitresults.style.flex = '1';
        inputlimitresults.style.border = 'none';
        inputlimitresults.style.outline = 'none';
        inputlimitresults.style.background = 'transparent';
        inputlimitresults.style.color = 'var(--primary-text-color)';
        inputlimitresults.style.fontSize = '16px';
        inputlimitresults.style.padding = '8px 16px';
        inputlimitresults.style.borderRadius = '12px';
        inputlimitresultsContainer.appendChild(inputlimitresults);

        // Checkbox (lokaal)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.margin = '0 2px';

        const checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = t.library_only_label;
        checkboxLabel.style.color = 'var(--primary-text-color)';
        checkboxLabel.style.fontSize = '14px';
        checkboxLabel.style.padding = '8px';
        checkboxLabel.style.cursor = 'pointer';

        // Checkbox (favorieten)
        const favoritesCheckbox = document.createElement('input');
        favoritesCheckbox.type = 'checkbox';
        favoritesCheckbox.style.margin = '0 2px';

        const favoritesLabel = document.createElement('label');
        favoritesLabel.textContent = t.favorites_only_label;
        favoritesLabel.style.color = 'var(--primary-text-color)';
        favoritesLabel.style.fontSize = '14px';
        favoritesLabel.style.padding = '8px';
        favoritesLabel.style.cursor = 'pointer';

        // Scheidingslijn tussen de twee checkboxes
        const checkboxDivider = document.createElement('span');
        checkboxDivider.style.width = '1px';
        checkboxDivider.style.alignSelf = 'stretch';
        checkboxDivider.style.backgroundColor = 'var(--primary-color)';
        checkboxDivider.style.margin = '8px 4px';

        // Gecombineerde checkbox-container (zelfde stijl als de speler/mediatype balk)
        const combinedCheckboxContainer = document.createElement('div');
        combinedCheckboxContainer.style.display = 'flex';
        combinedCheckboxContainer.style.alignItems = 'center';
        combinedCheckboxContainer.style.flexDirection = 'row';
        combinedCheckboxContainer.style.border = '1px solid var(--primary-color)';
        combinedCheckboxContainer.style.borderRadius = '24px';
        combinedCheckboxContainer.style.backgroundColor = 'var(--card-background-color)';
        combinedCheckboxContainer.style.height = '48.4px';
        combinedCheckboxContainer.style.padding = '0px 8px';
        combinedCheckboxContainer.style.gridColumn = '1 / -1';

        const lokalGroup = document.createElement('div');
        lokalGroup.style.display = 'flex';
        lokalGroup.style.alignItems = 'center';
        lokalGroup.style.justifyContent = 'center';
        lokalGroup.style.flex = '1';
        lokalGroup.appendChild(checkbox);
        lokalGroup.appendChild(checkboxLabel);

        const favoritenGroup = document.createElement('div');
        favoritenGroup.style.display = 'flex';
        favoritenGroup.style.alignItems = 'center';
        favoritenGroup.style.justifyContent = 'center';
        favoritenGroup.style.flex = '1';
        favoritenGroup.appendChild(favoritesCheckbox);
        favoritenGroup.appendChild(favoritesLabel);

        combinedCheckboxContainer.appendChild(lokalGroup);
        combinedCheckboxContainer.appendChild(checkboxDivider);
        combinedCheckboxContainer.appendChild(favoritenGroup);

        // Sortering dropdown
        const sortContainer = document.createElement('div');
        sortContainer.style.display = 'flex';
        sortContainer.style.alignItems = 'center';
        sortContainer.style.padding = '0px 12px';
        sortContainer.style.border = '1px solid var(--primary-color)';
        sortContainer.style.borderRadius = '24px';
        sortContainer.style.backgroundColor = 'var(--card-background-color)';
        sortContainer.style.height = '48.4px';
        sortContainer.style.gap = '6px';
        sortContainer.style.minWidth = '0';
        sortContainer.style.overflow = 'hidden';

        const sortLabel = document.createElement('span');
        sortLabel.textContent = t.sort_label;
        sortLabel.style.color = 'var(--primary-text-color)';
        sortLabel.style.fontSize = '14px';
        sortLabel.style.whiteSpace = 'nowrap';

        const sortSelect = document.createElement('select');
        sortSelect.style.border = 'none';
        sortSelect.style.outline = 'none';
        sortSelect.style.background = 'transparent';
        sortSelect.style.color = 'var(--primary-text-color)';
        sortSelect.style.fontSize = '14px';
        sortSelect.style.cursor = 'pointer';
        sortSelect.style.flex = '1';

        [
            { value: 'default', label: t.sort_default },
            { value: 'name', label: t.sort_name },
            { value: 'artist', label: t.sort_artist },
        ].forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.label;
            sortSelect.appendChild(o);
        });

        sortContainer.appendChild(sortLabel);
        sortContainer.appendChild(sortSelect);

        // Rij 1: aantal resultaten + sortering
        searchsettingContainer.appendChild(inputlimitresultsContainer);
        searchsettingContainer.appendChild(sortContainer);
        // Rij 2: gecombineerde checkboxes (volledige breedte)
        searchsettingContainer.appendChild(combinedCheckboxContainer);

        // ha-card als wrapper zodat card-mod stijlen kan injecteren
        const wrapper = document.createElement('ha-card');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.padding = '16px';
        wrapper.style.gap = '16px';
        wrapper.style.width = '100%';
        wrapper.style.boxSizing = 'border-box';

        // Voeg een afbeelding toe als titel bovenaan
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'center';
        titleContainer.style.gap = '16px';

        const titleImage = document.createElement('img');
        titleImage.src = "data:image/png;base64,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";
        titleImage.alt = 'Music Assistant Logo';
        titleImage.style.width = '65px';
        titleImage.style.borderRadius = '8px';

        const titleText = document.createElement('span');
        titleText.textContent = t.title_text;
        titleText.style.fontSize = '24px';
        titleText.style.color = 'var(--primary-text-color)';
        titleText.style.fontWeight = 'bold';

        titleContainer.appendChild(titleImage);
        titleContainer.appendChild(titleText);
        
        // Maak een knop met twee dropdowns en een icoon
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.gap = '8px';
        buttonContainer.style.padding = '8px';
        buttonContainer.style.border = '1px solid var(--primary-color)';
        buttonContainer.style.borderRadius = '24px';
        buttonContainer.style.backgroundColor = 'var(--card-background-color)';

        const icon = document.createElement('ha-icon');
        icon.setAttribute('icon', 'mdi:hammer-wrench');
        icon.style.fontSize = '24px';
        icon.style.color = 'var(--primary-color)';

        // Maak de dropdown container
        const dropdown1 = document.createElement('div');
        dropdown1.style.position = 'relative';
        dropdown1.style.flex = '1';
        dropdown1.style.minWidth = '0';

        // Maak de dropdown-knop
        const dropdownButton1 = document.createElement('button');
        dropdownButton1.id = 'mass-search-player-btn';
        dropdownButton1.textContent = t.dropdown_label_media_player;
        dropdownButton1.style.width = '100%';
        dropdownButton1.style.border = '1px solid var(--primary-color)';
        dropdownButton1.style.borderRadius = '8px';
        dropdownButton1.style.padding = '8px';
        dropdownButton1.style.backgroundColor = 'var(--card-background-color)';
        dropdownButton1.style.color = 'var(--primary-text-color)';
        dropdownButton1.style.cursor = 'pointer';
            
        // Gebruik Flexbox voor de knop
        dropdownButton1.style.display = 'flex';
        dropdownButton1.style.alignItems = 'center'; // Verticale uitlijning
        dropdownButton1.style.justifyContent = 'space-between'; // Tekst links en icoon rechts
            
        // Maak het dropdown-icoon
        const dropdownIcon = document.createElement('span');
        dropdownIcon.textContent = '▼'; // Unicode of SVG kan hier worden gebruikt
        dropdownIcon.style.marginLeft = 'auto'; // Pijl naar rechts duwen
        dropdownIcon.style.fontSize = '12px'; // Pas het formaat aan als nodig
        dropdownIcon.style.pointerEvents = 'none'; // Voorkom klik-interactie
            
        // Voeg de pijl toe aan de knop
        dropdownButton1.appendChild(dropdownIcon);

        const dropdownContent1 = document.createElement('div');
        dropdownContent1.style.display = 'none';
        dropdownContent1.style.position = 'absolute';
        dropdownContent1.style.top = '100%';
        dropdownContent1.style.left = '0';
        dropdownContent1.style.width = '100%';
        dropdownContent1.style.border = '1px solid var(--primary-color)';
        dropdownContent1.style.borderRadius = '8px';
        dropdownContent1.style.backgroundColor = 'var(--card-background-color)';
        dropdownContent1.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dropdownContent1.style.zIndex = '10';
        dropdownContent1.classList.add('dropdown-content1');

        // Toggle dropdown bij klikken op de knop
        dropdownButton1.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdownContent1.style.display !== 'none';
            dropdownContent1.style.display = 'none';
            dropdownContent2.style.display = 'none';
            if (!isOpen) dropdownContent1.style.display = 'block';
        });
        
        // Voeg de dropdown-inhoud toe aan de container
        dropdown1.appendChild(dropdownButton1);
        dropdown1.appendChild(dropdownContent1);

        // Maak de dropdown container
        const dropdown2 = document.createElement('div');
        dropdown2.style.position = 'relative';
        dropdown2.style.flex = '0 0 auto';
        dropdown2.style.minWidth = '120px';

        // Maak de dropdown-knop
        const dropdownButton2 = document.createElement('button');
        dropdownButton2.textContent = t.media_type;
        dropdownButton2.style.width = '100%';
        dropdownButton2.style.border = '1px solid var(--primary-color)';
        dropdownButton2.style.borderRadius = '8px';
        dropdownButton2.style.padding = '8px';
        dropdownButton2.style.backgroundColor = 'var(--card-background-color)';
        dropdownButton2.style.color = 'var(--primary-text-color)';
        dropdownButton2.style.cursor = 'pointer';

        // Gebruik Flexbox om tekst en pijl goed uit te lijnen
        dropdownButton2.style.display = 'flex';
        dropdownButton2.style.justifyContent = 'space-between'; // Zorg dat de tekst en de pijl aan weerszijden staan
        dropdownButton2.style.alignItems = 'center'; // Verticale uitlijning

        // Maak de dropdown-pijl
        const dropdownIcon2 = document.createElement('span');
        dropdownIcon2.textContent = '▼'; // Unicode of SVG kan hier worden gebruikt
        dropdownIcon2.style.marginLeft = 'auto'; // Zet de pijl helemaal naar rechts
        dropdownIcon2.style.fontSize = '12px'; // Pas het formaat aan als nodig
        dropdownIcon2.style.pointerEvents = 'none'; // Voorkom klik-interactie

        // Voeg de pijl toe aan de knop
        dropdownButton2.appendChild(dropdownIcon2);

        const dropdownContent2 = document.createElement('div');
        dropdownContent2.style.display = 'none';
        dropdownContent2.style.position = 'absolute';
        dropdownContent2.style.top = '100%';
        dropdownContent2.style.left = '0';
        dropdownContent2.style.width = '100%';
        dropdownContent2.style.border = '1px solid var(--primary-color)';
        dropdownContent2.style.borderRadius = '8px';
        dropdownContent2.style.backgroundColor = 'var(--card-background-color)';
        dropdownContent2.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dropdownContent2.style.zIndex = '10';
        
        const options = [
            { value: 'artist', label: t.artist_label },
            { value: 'track', label: t.track_label },
            { value: 'album', label: t.album_label },
            { value: 'playlist', label: t.playlist_label },
            { value: 'radio', label: t.radio_label },
        ];
        
        let selectedMediaType = ''; // Standaardwaarde

        options.forEach(option => {
            const dropdownOption = document.createElement('div');
            dropdownOption.textContent = option.label;
            dropdownOption.style.padding = '8px';
            dropdownOption.style.cursor = 'pointer';
            dropdownOption.style.borderBottom = '1px solid var(--divider-color)';
            
            // Klik-event voor het selecteren van een optie
            dropdownOption.addEventListener('click', () => {
                selectedMediaType = option.value; // Stel de waarde in
                localStorage.setItem('mass-search-card-media-type', option.value);
                dropdownButton2.textContent = option.label; // Toon label in de knop
                dropdownButton2.appendChild(dropdownIcon2); // Re-add icon after changing text
                dropdownContent2.style.display = 'none'; // Verberg de dropdown
            });
            
            // Hover-effecten
            dropdownOption.addEventListener('mouseover', () => {
                dropdownOption.style.backgroundColor = 'orange';
            });
            dropdownOption.addEventListener('mouseout', () => {
                dropdownOption.style.backgroundColor = 'transparent';
            });
            
            dropdownContent2.appendChild(dropdownOption);
        });

        // Pre-selecteer op basis van config of localStorage
        const savedMediaType = this.config?.default_media_type || localStorage.getItem('mass-search-card-media-type');
        if (savedMediaType) {
            const match = options.find(o => o.value === savedMediaType);
            if (match) {
                selectedMediaType = match.value;
                dropdownButton2.textContent = match.label;
                dropdownButton2.appendChild(dropdownIcon2);
            }
        }

        // Klik-event voor de dropdown-knop
        dropdownButton2.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdownContent2.style.display !== 'none';
            dropdownContent1.style.display = 'none';
            dropdownContent2.style.display = 'none';
            if (!isOpen) dropdownContent2.style.display = 'block';
        });
        
        // Voeg dropdown-elementen toe aan de DOM
        dropdown2.appendChild(dropdownButton2);
        dropdown2.appendChild(dropdownContent2);
        

        // Voeg dropdowns toe aan container
        buttonContainer.appendChild(icon);
        buttonContainer.appendChild(dropdown1);
        buttonContainer.appendChild(dropdown2);

        const compact = this.config.compact === true;
        const hideSelectors = this.config.hide_selectors === true;

        // Voeg de kaarten en invoer toe aan de wrapper
        if (!compact) wrapper.appendChild(titleContainer);
        wrapper.appendChild(inputContainer);
        if (!compact) wrapper.appendChild(searchsettingContainer);
        if (!hideSelectors) wrapper.appendChild(buttonContainer);

        // Voeg de wrapper toe aan de shadow DOM
        this.shadowRoot.innerHTML = ''; // Wis bestaande inhoud
        this.shadowRoot.appendChild(style);  // Stijl opnieuw toevoegen na de reset
        this.shadowRoot.appendChild(wrapper);

        // Klikken binnen de dropdowns mogen niet naar document bubbelen
        dropdown1.addEventListener('click', (e) => e.stopPropagation());
        dropdown2.addEventListener('click', (e) => e.stopPropagation());

        // Sluit dropdowns bij klik buiten de kaart (cleanup oude handler bij herinitialisatie)
        if (this._closeDropdowns) document.removeEventListener('click', this._closeDropdowns);
        this._closeDropdowns = () => {
            dropdownContent1.style.display = 'none';
            dropdownContent2.style.display = 'none';
        };
        document.addEventListener('click', this._closeDropdowns);
    }

    async _playWithAnimation(btn, action) {
        // 1. Scale-down: directe tactiele feedback
        btn.style.transition = 'transform 0.1s ease';
        btn.style.transform = 'scale(0.95)';
        btn.disabled = true;
        const prevPosition = btn.style.position;
        const prevOverflow = btn.style.overflow;
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';

        await new Promise(r => setTimeout(r, 100));
        btn.style.transform = 'scale(1)';

        // 2. Spinner overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.18);border-radius:inherit;';

        const spinner = document.createElement('span');
        spinner.style.cssText = 'display:inline-block;width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.9);border-top-color:transparent;border-radius:50%;animation:mass-spin 0.6s linear infinite;';
        overlay.appendChild(spinner);
        btn.appendChild(overlay);

        // 3. Actie uitvoeren
        try { await action(); } catch (e) { console.error(e); }

        // 4. Vinkje
        overlay.innerHTML = '';
        const check = document.createElement('span');
        check.textContent = '✓';
        check.style.cssText = 'font-size:20px;font-weight:bold;color:white;line-height:1;';
        overlay.appendChild(check);

        await new Promise(r => setTimeout(r, 800));

        // 5. Herstel
        btn.removeChild(overlay);
        btn.disabled = false;
        btn.style.position = prevPosition;
        btn.style.overflow = prevOverflow;
        btn.style.transition = '';
    }

    showPopup(response, title, t, mediaType, favoritesOnly = false, mediaPlayers = [], selectedSort = 'default') {
        // Maak een popup-container
        const popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '0';
        popupContainer.style.left = '0';
        popupContainer.style.width = '100vw';
        popupContainer.style.height = '100vh';
        popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        popupContainer.style.display = 'flex';
        popupContainer.style.alignItems = 'center';
        popupContainer.style.justifyContent = 'center';
        popupContainer.style.zIndex = '9999';
    
        // Maak een popup-venster
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.style.backgroundColor = 'var(--card-background-color)';
        popup.style.borderRadius = '24px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.padding = '16px';
        popup.style.width = '400px';
        popup.style.maxHeight = '80vh';
        popup.style.overflowY = 'auto';
    
        const popupTitle = document.createElement('h2');
        popupTitle.innerHTML = title;
        popupTitle.style.color = 'var(--primary-text-color)';
        popupTitle.style.marginBottom = '16px';
        popup.appendChild(popupTitle);

        // Helper function to create an image container
        function createImageContainer(imageUrl) {
            const imageContainer = document.createElement('div');
            imageContainer.style.flex = '0 0 50px';
            imageContainer.style.display = 'flex';
            imageContainer.style.alignItems = 'center';
            imageContainer.style.justifyContent = 'center';

            function buildPlaceholder() {
                const ph = document.createElement('div');
                ph.style.cssText = 'width:40px;height:40px;border-radius:50%;background:var(--primary-color,#ff9800);display:flex;align-items:center;justify-content:center;flex-shrink:0;';
                ph.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="rgba(255,255,255,0.9)" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"/></svg>';
                return ph;
            }

            if (!imageUrl || (imageUrl.startsWith('http') && !imageUrl.startsWith('https'))) {
                if (imageUrl) console.warn('Insecure HTTP URL detected, using placeholder.');
                imageContainer.appendChild(buildPlaceholder());
            } else {
                const image = document.createElement('img');
                image.style.width = '40px';
                image.style.height = '40px';
                image.style.borderRadius = '50%';
                image.style.objectFit = 'cover';
                image.src = imageUrl;
                image.onerror = () => {
                    image.remove();
                    imageContainer.appendChild(buildPlaceholder());
                };
                imageContainer.appendChild(image);
            }

            return imageContainer;
        }

        function createTextContainer(title, artistName, albumName, isArtist, isTrack, isAlbum, isRadio, isPlaylist) {
            const textContainer = document.createElement('div');
            textContainer.style.flex = '1';
            textContainer.style.textAlign = 'center';
            textContainer.style.display = 'flex';
            textContainer.style.flexDirection = 'column';
            textContainer.style.alignItems = 'center';
            textContainer.style.justifyContent = 'center';
        
            if (isAlbum || isRadio || isPlaylist) {
                // For artists, albums, and radio, only display title and artist
                textContainer.innerHTML = `
                    <div style="font-weight: bold;">${title}</div>
                    <div style="font-size: 12px; color: var(--secondary-text-color);">${artistName}</div>
                `;
            } else if (isArtist) {
                // For artists, albums, and radio, only display title and artist
                textContainer.innerHTML = `
                    <div style="font-weight: bold;">${title}</div>
                `;                
            } else if (isTrack) {
                // For tracks, display title, artist, and album
                textContainer.innerHTML = `
                    <div style="font-weight: bold;">${title}</div>
                    <div style="font-size: 12px; color: var(--secondary-text-color);">${artistName}</div>
                    <div style="font-size: 12px; color: var(--secondary-text-color);">${albumName}</div>
                `;
            }
        
            return textContainer;
        }

        function createIconContainer(uri, showEye = false) {
            const iconContainer = document.createElement('div');
            iconContainer.style.flex = '0 0 80px';
            iconContainer.style.display = 'flex';
            iconContainer.style.alignItems = 'center';
            iconContainer.style.justifyContent = 'space-evenly';
        
            const icons = [];
        
            if (uri.includes('ytmusic')) {
                const youtubeIcon = document.createElement('img');
                youtubeIcon.src = "data:image/png;base64,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";
                youtubeIcon.alt = 'youtube-music';
                icons.push(youtubeIcon);
            }
        
            if (uri.includes('spotify')) {
                const spotifyIcon = document.createElement('img');
                spotifyIcon.src = "data:image/png;base64,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";
                spotifyIcon.alt = 'spotify';
                icons.push(spotifyIcon);
            }
        
            if (uri.includes('library')) {
                const libraryIcon = document.createElement('img');
                libraryIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABcUlEQVR4nO2UvytFcRjGP2L2JxgkJZPdn4CUlMkgEhYxXVm4YWWUGNSlLGQwsJJRRlmUexVlQInE0akz6Ol73G73OOc9+j71LOd9vs95P50f4OXl5WVdTUARqABBjJ8jx83LwGLUlbqKvyxWqxeyAKgkCBB2pa4gYWcO0COutuC/BmgEWoDmPAF0AbPAEfASXXsHCnkBiPMX0J1ngADYyjvATR4AwiUPgWVgInp1fs5brQP0yvmyzEesA4zL+WOZb1sHWJPzqzK/tQ5wIufHHJk2ywB3jo5HyYxaBgg9LB2nMi9ZB1iRjg3HUzINcCAd045Mu2WAa+noA14dv1uzAJ/AoPRcSGbXMkDoeekpyfweaLAMsCM9c45Mh2WAS+kZAD4kM2kZ4A3ol64ryexZBgg9I137Mn9I4jv4S4BN6VpyZDotA5wDU8A6cAY8OTJD9S5szVWV9YKBByDnr5Cq7oKs7xd4gNoU+Cfg5eXlRVr6BpbC54Jw2EDaAAAAAElFTkSuQmCC";
                libraryIcon.alt = 'library';
                icons.push(libraryIcon);
            }
        
            const iconSize = icons.length > 2 ? '24px' : '32px';
            icons.forEach(icon => {
                icon.style.width = iconSize;
                icon.style.height = iconSize;
                icon.style.marginLeft = '4px';
                icon.style.marginRight = '4px';
                iconContainer.appendChild(icon);
            });

            if (showEye) {
                const eyeEl = document.createElement('span');
                eyeEl.dataset.eye = 'true';
                eyeEl.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="var(--primary-color)" style="display:block;"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
                eyeEl.style.display = 'flex';
                eyeEl.style.alignItems = 'center';
                eyeEl.style.marginLeft = '4px';
                eyeEl.style.marginRight = '4px';
                eyeEl.style.cursor = 'pointer';
                iconContainer.insertBefore(eyeEl, iconContainer.firstChild);
            }

            if (icons.length === 0 && !showEye) {
                iconContainer.style.justifyContent = 'flex-end';
            }

            return iconContainer;
        }

        // Main logic for Tracks and Albums
        if (response?.response?.artists?.length || response?.response?.tracks?.length || response?.response?.albums?.length || response?.response?.radio?.length || response?.response?.playlists?.length) {
            let mediaItems = [
                ...(response.response.artists || []),
                ...(response.response.tracks || []),
                ...(response.response.albums || []),
                ...(response.response.radio || []),
                ...(response.response.playlists || []),
            ];

            if (favoritesOnly) {
                mediaItems = mediaItems.filter(item => item.favorite === true);
            }

            if (selectedSort === 'name') {
                mediaItems.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            } else if (selectedSort === 'artist') {
                mediaItems.sort((a, b) => {
                    const aA = a.artists?.[0]?.name || a.name || '';
                    const bA = b.artists?.[0]?.name || b.name || '';
                    return aA.localeCompare(bA);
                });
            }

            mediaItems.forEach(async (mediaItem) => {
                const button = document.createElement('button');
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'space-between';
                button.style.marginBottom = '8px';
                button.style.padding = '8px';
                button.style.width = '100%';
                button.style.border = '1px solid var(--primary-color)';
                button.style.borderRadius = '24px';
                button.style.backgroundColor = 'var(--card-background-color)';
                button.style.color = 'var(--primary-text-color)';
                button.style.cursor = 'pointer';
            
                // Determine whether it is a track or album
                const isArtist = mediaItem.uri && mediaItem.uri.includes('artist');
                const isTrack = mediaItem.uri && mediaItem.uri.includes('track');
                const isAlbum = mediaItem.uri && mediaItem.uri.includes('album');
                const isRadio = mediaItem.uri && mediaItem.uri.includes('radio');
                const isPlaylist = mediaItem.uri && mediaItem.uri.includes('playlist');
            
                let imageUrl = mediaItem.image; //|| await convertImageToBase64(mediaItem.image);
                const imageContainer = createImageContainer(imageUrl);
            
                // For Tracks or Albums, handle the text and title accordingly
                const title = mediaItem.name || 'Unknown Title';
                const artistName = mediaItem.artists?.[0]?.name || (isRadio ? t.radio_label : isPlaylist ? t.playlist_label : t.unknown_artist);
                const albumName = isTrack ? mediaItem.album?.name || '' : ''; // Only for tracks
            
                const textContainer = createTextContainer(title, artistName, albumName, isArtist, isTrack, isAlbum, isRadio, isPlaylist);
            
                // Create icon container
                const iconContainer = createIconContainer(mediaItem.uri, isAlbum || isPlaylist);
            
                // Append all containers to the button
                button.appendChild(imageContainer);
                button.appendChild(textContainer);
                button.appendChild(iconContainer);
            
                if (isAlbum || isPlaylist) {
                    const eyeEl = iconContainer.querySelector('[data-eye]');
                    if (eyeEl) {
                        eyeEl.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.showTracklist(mediaItem, t, mediaPlayers);
                        });
                    }
                }

                button.addEventListener('click', () => {
                    this._playWithAnimation(button, async () => {
                        for (const playerId of mediaPlayers) {
                            await this.hass.callService('music_assistant', 'play_media', {
                                entity_id: playerId,
                                media_type: mediaType,
                                media_id: mediaItem.uri,
                            });
                        }
                    });
                });
            
                popup.appendChild(button);
            });
        } else {
            const noResults = document.createElement('p');
            noResults.textContent = t.no_results;
            noResults.style.color = 'var(--primary-text-color)';
            popup.appendChild(noResults);
        }

        const closeButton = document.createElement('button');
        closeButton.textContent = t.close_button;
        closeButton.style.marginTop = '16px';
        closeButton.style.padding = '8px 16px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '24px';
        closeButton.style.backgroundColor = 'var(--primary-color)';
        closeButton.style.color = 'var(--card-background-color)';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            this.shadowRoot.removeChild(popupContainer);
        });
        popup.appendChild(closeButton);

        popupContainer.appendChild(popup);
        this.shadowRoot.appendChild(popupContainer);
    }

    showTracklist(parentItem, t, mediaPlayers) {
        const overlayContainer = document.createElement('div');
        overlayContainer.style.position = 'fixed';
        overlayContainer.style.top = '0';
        overlayContainer.style.left = '0';
        overlayContainer.style.width = '100vw';
        overlayContainer.style.height = '100vh';
        overlayContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlayContainer.style.display = 'flex';
        overlayContainer.style.alignItems = 'center';
        overlayContainer.style.justifyContent = 'center';
        overlayContainer.style.zIndex = '10000';

        const panel = document.createElement('div');
        panel.classList.add('popup');
        panel.style.backgroundColor = 'var(--card-background-color)';
        panel.style.borderRadius = '24px';
        panel.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        panel.style.padding = '16px';
        panel.style.width = '400px';
        panel.style.maxHeight = '80vh';
        panel.style.overflowY = 'auto';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.gap = '8px';

        // Header: cover + titel + artiest
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '12px';
        header.style.marginBottom = '4px';

        const coverPlaceholder = () => {
            const ph = document.createElement('div');
            ph.style.cssText = 'width:56px;height:56px;border-radius:8px;background:var(--primary-color,#ff9800);display:flex;align-items:center;justify-content:center;flex-shrink:0;';
            ph.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="rgba(255,255,255,0.9)" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"/></svg>';
            return ph;
        };
        let coverImg;
        if (!parentItem.image) {
            coverImg = coverPlaceholder();
        } else {
            coverImg = document.createElement('img');
            coverImg.src = parentItem.image;
            coverImg.style.width = '56px';
            coverImg.style.height = '56px';
            coverImg.style.borderRadius = '8px';
            coverImg.style.objectFit = 'cover';
            coverImg.style.flexShrink = '0';
            coverImg.onerror = () => {
                const ph = coverPlaceholder();
                coverImg.replaceWith(ph);
            };
        }

        const headerText = document.createElement('div');
        headerText.style.flex = '1';
        headerText.style.overflow = 'hidden';

        const titleEl = document.createElement('div');
        titleEl.textContent = parentItem.name;
        titleEl.style.fontWeight = 'bold';
        titleEl.style.fontSize = '16px';
        titleEl.style.overflow = 'hidden';
        titleEl.style.textOverflow = 'ellipsis';
        titleEl.style.whiteSpace = 'nowrap';

        headerText.appendChild(titleEl);

        const artistName = parentItem.artists?.[0]?.name;
        if (artistName) {
            const artistEl = document.createElement('div');
            artistEl.textContent = artistName;
            artistEl.style.fontSize = '13px';
            artistEl.style.color = 'var(--secondary-text-color)';
            artistEl.style.overflow = 'hidden';
            artistEl.style.textOverflow = 'ellipsis';
            artistEl.style.whiteSpace = 'nowrap';
            headerText.appendChild(artistEl);
        }

        header.appendChild(coverImg);
        header.appendChild(headerText);
        panel.appendChild(header);

        // Play all knop
        const playAllBtn = document.createElement('button');
        playAllBtn.textContent = t.play_all;
        playAllBtn.style.padding = '8px 16px';
        playAllBtn.style.border = 'none';
        playAllBtn.style.borderRadius = '24px';
        playAllBtn.style.backgroundColor = 'var(--primary-color)';
        playAllBtn.style.color = 'var(--card-background-color)';
        playAllBtn.style.cursor = 'pointer';
        playAllBtn.style.fontWeight = 'bold';
        playAllBtn.style.alignSelf = 'flex-start';
        playAllBtn.addEventListener('click', () => {
            const contentType = parentItem.uri.includes('playlist') ? 'playlist' : 'album';
            this._playWithAnimation(playAllBtn, async () => {
                for (const playerId of mediaPlayers) {
                    await this.hass.callService('music_assistant', 'play_media', {
                        entity_id: playerId,
                        media_type: contentType,
                        media_id: parentItem.uri,
                    });
                }
            });
        });
        panel.appendChild(playAllBtn);

        // Laad-indicator
        const loadingEl = document.createElement('p');
        loadingEl.textContent = t.loading;
        loadingEl.style.color = 'var(--secondary-text-color)';
        loadingEl.style.textAlign = 'center';
        loadingEl.style.margin = '8px 0';
        panel.appendChild(loadingEl);

        overlayContainer.appendChild(panel);
        this.shadowRoot.appendChild(overlayContainer);

        // Haal nummers op via browse_media
        const entityId = mediaPlayers[0];
        const contentType = parentItem.uri.includes('playlist') ? 'playlist' : 'album';

        this.hass.connection.sendMessagePromise({
            type: 'media_player/browse_media',
            entity_id: entityId,
            media_content_id: parentItem.uri,
            media_content_type: contentType,
        }).then(result => {
            loadingEl.remove();
            const tracks = result.children || [];

            if (tracks.length === 0) {
                const noTracks = document.createElement('p');
                noTracks.textContent = t.no_results;
                noTracks.style.color = 'var(--secondary-text-color)';
                noTracks.style.textAlign = 'center';
                panel.insertBefore(noTracks, closeBtn);
                return;
            }

            tracks.forEach((track, index) => {
                const trackRow = document.createElement('button');
                trackRow.style.display = 'flex';
                trackRow.style.alignItems = 'center';
                trackRow.style.gap = '10px';
                trackRow.style.padding = '8px 12px';
                trackRow.style.border = '1px solid var(--divider-color)';
                trackRow.style.borderRadius = '12px';
                trackRow.style.backgroundColor = 'var(--card-background-color)';
                trackRow.style.color = 'var(--primary-text-color)';
                trackRow.style.cursor = 'pointer';
                trackRow.style.width = '100%';
                trackRow.style.textAlign = 'left';
                trackRow.style.boxSizing = 'border-box';

                const num = document.createElement('span');
                num.textContent = String(index + 1);
                num.style.fontSize = '12px';
                num.style.color = 'var(--secondary-text-color)';
                num.style.minWidth = '24px';
                num.style.textAlign = 'right';
                num.style.flexShrink = '0';

                const trackTitle = document.createElement('span');
                trackTitle.textContent = track.title;
                trackTitle.style.flex = '1';
                trackTitle.style.fontSize = '14px';
                trackTitle.style.overflow = 'hidden';
                trackTitle.style.textOverflow = 'ellipsis';
                trackTitle.style.whiteSpace = 'nowrap';

                trackRow.appendChild(num);
                trackRow.appendChild(trackTitle);

                trackRow.addEventListener('mouseover', () => { trackRow.style.backgroundColor = 'orange'; trackRow.style.color = 'white'; });
                trackRow.addEventListener('mouseout', () => { trackRow.style.backgroundColor = 'var(--card-background-color)'; trackRow.style.color = 'var(--primary-text-color)'; });

                trackRow.addEventListener('click', () => {
                    this._playWithAnimation(trackRow, async () => {
                        for (const playerId of mediaPlayers) {
                            await this.hass.callService('music_assistant', 'play_media', {
                                entity_id: playerId,
                                media_type: 'track',
                                media_id: track.media_content_id,
                            });
                        }
                    });
                });

                panel.insertBefore(trackRow, closeBtn);
            });
        }).catch(err => {
            loadingEl.textContent = t.error_fetching;
            console.error('Error fetching tracklist:', err);
        });

        // Sluit-knop
        const closeBtn = document.createElement('button');
        closeBtn.textContent = t.close_button;
        closeBtn.style.marginTop = '8px';
        closeBtn.style.padding = '8px 16px';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '24px';
        closeBtn.style.backgroundColor = 'var(--primary-color)';
        closeBtn.style.color = 'var(--card-background-color)';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.alignSelf = 'center';
        closeBtn.addEventListener('click', () => {
            this.shadowRoot.removeChild(overlayContainer);
        });
        panel.appendChild(closeBtn);
    }

///////////////////////////////////////////////////////////////////////////////////////////////
    set hass(hass) {
        this._hass = hass;

        const newEntities = Object.keys(hass.states)
            .filter((entityId) => {
                const entity = hass.states[entityId];
                return entityId.startsWith('media_player.') && entity.attributes.mass_player_type;
            })
            .map((entityId) => ({
                entity_id: entityId,
                name: hass.states[entityId].attributes.friendly_name || entityId,
            }));

        // Dropdown alleen herbouwen als spelerslijst veranderd is
        const newIds = newEntities.map(e => e.entity_id).sort().join(',');
        const changed = newIds !== (this._lastPlayerIds || '');
        this._lastPlayerIds = newIds;
        this.mediaPlayerEntities = newEntities;

        // BUGFIX 1: ConfigEntryId (Music Assistant) laden, BEVOR wegen fehlendem Dropdown abgebrochen wird
        if (!this.configEntryId) {
            this._hass.callApi('GET', 'config/config_entries/entry').then((entries) => {
                const entry = entries.find((e) => e.domain === 'music_assistant');
                this.configEntryId = entry ? entry.entry_id : 'Not found';
            });
        }

        // BUGFIX 2: Standard-Player laden, BEVOR wegen fehlendem Dropdown abgebrochen wird
        if (!this.selectedMediaPlayers.length) {
            const saved = this.config?.default_player
                ? [this.config.default_player]
                : JSON.parse(localStorage.getItem('mass-search-card-players') || '[]');
            this.selectedMediaPlayers = saved.filter(id => this.mediaPlayerEntities.some(e => e.entity_id === id));
        }

        const dropdownContent1 = this.shadowRoot.querySelector('.dropdown-content1');
        
        // Wenn das Dropdown nicht existiert (Compact Mode / Versteckt), brich hier ab. 
        // Die wichtigen Daten wurden durch den Bugfix oben nun trotzdem geladen!
        if (!dropdownContent1) return; 

        if (!changed) return; // Geen wijzigingen — sla DOM-update over

        dropdownContent1.innerHTML = '';

        const t_hass = this._t || { dropdown_label_media_player: 'Selecteer een media player', players_selected: '{n} spelers' };

        const updatePlayerButtonLabel = (btn) => {
            const count = this.selectedMediaPlayers.length;
            btn.textContent = count === 0
                ? t_hass.dropdown_label_media_player
                : count === 1
                    ? (this.mediaPlayerEntities.find(e => e.entity_id === this.selectedMediaPlayers[0])?.name || this.selectedMediaPlayers[0])
                    : t_hass.players_selected.replace('{n}', count);
            const icon = document.createElement('span');
            icon.textContent = '▼';
            icon.style.marginLeft = 'auto';
            icon.style.fontSize = '12px';
            icon.style.pointerEvents = 'none';
            btn.appendChild(icon);
        };

        if (this.mediaPlayerEntities.length > 0) {
            this.mediaPlayerEntities.forEach((entity) => {
                const option = document.createElement('div');
                option.style.padding = '8px';
                option.style.cursor = 'pointer';
                option.style.borderBottom = '1px solid var(--divider-color)';
                option.style.display = 'flex';
                option.style.alignItems = 'center';
                option.style.gap = '8px';

                const lbl = document.createElement('span');
                lbl.textContent = entity.name;

                option.dataset.entityId = entity.entity_id;

                if (this.config?.multiroom) {
                    const chk = document.createElement('input');
                    chk.type = 'checkbox';
                    chk.style.pointerEvents = 'none';
                    chk.checked = this.selectedMediaPlayers.includes(entity.entity_id);
                    option.appendChild(chk);
                }

                option.appendChild(lbl);

                option.addEventListener('click', () => {
                    if (this.config?.multiroom) {
                        // Multi-select: toggle
                        const idx = this.selectedMediaPlayers.indexOf(entity.entity_id);
                        if (idx === -1) {
                            this.selectedMediaPlayers.push(entity.entity_id);
                        } else {
                            this.selectedMediaPlayers.splice(idx, 1);
                        }
                        const chk = option.querySelector('input[type="checkbox"]');
                        if (chk) chk.checked = this.selectedMediaPlayers.includes(entity.entity_id);
                    } else {
                        // Single-select: vervang selectie en sluit dropdown
                        this.selectedMediaPlayers = [entity.entity_id];
                        dropdownContent1.style.display = 'none';
                    }
                    localStorage.setItem('mass-search-card-players', JSON.stringify(this.selectedMediaPlayers));
                    const btn = this.shadowRoot.querySelector('#mass-search-player-btn');
                    if (btn) updatePlayerButtonLabel(btn);
                });

                option.addEventListener('mouseover', () => { option.style.backgroundColor = 'orange'; });
                option.addEventListener('mouseout', () => { option.style.backgroundColor = 'transparent'; });

                dropdownContent1.appendChild(option);
            });
        } else {
            const noOption = document.createElement('div');
            noOption.textContent = 'Geen mediaplayers beschikbaar';
            noOption.style.padding = '8px';
            noOption.style.color = 'var(--disabled-text-color)';
            dropdownContent1.appendChild(noOption);
        }

        // Update den Label-Button, falls das Element existiert
        const btn = this.shadowRoot.querySelector('#mass-search-player-btn');
        if (btn) updatePlayerButtonLabel(btn);

        // Sync checkboxes met huidige selectie (alleen bij multiroom)
        if (this.config?.multiroom) {
            dropdownContent1.querySelectorAll('[data-entity-id]').forEach(opt => {
                const chk = opt.querySelector('input[type="checkbox"]');
                if (chk) chk.checked = this.selectedMediaPlayers.includes(opt.dataset.entityId);
            });
        }
    }
    get hass() {
        return this._hass;
      }
    getCardSize() {
        return 9;
    }
}
customElements.define('mass-search-card', MassSearchCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'mass-search-card',
    name: 'Mass Search Card',
    description: 'Search and play media using Music Assistant',
    preview: false,
});
