import Weather from "./Weather"

const CountryList = ({countriesToShow, countryNamesToShow, handleShowCountry}) => {
    if (countriesToShow.length === 0) {
        return (
            <div>Type country name to search for a country</div>
        )
    }
    else if (countriesToShow.length > 10) {
        return (
            <div>Too many matches, specify another filter</div>
        )
    }
    else if (countriesToShow.length === 1) {
        const country = countriesToShow[0]
        return (
            <div>
                <h2>{country.name.common}</h2>
                <div>capital {country.capital[0]}</div>
                <div>area {country.area}</div>
                <h3>languages:</h3>
                <ul>
                    {Object.values(country.languages).map((language) => 
                        <li key={language}>{language}</li>    
                    )}
                </ul>
                <img src={country.flags.png} alt={`flag of ${country.flags.alt}`} width="150" />
                <Weather city={country.capital[0]}></Weather>
            </div>
        )
    }
    else {
        return (
            <div>
                {countryNamesToShow.map((name) => 
                    <div key={name}>{name}
                    <button onClick={() => handleShowCountry(name)}>Show</button>
                    </div>    
                )}
            </div>
        )
    }
}

export default CountryList
