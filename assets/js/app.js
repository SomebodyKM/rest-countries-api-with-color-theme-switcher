// fetching datas
async function getCountryInfo() {
    try {
        const res = await fetch('../data.json')
        const data = await res.json()
        return data
    } catch (err) {
        console.error(err)
    }
}

function buildCards(countries) {
    const countryContainer = document.querySelector('.country-container')

    const cardsContainer = document.createElement('div')
    cardsContainer.classList.add('cards-container')

    countries.forEach(country => {


        const card = document.createElement('div')
        card.classList.add('card')

        const img = document.createElement('img')
        img.setAttribute('src', country.flags.svg)

        const infoDiv = document.createElement('div')
        infoDiv.classList.add('info')

        const h2 = document.createElement('h2')
        h2.textContent = country.name

        const pDiv = document.createElement('div')
        pDiv.classList.add('info-p')
        const populationP = document.createElement('p')
        const regionP = document.createElement('p')
        const capitalP = document.createElement('p')
        populationP.innerHTML = `<strong>Population:</strong> ${country.population.toLocaleString()}`
        regionP.innerHTML = `<strong>Region:</strong> ${country.region}`
        capitalP.innerHTML = `<strong>Capital:</strong> ${country.capital}`

        pDiv.appendChild(populationP)
        pDiv.appendChild(regionP)
        pDiv.appendChild(capitalP)
        infoDiv.appendChild(h2)
        infoDiv.appendChild(pDiv)
        card.appendChild(img)
        card.appendChild(infoDiv)
        cardsContainer.appendChild(card)
        countryContainer.appendChild(cardsContainer)

        card.addEventListener('click', () => {
            localStorage.setItem('selectedCountry', JSON.stringify(country))
            window.location.href = 'country.html'
        })
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    const countryContainer = document.querySelector('.country-container')

    if (countryContainer) {
        const countryData = await getCountryInfo()
        buildCards(countryData)
    }

    const detailContainer = document.querySelector('.detail-container')

    if (detailContainer) {
        const saved = localStorage.getItem('selectedCountry')
        if (saved) {
            const country = JSON.parse(saved)
            buildDetail(country)
        }
    }
})

// detail page
function buildDetail(data) {
    const container = document.querySelector('.detail-container')
    container.innerHTML = ''


    const flagElement = document.createElement('img')
    flagElement.setAttribute('src', data.flags.svg)

    const detailDiv = document.createElement('div')
    detailDiv.classList.add('detail')

    const h2 = document.createElement('h2')
    h2.textContent = data.name

    const info = document.createElement('div')
    info.classList.add('info-section')

    const infoOne = document.createElement('div')
    infoOne.classList.add('info-section-one')
    infoOne.innerHTML = `<p><strong>Native Name:</strong> ${data.nativeName}</p>
        <p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${data.region}</p>
        <p><strong>Sub Region:</strong> ${data.subregion}</p>
        <p><strong>Capital:</strong> ${data.capital}</p>`

    const infoTwo = document.createElement('div')
    infoTwo.classList.add('info-section-two')
    infoTwo.innerHTML = `
        <p><strong>Top Level Domain:</strong> ${data.topLevelDomain}</p>
        <p><strong>Currencies:</strong> ${data.currencies[0].name}</p>
        <p><strong>Languages:</strong> ${data.languages.map(language => language.name).join(', ')}</p>`

    const countryBorder = document.createElement('div')
    countryBorder.classList.add('border-container')

    countryBorder.innerHTML = `
        <p><strong>Border Countries:</strong></p>
        <div class="border">
            ${data.borders && data.borders.length > 0
            ? data.borders.map(c => `<span>${c}</span>`).join(' ')
            : '<span>None</span>'}
        </div>`

    info.appendChild(infoOne)
    info.appendChild(infoTwo)
    detailDiv.appendChild(h2)
    detailDiv.appendChild(info)
    detailDiv.appendChild(countryBorder)
    container.appendChild(flagElement)
    container.appendChild(detailDiv)

}

// back btn 
const backBtn = document.querySelector('.back-btn')
if (backBtn) {
    backBtn.addEventListener('click', (e) => {
        e.preventDefault()
        window.history.back()
    })
}

// dark mode
const modeToggle = document.querySelector('.mode-toggle')

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode')
}

modeToggle.addEventListener('click', (e) => {
    e.preventDefault()
    document.body.classList.toggle('dark-mode')

    const icon = modeToggle.querySelector('i')
    const label = modeToggle.querySelectorAll('a')[1]

    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon')
        icon.classList.add('fa-sun')
        label.textContent = 'Light Mode'
        localStorage.setItem('theme', 'dark')
    } else {
        icon.classList.remove('fa-sun')
        icon.classList.add('fa-moon')
        label.textContent = "Dark Mode"
        localStorage.setItem('theme', 'light')
    }
})

// search form
const searchForm = document.querySelector('.search-bar')
const searchInput = document.querySelector('.search-input')

if (searchForm && searchInput) {

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault()
        const query = searchInput.value.toLowerCase().trim()

        const cards = document.querySelectorAll('.card')


        cards.forEach(card => {
            const countryName = card.querySelector('.info h2').textContent.toLowerCase()

            if (countryName.includes(query)) {
                card.style.display = 'block'
            } else {
                card.style.display = 'none'
            }
        })
    })
}


//filter select
const regionSelect = document.querySelector('.region-select')

if (regionSelect) {

    regionSelect.addEventListener('change', function () {
        const selectedRegion = this.value.toLowerCase().trim()
        const cards = document.querySelectorAll('.card')

        cards.forEach(card => {
            const regionP = Array.from(card.querySelectorAll('.info p'))
                .find(p => p.textContent.toLowerCase().startsWith('region:'))

            if (!regionP) return

            const regionText = regionP.textContent.toLowerCase()

            if (selectedRegion === 'all') {
                card.style.display = 'block'
            } else if (regionText.includes(selectedRegion)) {
                card.style.display = 'block'
            } else {
                card.style.display = 'none'
            }
        })
    })
}
