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

async function getData(path) {
    return axios.get(path, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then((response) => {
            let data = JSON.parse(response.data);
            return data;
        })
        .catch(error => {

        });
}

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

function resizeChart() {
    window.onresize = function () {
        generateGraphMacedonia();
    };

    window.onload = function () {
        generateGraphMacedonia();
    }
}

async function generateGraphMacedonia() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Датум');
    data.addColumn('number', 'Вкупно');
    data.addColumn('number', 'Починати');
    data.addRow(["1/1/20", 0, 0]);
    var dataHistory = await getDataParsed('https://corona.lmao.ninja/v2/historical/mk');
    var pastCases;
    var pastDeaths;
    var pastDates;
    if (typeof dataHistory != 'undefined') {
        data.removeRow(0);
        pastDates = Object.keys(dataHistory.timeline.cases);
        pastCases = Object.values(dataHistory.timeline.cases);
        pastDeaths = Object.values(dataHistory.timeline.deaths);
        for (i = 0; i < pastDates.length; i++) {
            data.addRow([pastDates[i], parseInt(pastCases[i]), parseInt(pastDeaths[i])]);
        }
    }
    var options = {
        title: 'Детална статистика за С.Македонија',
        legend: { position: 'bottom' },
        vAxis: { viewWindowMode: "explicit", viewWindow: { min: 0 } },
        backgroundColor: '#ebedf1'
    };
    var chart = new google.visualization.LineChart(document.getElementById('mkd-chart'));
    chart.draw(data, options);
}

async function generateOverview() {
    var data = await getDataParsed('https://corona.lmao.ninja/v2/all');
    var loader = document.getElementsByClassName("loader-world");
    if (typeof data != 'undefined') {
        for (var i = 0; i < loader.length; i++) {
            loader[i].style.display = "none";
        }
        var totalCountries = document.getElementById("total-countries");
        var totalPeople = document.getElementById("total-people-cases");
        var totalActive = document.getElementById("total-active-cases");
        var totalDeaths = document.getElementById("total-deaths-number");
        var totalRecovered = document.getElementById("total-recovered-number");
        var totalTests = document.getElementById("total-tests-number");
        totalCountries.innerText = data.affectedCountries.toLocaleString('en-US');
        totalPeople.innerText = data.cases.toLocaleString('en-US');
        totalActive.innerText = data.active.toLocaleString('en-US');
        totalDeaths.innerText = data.deaths.toLocaleString('en-US');
        totalRecovered.innerText = data.recovered.toLocaleString('en-US');
        totalTests.innerText = data.tests.toLocaleString("en-US");
    }
    else if (typeof data === 'undefined') {
        var imgWorld = document.getElementsByClassName("world-status");
        for (var i = 0; i < imgWorld.length; i++) {
            imgWorld[i].src = "./images/error.png";
        }
    }
}

async function generateMacedonia() {
    var country = await getDataParsed('https://corona.lmao.ninja/v2/countries/mk');
    var loader = document.getElementsByClassName("loader");
    if (typeof country != 'undefined') {
        for (var i = 0; i < loader.length; i++) {
            loader[i].style.display = "none";
        }
        var totalPeople = document.getElementById("total-mkd");
        var totalActive = document.getElementById("total-active-mkd");
        var totalToday = document.getElementById("total-today");
        var totalDeaths = document.getElementById("total-deaths-mkd");
        var totalDeathsToday = document.getElementById("total-deaths-today");
        var totalRecovered = document.getElementById("total-recovered-mkd");
        var totalCritical = document.getElementById("total-critical-mkd");
        var totalTests = document.getElementById("total-tests-mkd");
        totalPeople.innerText = country.cases.toLocaleString('en-US');
        totalActive.innerText = country.active.toLocaleString('en-US');
        totalToday.innerText = country.todayCases.toLocaleString('en-US');
        totalDeaths.innerText = country.deaths.toLocaleString('en-US');
        totalDeathsToday.innerText = country.todayDeaths.toLocaleString('en-US');
        totalRecovered.innerText = country.recovered.toLocaleString('en-US');
        totalCritical.innerText = country.critical.toLocaleString('en-US');
        totalTests.innerText = country.tests.toLocaleString('en-US');
    }
    else if (typeof data === 'undefined') {
        var imgWorld = document.getElementsByClassName("status");
        for (var i = 0; i < imgWorld.length; i++) {
            imgWorld[i].src = "./images/error.png";
        }
    }
}

