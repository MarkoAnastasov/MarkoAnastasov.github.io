async function getDataParsed(path) {
    return axios.get(path, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then((response) => {
            let data = response.data;
            return data;
        })
        .catch(error => {
            
        });
}

async function showMacedoniaCities() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFya29hbmFzdGFzb3YiLCJhIjoiY2s4ZG05NnluMDE2cDNtbzAzeDBxOTd6YSJ9.EGbzTxlSgYQl7cEjVR17Og';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [21.743258, 41.613714],
        zoom: 8
    });
    map.addControl(new mapboxgl.NavigationControl());
    var data = await getDataParsed('https://ec2-3-8-208-168.eu-west-2.compute.amazonaws.com:443/api/cities');
    if (typeof data != "undefined") {
        for (var i = 0; i < data.length; i++) {
            var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h1>${data[i].city}</h1>\n<h2>Вкупно случаи: ${data[i].cases}</h2>\n<h2>Случаи денес: ${data[i].todayCases}</h2>`
            );
            var el = document.createElement('div');
            el.className = 'marker';
            new mapboxgl.Marker(el)
                .setLngLat([data[i].longitude, data[i].latitude])
                .setPopup(popup)
                .addTo(map);
        }
    }
    else {
        var citiesMap = document.getElementById("cities-map");
        var noData = document.createElement("div");
        noData.id = "no-data";
        noData.innerText = "Немаме податоци моментално!";
        citiesMap.appendChild(noData);
    }
}

function toggleMenu() {
    var menuButton = document.getElementById("menu-width");
    var menuLinks = document.getElementById("menu-links");
    var arrowSpan = document.getElementById("arrow-span");
    menuButton.onclick = function () {
        if (menuLinks.style.maxHeight) {
            menuLinks.style.maxHeight = null;
            arrowSpan.innerHTML = "&#9660;";
        }
        else {
            menuLinks.style.maxHeight = menuLinks.scrollHeight + "px";
            arrowSpan.innerHTML = "&#9650;";
        }
    }
}

function toggleFunctions(){
    try
    {
        showMacedoniaCities();
        toggleMenu();
    }
    catch(error)
    {
        console.log("An error has occured!");
    }
    
}

toggleFunctions();