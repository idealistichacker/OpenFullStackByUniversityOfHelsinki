const Filter = ({handleFilterChange, filteredCountries}) => {
    return(
      <div>
        find countries: <input value={filteredCountries} onChange = {handleFilterChange}></input>
      </div>
    )
}

export default Filter