document.addEventListener("DOMContentLoaded", () => {
    startTransition();
    fetch("/Frontend/JSON/plants_data.json")
        .then(response => response.json())
        .then(data => {
            displayGardens(data);
        })
        .catch(error => console.error("Error loading plant data:", error));
});

function displayGardens(plants) {
    const gardensContainer = document.getElementById("gardens");
    const gardens = {};

    plants.forEach(plant => {
        const firstLetter = plant.common_name.charAt(0).toUpperCase();
        if (!gardens[firstLetter]) {
            gardens[firstLetter] = [];
        }
        gardens[firstLetter].push(plant);
    });

    Object.keys(gardens).sort().forEach(letter => {
        const gardenDiv = document.createElement("div");
        gardenDiv.classList.add("garden");
        gardenDiv.innerHTML = `<h2>Garden ${letter}</h2>`;

        const plantsContainer = document.createElement("div");
        plantsContainer.classList.add("plants");

        gardens[letter].forEach(plant => {
            const plantDiv = document.createElement("div");
            plantDiv.classList.add("plant");
            plantDiv.innerHTML = `<p>${plant.common_name}</p>`;
            plantDiv.onclick = () => openPopup(plant.common_name, plant.traditional_uses);
            plantsContainer.appendChild(plantDiv);
        });

        gardenDiv.appendChild(plantsContainer);
        gardensContainer.appendChild(gardenDiv);
    });
}

function openPopup(name, desc) {
    document.getElementById("popup-title").innerText = name;
    document.getElementById("popup-desc").innerText = desc;
    document.getElementById("plantPopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("plantPopup").style.display = "none";
}

let hasRun = false;

function startTransition() {
    if (hasRun) return;
    hasRun = true;

    document.querySelector(".cloud-left").classList.add("animate-left");
    document.querySelector(".cloud-right").classList.add("animate-right");

    setTimeout(() => {

    }, 3000);
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadPlantData();
});

let plantData = [];

async function loadPlantData() {
    try {
        const response = await fetch("plants_data.json");
        plantData = await response.json();
    } catch (error) {
        console.error("Error loading plant data:", error);
    }
}

const searchInput = document.querySelector(".search input");
const searchResults = document.createElement("div");
searchResults.classList.add("search-results");
document.body.appendChild(searchResults);

searchInput.addEventListener("input", function () {
    let query = this.value.toLowerCase().trim();
    searchResults.innerHTML = "";
    if (!query || plantData.length === 0) return;
    
    let results = plantData.filter(plant => plant.common_name.toLowerCase().includes(query)).slice(0, 5);
    
    results.forEach(plant => {
        let div = document.createElement("div");
        div.classList.add("search-item");
        div.textContent = plant.common_name;
        div.onclick = () => {
            openPopup(plant.common_name, plant.traditional_uses);
            searchResults.innerHTML = ""; // Clear results after selection
        };
        searchResults.appendChild(div);
    });
    
    positionResults();
});

searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim() && searchResults.innerHTML === "") {
        searchInput.dispatchEvent(new Event("input"));
    }
});

searchInput.addEventListener("blur", () => {
    setTimeout(() => searchResults.innerHTML = "", 200);
});

function positionResults() {
    const rect = searchInput.getBoundingClientRect();
    searchResults.style.position = "absolute";
    searchResults.style.left = `${rect.left}px`;
    searchResults.style.top = `${rect.bottom + window.scrollY}px`;
    searchResults.style.width = `${rect.width}px`;
    searchResults.style.background = "#333";
    searchResults.style.color = "#fff";
    searchResults.style.borderRadius = "5px";
    searchResults.style.boxShadow = "0 4px 10px rgba(255, 255, 255, 0.1)";
    searchResults.style.zIndex = "1000";
    searchResults.style.padding = "5px 0";
}

const style = document.createElement("style");
style.innerHTML = `
    .search-item {
        padding: 10px;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.2s ease;
        margin: 3px 5px;
        border-radius: 5px;
    }
    .search-item:hover {
        background: #ff9800;
        color: #121212;
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

function openPopup(name, desc) {
    document.getElementById("popup-title").innerText = name;
    document.getElementById("popup-desc").innerText = desc;
    document.getElementById("plantPopup").style.display = "flex";
}

async function addPlant(event) {
    event.preventDefault();

    const commonName = document.getElementById("cName").value.trim();
    const traditionalUses = document.getElementById("tUses").value.trim();

    if (!commonName || !traditionalUses) {
        alert("Please fill in all fields.");
        return;
    }

    const plantData = {
        common_name: commonName,
        traditional_uses: traditionalUses
    };

    try {
        let response = await fetch("http://localhost:5000/plants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(plantData)
        });

        let result = await response.json();
        if (response.ok) {
            alert("Plant added successfully!");
            document.querySelector("form").reset();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Error adding plant:", error);
        alert("Failed to add plant.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPlantData();
    document.querySelectorAll('.links ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});