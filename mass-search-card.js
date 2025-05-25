/**
 * @customElement
 * @cardType mass-search-card
 * @description Search and play media using Music Assistant in Home Assistant
 */

class MassSearchCard extends HTMLElement {
    async setConfig(config) {
        this.config = config;

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
            
        }

        // Voeg de media query toe voor kleinere schermen
        const style = document.createElement('style');
        style.textContent = `
          @media (max-width: 600px) {
            .dropdown-button, .input-container, .button-container {
              width: 100%; /* Allow full width for smaller screens */
            }
            .popup {
              max-width: 90vw; /* Scale down the popup for mobile */
            }
            .icon {
              font-size: 20px; /* Reduce icon size */
            }
            .button {
              font-size: 14px; /* Adjust font size for better readability */
            }
          }
        `;
        
        // Voeg de stijl toe aan de shadowRoot
        this.shadowRoot.appendChild(style);        

        const translations = {
            nl: {
                album_label: 'Album',
                artist_label: 'Artiest',
                close_button: 'Sluiten',
                dropdown_label_media_player: 'Selecteer een media player',
                error_fetching: 'Er is een fout opgetreden bij het ophalen van de resultaten.',
                library_only_label: 'Lokaal',
                media_type: 'Soort media',
                no_results: 'Geen resultaten gevonden.',
                playing_media: 'Media afgespeeld:',
                playlist_label: 'Afspeellijst',
                popup_title: 'Zoekresultaten voor:',
                radio_label: 'Radio',
                results_label: 'Aantal resultaten',
                search_button: 'Zoeken',
                search_placeholder: 'Typ hier je zoekterm...',
                select_media_type: 'Selecteer media type',
                title_text: 'Zoek in Music Assistant',
                track_label: 'Nummer',
                unknown_artist: 'Onbekende artiest',
                unknown_duration: 'Onbekende duur',
            },
            cs: {
                album_label: 'Album',
                artist_label: 'Umělec',
                close_button: 'Zavřít',
                dropdown_label_media_player: 'Vyberte přehrávač médií',
                error_fetching: 'Při načítání výsledků došlo k chybě.',
                library_only_label: 'Pouze knihovna',
                media_type: 'Typ média',
                no_results: 'Nebyly nalezeny žádné výsledky.',
                playing_media: 'Přehrané médium:',
                playlist_label: 'Seznam skladeb',
                popup_title: 'Výsledky hledání pro:',
                radio_label: 'Rádio',
                results_label: 'Počet výsledků',
                search_button: 'Hledat',
                search_placeholder: 'Zadejte hledaný výraz...',
                select_media_type: 'Vyberte typ média',
                title_text: 'Hledat v Music Assistant',
                track_label: 'Skladba',
                unknown_artist: 'Neznámý umělec',
                unknown_duration: 'Neznámá délka',
            },
            en: {
                album_label: 'Album',
                artist_label: 'Artist',
                close_button: 'Close',
                dropdown_label_media_player: 'Select a media player',
                error_fetching: 'An error occurred while fetching results.',
                library_only_label: 'Local library',
                media_type: 'Media type',
                no_results: 'No results found.',
                playing_media: 'Media played:',
                playlist_label: 'Playlist',
                popup_title: 'Search Results for:',
                radio_label: 'Radio',
                results_label: 'Number of results',
                search_button: 'Search',
                search_placeholder: 'Type your search term here...',
                select_media_type: 'Select media type',
                title_text: 'Search in Music Assistant',
                track_label: 'Track',
                unknown_artist: 'Unknown artist',
                unknown_duration: 'Unknown duration',
            },
            sv: {
                album_label: 'Album',
                artist_label: 'Artist',
                close_button: 'Stäng',
                dropdown_label_media_player: 'Välj mediaspelare',
                error_fetching: 'Ett fel uppstod när resultat hämtades.',
                library_only_label: 'Endast bibliotek',
                media_type: 'Mediatyp',
                no_results: 'Inga resultat funna.',
                playing_media: 'Media spelad:',
                playlist_label: 'Spellista',
                popup_title: 'Sökresultat för:',
                radio_label: 'Radio',
                results_label: 'Antal resultat',
                search_button: 'Sök',
                search_placeholder: 'Sök här…',
                select_media_type: 'Välj mediatyp',
                title_text: 'Sök i Music Assistant',
                track_label: 'Spår',
                unknown_artist: 'Okänd artist',
                unknown_duration: 'Okänd varaktighet',
            },
            cz: {
                album_label: 'Album',
                artist_label: 'Umělec',
                close_button: 'Zavřít',
                dropdown_label_media_player: 'Vyberte přehrávač',
                error_fetching: 'Při načítání výsledků došlo k chybě.',
                library_only_label: 'Lokální knihovna',
                media_type: 'Typ média',
                no_results: 'Nebyly nalezeny žádné výsledky.',
                playing_media: 'Přehráváno: ',
                playlist_label: 'Seznam skladeb',
                popup_title: 'Výsledky hledání pro:',
                radio_label: 'Rádio',
                results_label: 'Počet výsledků',
                search_button: 'Hledat',
                search_placeholder: 'Zadejte hledaný výraz...',
                select_media_type: 'Vyberte typ média',
                title_text: 'Hledat v Music Assistant',
                track_label: 'Skladba',
                unknown_artist: 'Neznámý umělec',
                unknown_duration: 'Neznámá délka',                
            }             
          };
      