async function generateCountries() {
    var data = await getDataParsed('https://corona.lmao.ninja/v2/countries');
    var countryDetails = document.getElementById("country-details");
    if (typeof data === 'undefined') {
        countryDetails.innerText = "Немаме податоци моментално!";
        countryDetails.style.fontSize = "xx-large";
    }
    else {
        data.forEach(country => {
            var divCreator = document.createElement("div");
            divCreator.className = "div-creator";
            var countryFlag = document.createElement("img");
            countryFlag.className = "country-flag";
            countryFlag.src = country.countryInfo.flag;
            var countryName = document.createElement("h2");
            countryName.innerText = country.country;
            countryName.className = "contry-name-find";
            var totalCases = document.createElement("h3");
            totalCases.className = "header-border";
            totalCases.innerText = `Вкупно случаи\n ${country.cases.toLocaleString('en-US')}`;
            var totalActive = document.createElement("h3");
            totalActive.className = "header-border";
            totalActive.innerText = `Вкупно активни случаи\n ${(country.cases - (country.deaths + country.recovered)).toLocaleString('en-US')}`;
            var totalToday = document.createElement("h3");
            totalToday.className = "header-border";
            totalToday.innerText = `Вкупно случаи денес\n${country.todayCases.toLocaleString('en-US')}`;
            var totalDeaths = document.createElement("h3");
            totalDeaths.className = "header-border";
            totalDeaths.innerText = `Вкупно починати\n${country.deaths.toLocaleString('en-US')}`;
            var totalDeathsToday = document.createElement("h3");
            totalDeathsToday.className = "header-border";
            totalDeathsToday.innerText = `Вкупно починати денес\n${country.todayDeaths.toLocaleString('en-US')}`;
            var totalRecovered = document.createElement("h3");
            totalRecovered.className = "header-border";
            totalRecovered.innerText = `Вкупно излечени\n${country.recovered.toLocaleString('en-US')}`;
            var totalCritical = document.createElement("h3");
            totalCritical.innerText = `Вкупно во критична состојба\n${country.critical.toLocaleString('en-US')}`;
            divCreator.appendChild(countryFlag);
            divCreator.appendChild(countryName);
            divCreator.appendChild(totalCases);
            divCreator.appendChild(totalActive);
            divCreator.appendChild(totalToday);
            divCreator.appendChild(totalDeaths);
            divCreator.appendChild(totalDeathsToday);
            divCreator.appendChild(totalRecovered);
            divCreator.appendChild(totalCritical);
            countryDetails.appendChild(divCreator);
        });
    }
}

function toggleSlider() {
    const slider = document.getElementById('country-details');
    let isDown = false;
    let startX;
    let scrollLeft;
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3;
        slider.scrollLeft = scrollLeft - walk;
    });
}

function findCountry() {
    var searchButton = document.getElementById("search-button");
    var countryInput = document.getElementById("country-name-search");
    var countryNames = document.getElementsByClassName("contry-name-find");
    var errorMessage = document.getElementById("message-error");
    var exist;
    searchButton.onclick = function () {
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
        for (var i = 0; i < countryNames.length; i++) {
            if (countryNames[i].innerText.toLowerCase().trim() == countryInput.value.toLowerCase().trim()) {
                errorMessage.innerHTML = "";
                countryNames[i].scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
                exist = true;
                break;
            }
            else {
                exist = false;
            }
        }
        if (exist == false && countryInput.value === "") {
            errorMessage.innerText = "Ве молиме внесете име на држава!";
        }
        else if (exist == false && countryInput.value != "") {
            errorMessage.innerText = "Државата не е пронајдена! (Внесете име на држава на англиски пр. Poland)";
            countryInput.value = "";
        }
    }
}

function redirectTo() {
    var findMore = document.getElementById("find-more");
    findMore.onclick = function () {
        window.location.href = "./answers/answers.html"
    }
}

function toggleFunctions() {
    try {
        resizeChart();
        toggleMenu();
        generateOverview();
        generateMacedonia();
        generateCountries();
        toggleSlider();
        findCountry();
        redirectTo();
        redirectToMap();
    }
    catch (err) {
        console.log("An error has occured!");
    }
}

function redirectToMap(){
    var showCites = document.getElementById("show-cities");
    showCites.onclick = function () {
        window.location.href = "./cities/cities.html"
    }
}

toggleFunctions();