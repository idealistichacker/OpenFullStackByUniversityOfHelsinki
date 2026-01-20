const Filter = ({handleFilterChange, filteredName}) => {
    return(
      <div>
        filter shown with: <input value={filteredName} onChange = {handleFilterChange}></input>
      </div>
    )
}

export default Filter