          const language = this.config.language || this.hass?.language || 'en';
          const t = translations[language] || translations.en;
          this.selectedMediaPlayer = null;
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
                const mediaPlayer = this.selectedMediaPlayer;
                const configEntryId = this.configEntryId;
                const limit = parseInt(inputlimitresults.value, 10) || 8;
                const libraryOnly = checkbox.checked; // Checkbox voor lokale bibliotheek
        
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
                if (!mediaPlayer) {
                    // Toon een waarschuwing als er geen speler is geselecteerd
                    alert(t.dropdown_label_media_player);
                    return;
                }
                if (!mediaType) {
                    alert(t.select_media_type);
                    return;
                }
                try {
                    console.log('Sending service message:', message);
                    const response = await this.hass.connection.sendMessagePromise(message);
                
                    console.log('Service Response:', response);
                    if (response) {
                        let title; // Dynamische titel gebaseerd op zoekterm
                        // Dynamische titel aanpassing op basis van lengte
                        if (query.length + mediaType.length > 39) {
                            title = `${t.popup_title}<br>"${query}" (${mediaType})`;
                        } else {
                            title = `${t.popup_title} "${query}" (${mediaType})`;
                        }
                        this.showPopup(response, title, t);
                    }
                } catch (error) {
                    console.error('Error during service call:', error);
                }
            } else {
                console.error('No valid hass object found.');
            }
        });

        // Samenvoegen
        inputContainer.appendChild(input);
        inputContainer.appendChild(icon_searchbar);
        document.body.appendChild(inputContainer);

        const searchsettingContainer = document.createElement('div');
        searchsettingContainer.style.display = 'flex';
        searchsettingContainer.style.alignItems = 'center';
        searchsettingContainer.style.gap = '12px';

        // Maak een eigen invoerveld voor maximale resultaten
        const inputlimitresultsContainer = document.createElement('div');
        inputlimitresultsContainer.style.display = 'flex';
        inputlimitresultsContainer.style.flexDirection = 'row';
        inputlimitresultsContainer.style.alignItems = 'center';
        inputlimitresultsContainer.style.border = '1px solid var(--primary-color)';
        inputlimitresultsContainer.style.borderRadius = '24px'; // Ronde hoeken
        inputlimitresultsContainer.style.backgroundColor = 'var(--card-background-color)';
        inputlimitresultsContainer.style.position = 'relative';
        inputlimitresultsContainer.style.height = '48.4px';

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

        // Checkbox container
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.alignItems = 'center';
        checkboxContainer.style.marginRight = '0px';
        checkboxContainer.style.padding= '0px 16px';
        checkboxContainer.style.flexDirection = 'row';
        checkboxContainer.style.alignItems = 'center';
        checkboxContainer.style.border = '1px solid var(--primary-color)';
        checkboxContainer.style.borderRadius = '24px'; // Ronde hoeken
        checkboxContainer.style.backgroundColor = 'var(--card-background-color)';
        checkboxContainer.style.position = 'relative';
        checkboxContainer.style.height = '48.4px';        

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.margin = '0 2px';
        checkboxContainer.appendChild(checkbox);

        // Checkbox label
        const checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = t.library_only_label;
        checkboxLabel.style.color = 'var(--primary-text-color)';
        checkboxLabel.style.fontSize = '14px';
        checkboxLabel.style.padding = '8px';
        checkboxContainer.appendChild(checkboxLabel);

        searchsettingContainer.appendChild(inputlimitresultsContainer);
        searchsettingContainer.appendChild(checkboxContainer);
        document.body.appendChild(searchsettingContainer);

        // Maak een eigen wrapper voor alle elementen
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.border = '1px solid var(--primary-color)';
        wrapper.style.borderRadius = '16px';
        wrapper.style.backgroundColor = 'var(--card-background-color)';
        wrapper.style.padding = '16px';
        wrapper.style.gap = '16px';
        wrapper.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        wrapper.style.width = '100%'; // Ensure it scales with the screen width
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
            
        // Maak de dropdown-knop
        const dropdownButton1 = document.createElement('button');
        dropdownButton1.textContent = t.dropdown_label_media_player;
        dropdownButton1.style.width = '225px';
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
            
        // Voeg de knop toe aan de dropdown-container
        dropdown1.appendChild(dropdownButton1);
            
        const dropdownContent1 = document.createElement('div');
        dropdownContent1.style.display = 'none';
        dropdownContent1.style.position = 'absolute';
        dropdownContent1.style.top = '100%';
        dropdownContent1.style.left = '0';
        dropdownContent1.style.width = '225px';
        dropdownContent1.style.border = '1px solid var(--primary-color)';
        dropdownContent1.style.borderRadius = '8px';
        dropdownContent1.style.backgroundColor = 'var(--card-background-color)';
        dropdownContent1.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dropdownContent1.style.zIndex = '10';
        dropdownContent1.classList.add('dropdown-content1');

        // Toggle dropdown bij klikken op de knop
        dropdownButton1.addEventListener('click', () => {
            dropdownContent1.style.display = dropdownContent1.style.display === 'none' ? 'block' : 'none';
        });
        
        // Voeg de dropdown-inhoud toe aan de container
        dropdown1.appendChild(dropdownButton1);
        dropdown1.appendChild(dropdownContent1);

        // Maak de dropdown container
        const dropdown2 = document.createElement('div');
        dropdown2.style.position = 'relative';
        dropdown2.style.flex = '1';

        // Maak de dropdown-knop
        const dropdownButton2 = document.createElement('button');
        dropdownButton2.textContent = t.media_type;
        dropdownButton2.style.width = '120px'; // Breder voor langere labels
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

        // Voeg de knop toe aan de dropdown-container
        dropdown2.appendChild(dropdownButton2);     
        
        const dropdownContent2 = document.createElement('div');
        dropdownContent2.style.display = 'none';
        dropdownContent2.style.position = 'absolute';
        dropdownContent2.style.top = '100%';
        dropdownContent2.style.left = '0';
        dropdownContent2.style.width = '100px';
        dropdownContent2.style.border = '1px solid var(--primary-color)';
        dropdownContent2.style.borderRadius = '8px';
        dropdownContent2.style.backgroundColor = 'var(--card-background-color)';
        dropdownContent2.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dropdownContent2.style.zIndex = '10';
        
        const options = [
            { value: 'artist', label: t.artist_label },
            { value: 'track', label: t.track_label },
            { value: 'album', label: 'Album' },
            { value: 'playlist', label: t.playlist_label },
            { value: 'radio', label: 'Radio' },
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
        
        // Klik-event voor de dropdown-knop
        dropdownButton2.addEventListener('click', () => {
            dropdownContent2.style.display = dropdownContent2.style.display === 'none' ? 'block' : 'none';
        });
        
        // Voeg dropdown-elementen toe aan de DOM
        dropdown2.appendChild(dropdownButton2);
        dropdown2.appendChild(dropdownContent2);
        

        // Voeg dropdowns toe aan container
        buttonContainer.appendChild(icon);
        buttonContainer.appendChild(dropdown1);
        buttonContainer.appendChild(dropdown2);
        wrapper.appendChild(buttonContainer);

        // Voeg de kaarten en invoer toe aan de wrapper
        wrapper.appendChild(titleContainer);    
        wrapper.appendChild(inputContainer);
        wrapper.appendChild(searchsettingContainer);
        wrapper.appendChild(buttonContainer);

        // Voeg de wrapper toe aan de shadow DOM
        this.shadowRoot.innerHTML = ''; // Wis bestaande inhoud
        this.shadowRoot.appendChild(wrapper);
        // Toevoegen onder de bestaande methodes in de klasse

    }

    showPopup(response, title, t) {
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
        
            const image = document.createElement('img');
            image.style.width = '40px';
            image.style.height = '40px';
            image.style.borderRadius = '50%';
            image.style.objectFit = 'cover';
            // Controleer of imageUrl begint met "http" en niet "https"
            if (imageUrl && imageUrl.startsWith('http') && !imageUrl.startsWith('https')) {
                console.warn('Insecure HTTP URL detected, using fallback image.');
                image.src = "data:image/jpeg;base64,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";
            } else {
                image.src = imageUrl || new URL('./images/nocover.jpg', import.meta.url).href; // Gebruik imageUrl of fallback
            }
        
            imageContainer.appendChild(image);
        
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
                    <div style="font-size: 12px; color: #555;">${artistName || 'Unknown Artist'}</div>
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
                    <div style="font-size: 12px; color: #555;">${artistName || 'Unknown Artist'}</div>
                    <div style="font-size: 12px; color: #555;">${albumName || 'Unknown Album'}</div>
                `;
            }
        
            return textContainer;
        }

        function createIconContainer(uri) {
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
        
            if (icons.length === 1) {
                iconContainer.style.justifyContent = 'flex-end';
            }
        
            return iconContainer;
        }

        // Main logic for Tracks and Albums
        if (response?.response?.artists?.length || response?.response?.tracks?.length || response?.response?.albums?.length || response?.response?.radio?.length || response?.response?.playlists?.length) {
            const mediaItems = [
                ...(response.response.artists || []),
                ...(response.response.tracks || []),
                ...(response.response.albums || []),
                ...(response.response.radio || []),
                ...(response.response.playlists || []),                
            ];
        
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
                const artistName = mediaItem.artists?.[0]?.name || (isRadio ? 'Radio Station' : isPlaylist ? 'Playlist' : 'Unknown Artist'); // Default for radio
                const albumName = isTrack ? mediaItem.album?.name || '' : ''; // Only for tracks
            
                const textContainer = createTextContainer(title, artistName, albumName, isArtist, isTrack, isAlbum, isRadio, isPlaylist);
            
                // Create icon container
                const iconContainer = createIconContainer(mediaItem.uri);
            
                // Append all containers to the button
                button.appendChild(imageContainer);
                button.appendChild(textContainer);
                button.appendChild(iconContainer);
            
                // Handle button click for Track or Album
                let selectedMediaType = '';
                let selectedMediaPlayer = this.selectedMediaPlayer;
            
                button.addEventListener('click', async () => {
                    try {
                        await this.hass.callService('music_assistant', 'play_media', {
                            entity_id: selectedMediaPlayer,
                            media_type: selectedMediaType,
                            media_id: mediaItem.uri,
                        });
                        console.log(`${mediaItem.uri}`);
                    } catch (error) {
                        console.error(`${t.error_fetching}:`, error);
                    }
                });
            
                popup.appendChild(button);
            });
        } else {
            const noResults = document.createElement('p');
            noResults.textContent = 'No results found.';
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
            document.body.removeChild(popupContainer);
        });
        popup.appendChild(closeButton);

        popupContainer.appendChild(popup);
        document.body.appendChild(popupContainer);
    }
///////////////////////////////////////////////////////////////////////////////////////////////
    set hass(hass) {
        // Sla de Home Assistant state op in de klasse
        this._hass = hass;
        // Filter media_player entities
        this.mediaPlayerEntities = Object.keys(hass.states)
            .filter((entityId) => {
                const entity = hass.states[entityId];
                return entityId.startsWith('media_player.') && entity.attributes.mass_player_type;
            })
            .map((entityId) => ({
                entity_id: entityId,
                name: hass.states[entityId].attributes.friendly_name || entityId,
            }));
        //console.log('Filtered media_player entities:', this.mediaPlayerEntities);

        // Select dropdown content
        const dropdownContent1 = this.shadowRoot.querySelector('.dropdown-content1');
        if (!dropdownContent1) {
            console.error('Dropdown content element not found.');
            return;
        }

        // Filter op config_entry_id van de music_assistant integratie  
        this._hass.callApi('GET', 'config/config_entries/entry').then((entries) => {
            // Zoek de config entry voor 'music_assistant'
            const musicAssistantEntry = entries.find((entry) => entry.domain === 'music_assistant');
            this.configEntryId = musicAssistantEntry ? musicAssistantEntry.entry_id : 'Not found';
          console.log("Music Assistant Config Entry ID:", this.configEntryId);
        });

        dropdownContent1.innerHTML = ''; // Clear previous options

        if (this.mediaPlayerEntities.length > 0) {
            this.mediaPlayerEntities.forEach((entity) => {
                const option = document.createElement('div');
                option.textContent = entity.name;
                option.style.padding = '8px';
                option.style.cursor = 'pointer';
                option.style.borderBottom = '1px solid var(--divider-color)';
                option.addEventListener('click', () => {
                    const dropdownButton1 = this.shadowRoot.querySelector('div > button');

                    // Update selected media player directly
                    this.selectedMediaPlayer = entity.entity_id; // Directly set the selected media player

                    // Log the selected entity to the console
                    console.log('Selected entity:', entity);

                    dropdownButton1.textContent = entity.name;

                    // Voeg het icoontje opnieuw toe
                    const dropdownIcon = document.createElement('span');
                    dropdownIcon.textContent = '▼'; // Unicode voor het pijltje
                    dropdownIcon.style.marginLeft = 'auto'; // Zorgt dat het icoontje aan de rechterkant staat
                    dropdownIcon.style.fontSize = '12px';
                    dropdownIcon.style.pointerEvents = 'none'; // Voorkomt dat het icoontje klikbaar is

                    dropdownButton1.appendChild(dropdownIcon); // Voeg het icoontje opnieuw toe aan de knop
                    dropdownContent1.style.display = 'none';
                });
                dropdownContent1.appendChild(option);
            });
        } else {
            const noOption = document.createElement('div');
            noOption.textContent = 'Geen mediaplayers beschikbaar';
            noOption.style.padding = '8px';
            noOption.style.color = 'var(--disabled-text-color)';
            dropdownContent1.appendChild(noOption);
        }

        // Controleer of er een shadowRoot is en pas de status door aan child-elementen
        if (this.shadowRoot) {
            const cards = this.shadowRoot.querySelectorAll('hui-card-element, *');
            cards.forEach((card) => {
                card.hass = hass; // Geef Home Assistant status door aan child-elementen
            });
        }
    }
    get hass() {
        return this._hass;
      }
    getCardSize() {
        return 8; // Definieer de totale grootte van de gecombineerde kaarten
    }
}
customElements.define('mass-search-card', MassSearchCard);
