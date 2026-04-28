let countries = document.querySelector(".countries");
let country = document.querySelector(".country");
let searchInput = document.querySelector(".textInput");
const filterByRegion = document.querySelector(".filterByRegion");
const themeToggle = document.querySelector(".theme-toggle");
const html = document.documentElement;
const singleCountry = document.querySelector(".singleCountry");
const countryLists = document.querySelector(".countryLists");

const back = document.querySelector(".back");
themeToggle.addEventListener("click", () => {
  const isDark = html.classList.contains("dark");
  if (isDark) {
    html.classList.remove("dark");
  } else {
    html.classList.add("dark");
  }
  themeToggle.querySelector("span").innerText = isDark
    ? "Light Mode"
    : "Dark Mode";
});

const getCountries = async () => {
  const response = await fetch(
    `https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,currencies,languages,tld,subregion,`,
  );
  const data = await response.json();
  console.log(data);

  return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
};

const appendCountries = async () => {
  let countriesData = await getCountries();

  countriesData.forEach((countryData, index) => {
    const { flags, name, population, region, capital } = countryData;
    let countryDiv;
    if (index === 0) {
      countryDiv = country;
    } else {
      countryDiv = country.cloneNode(true);
      countries.append(countryDiv);
    }
    let afghanistanFlag = "https://flagcdn.com/w320/af.png";
    countryDiv.querySelector(".flag").src =
      name.common === "Afghanistan" ? afghanistanFlag : flags.png;
    countryDiv.querySelector(".name").innerText = name.common;
    countryDiv.querySelector(".population").innerText =
      `Population: ${population.toLocaleString()}`;
    countryDiv.querySelector(".region").innerText = `Region: ${region}`;
    countryDiv.querySelector(".capital").innerText = `Capital: ${capital}`;

    countryDiv.addEventListener("click", () => {
      const {
        flags,
        name,
        population,
        region,
        capital,
        currencies,
        languages,
        tld,
        subregion,
      } = countryData;

      singleCountry.classList.remove("hidden");
      countryLists.classList.add("hidden");
      let afghanistanFlag = "https://flagcdn.com/w320/af.png";
      singleCountry.querySelector(".flag").src =
        name.common === "Afghanistan" ? afghanistanFlag : flags.png;
      singleCountry.querySelector(".name").innerText = name.common;
      singleCountry.querySelector(".nativeName").innerText =
        name.nativeName[Object.keys(name.nativeName)[0]].common;
      singleCountry.querySelector(".population").innerText =
        `Population: ${population.toLocaleString()}`;
      singleCountry.querySelector(".region").innerText = region;
      singleCountry.querySelector(".capital").innerText = capital;
      singleCountry.querySelector(".currency").innerText = `${
        currencies ? Object.values(currencies)[0].name : "N/A"
      }`;
      singleCountry.querySelector(".language").innerText = `${
        languages ? Object.values(languages)[0] : "N/A"
      }`;
      singleCountry.querySelector(".domain").innerText = `${
        tld ? tld[0] : "N/A"
      }`;
      singleCountry.querySelector(".subregion").innerText = `${
        subregion ? subregion : "N/A"
      }`;
    });
  });
};

const filterCountries = async (data) => {
  let countriesData = await getCountries();
  if (data.type === "input") {
    const searchValue = data.target.value;
    document.querySelectorAll(".country").forEach((card) => {
      const cardName = card.querySelector(".name").innerText.toLowerCase();
      card.classList.toggle("hidden", !cardName.includes(searchValue));
    });
  } else {
    // by region
    let selectedRegion = data.target.value;
    const filteredData = countriesData.filter(
      (dt) => dt.region.toLowerCase() === selectedRegion.toLowerCase(),
    );
    document.querySelectorAll(".country").forEach((card) => {
      const regionName = card
        .querySelector(".region")
        .innerText.replace("Region: ", "")
        .toLowerCase();
      const isMatch = filteredData.some(
        (dt) => dt.region.toLowerCase() === regionName,
      );
      card.classList.toggle("hidden", !isMatch);
    });
  }
};
// search via country name
searchInput.addEventListener("input", filterCountries);
filterByRegion.addEventListener("change", filterCountries);
back.addEventListener("click", () => {
  return (
    countryLists.classList.remove("hidden"),
    singleCountry.classList.add("hidden")
  );
});
appendCountries();
getCountries();
