// Opprett et Leaflet-kart i HTML-elementet med id 'map1' og sett midtpunktet til koordinatene (37.8, -96) med zoomnivå 4.
const map = L.map('map1').setView([37.8, -96], 4);

// Legg til et kart
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Opprett en tom array for å lagre markørene som skal legges til kartet.
let markers = [];

// Definer en asynkron funksjon som skal hente og vise bryggerier basert på brukerens input.
async function show_me() {
    // Hent verdien fra inputfeltet med id 'searchbar', fjern mellomrom og konverter til små bokstaver.
    const place = document.getElementById("searchbar").value.trim().toLowerCase();

    // Send en HTTP-forespørsel til Open Brewery Database API for å hente bryggerier i den spesifiserte staten.
    const response = await fetch(`https://api.openbrewerydb.org/breweries?by_state=${place}&per_page=10`); 
    const data = await response.json();

    // Fjern eksisterende markører fra kartet.
    markers.forEach(marker => map.removeLayer(marker));

    // Filtrer dataene for å inkludere bare bryggerier med gyldige koordinater, og opprett nye markører.
    markers = data.filter(brewery => brewery.latitude && brewery.longitude).map(brewery => {
        // Opprett en ny markør for hvert bryggeri og legg til på kartet.
        const marker = L.marker([brewery.latitude, brewery.longitude])
            .bindPopup(`<p>Name: ${brewery.name}</p><p>City: ${brewery.city}</p><p>State: ${brewery.state}</p><a href="${brewery.website_url}" target="_blank">Visit Website</a>`)
            .addTo(map);

        // Legg til en klikkhendelse på markøren som oppdaterer informasjonen på nettsiden med detaljer om bryggeriet.
        marker.on('click', () => {
            document.getElementById("name").textContent = brewery.name;
            document.getElementById("city").textContent = brewery.city;
            document.getElementById("state").textContent = brewery.state;
            document.getElementById("lat").textContent = brewery.latitude;
            document.getElementById("long").textContent = brewery.longitude;
            document.getElementById("web").innerHTML = `<a href=${brewery.website_url}>Visit Website</a>`;
        });

        // Returner den nye markøren slik at den kan lagres i 'markers'-arrayen.
        return marker;
    });  
}
