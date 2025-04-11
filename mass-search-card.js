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
            },              
            sk: {
                album_label: 'Album',
                artist_label: 'Umelec',
                close_button: 'Zavrieť',
                dropdown_label_media_player: 'Vyberte prehrávač',
                error_fetching: 'Pri načítaní výsledkov nastala chyba.',
                library_only_label: 'Miestna knižnica',
                media_type: 'Typ média',
                no_results: 'Nenašli sa žiadne výsledky.',
                playing_media: 'Prehrávané: ',
                playlist_label: 'Zoznam skladieb',
                popup_title: 'Výsledky hľadania pre:',
                radio_label: 'Rádio',
                results_label: 'Počet výsledkov',
                search_button: 'Hľadať',
                search_placeholder: 'Zadajte hľadaný výraz...',
                select_media_type: 'Vyberte typ média',
                title_text: 'Hľadať v Music Assistant',
                track_label: 'Skladba',
                unknown_artist: 'Neznámy umelec',
                unknown_duration: 'Neznáma dĺžka',
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
                        this.showPopup(response, title);
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
        titleImage.src = new URL('/hacsfiles/mass-search-card/images/mass_logo.png', import.meta.url).href;
//        titleImage.src = 'https://avatars.githubusercontent.com/u/71128003?s=200&v=4';
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

    showPopup(response, title) {
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
    
//        // Helper functions
//        async function convertImageToBase64(url) {
//            const corsProxy = 'https://crossorigin.me/';
//            const proxiedUrl = corsProxy + url;
//        
//            try {
//                const response = await fetch(proxiedUrl);
//                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//            
//                const blob = await response.blob();
//                return new Promise((resolve, reject) => {
//                    const reader = new FileReader();
//                    reader.onloadend = () => resolve(reader.result);
//                    reader.onerror = (err) => reject(err);
//                    reader.readAsDataURL(blob);
//                });
//            } catch (error) {
//                console.error('Error fetching image:', error);
//                return null;  // Return null if there is an error
//            }
//        }

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
                image.src = new URL('./images/nocover.jpg', import.meta.url).href; // Fallback image
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
                youtubeIcon.src = new URL('./images/youtube_music.png', import.meta.url).href;
                youtubeIcon.alt = 'youtube-music';
                icons.push(youtubeIcon);
            }
        
            if (uri.includes('spotify')) {
                const spotifyIcon = document.createElement('img');
                spotifyIcon.src = new URL('./images/spotify.png', import.meta.url).href;
                spotifyIcon.alt = 'spotify';
                icons.push(spotifyIcon);
            }
        
            if (uri.includes('library')) {
                const libraryIcon = document.createElement('img');
                libraryIcon.src = new URL('./images/book_shelf.png', import.meta.url).href;
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
        closeButton.textContent = 'Close';
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
