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
            console.log(error);
        });
}

async function generateOverview() {
    var data = await getData('https://covid-ca.azurewebsites.net/api/covid/overview');
    var totalPeople = document.getElementById("total-people-cases");
    var totalActive = document.getElementById("total-active-cases");
    var totalDeaths = document.getElementById("total-deaths-number");
    var totalRecovered = document.getElementById("total-recovered-number")
    var totalCases = data.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var totalCasesNmb = (data.cases - (data.deaths + data.recovered)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var totalDeathsNmb = data.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var totalRecoveredNmb = data.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    totalPeople.innerText = totalCases;
    totalActive.innerText = totalCasesNmb;
    totalDeaths.innerText = totalDeathsNmb;
    totalRecovered.innerText = totalRecoveredNmb;
}

async function generateMacedonia() {
    var data = await getData('https://covid-ca.azurewebsites.net/api/covid/countries');
    data.forEach(country => {
        if (country.country === "North Macedonia") {
            var totalPeople = document.getElementById("total-mkd");
            var totalActive = document.getElementById("total-active-mkd");
            var totalToday = document.getElementById("total-today");
            var totalDeaths = document.getElementById("total-deaths-mkd");
            var totalDeathsToday = document.getElementById("total-deaths-today");
            var totalRecovered = document.getElementById("total-recovered-mkd");
            var totalCritical = document.getElementById("total-critical-mkd");
            var totalCases = country.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var totalActiveNmb = (country.cases - (country.deaths + country.recovered)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var totalTodayNmb = country.todayCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var totalDeathsNmb = country.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var totalDeathsTodayNmb = country.todayDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var totalRecoveredNmb = country.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var totalCriticalNmb = country.critical.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            totalPeople.innerText = totalCases;
            totalActive.innerText = totalActiveNmb;
            totalToday.innerText = totalTodayNmb;
            totalDeaths.innerText = totalDeathsNmb;
            totalDeathsToday.innerText = totalDeathsTodayNmb;
            totalRecovered.innerText = totalRecoveredNmb;
            totalCritical.innerText = totalCriticalNmb;
        }
    });
}

async function generateCountries() {
    var data = await getData('https://covid-ca.azurewebsites.net/api/covid/countries');
    var totalCountries = document.getElementById("total-countries");
    totalCountries.innerText = (data.length - 1);
    var countryDetails = document.getElementById("country-details");
    data.forEach(country => {
        var divCreator = document.createElement("div");
        divCreator.className = "div-creator";
        var countryName = document.createElement("h2");
        countryName.innerText = country.country;
        countryName.className = "contry-name-find";
        var totalCases = document.createElement("h3");
        totalCases.className = "header-border";
        totalCases.innerText = `Вкупно случаи\n ${country.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        var totalActive = document.createElement("h3");
        totalActive.className = "header-border";
        totalActive.innerText = `Вкупно активни случаи\n ${(country.cases - (country.deaths + country.recovered)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        var totalToday = document.createElement("h3");
        totalToday.className = "header-border";
        totalToday.innerText = `Вкупно случаи денес\n${country.todayCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        var totalDeaths = document.createElement("h3");
        totalDeaths.className = "header-border";
        totalDeaths.innerText = `Вкупно починати\n${country.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        var totalDeathsToday = document.createElement("h3");
        totalDeathsToday.className = "header-border";
        totalDeathsToday.innerText = `Вкупно починати денес\n${country.todayDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        var totalRecovered = document.createElement("h3");
        totalRecovered.className = "header-border";
        totalRecovered.innerText = `Вкупно излечени\n${country.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        var totalCritical = document.createElement("h3");
        totalCritical.innerText = `Вкупно во критична состојба\n${country.critical.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
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

function toggleFunctions() {
    toggleMenu();
    generateOverview();
    generateMacedonia();
    generateCountries();
    toggleSlider();
    findCountry();
}

toggleFunctions();