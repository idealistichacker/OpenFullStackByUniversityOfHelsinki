import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountryList from './components/CountryList'


// 你的 API Key 这样读取（这和 Node.js 不一样哦！）
const api_key = import.meta.env.VITE_WEATHER_API_KEY

const App = () => {
  const [countries, setCountries] = useState([]) // 存所有国家
  const [filteredCountries, setFilteredCountries] = useState('')       // 存搜索词

  // 第一次加载时，把所有国家都抓下来（只会运行一次）
  useEffect(() => {
    console.log('fetching countries...')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
        console.log('countries fetched')
      })
  }, [])

  // ... 接下来就是你的表演时间了！
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilteredCountries(event.target.value)
  }
  
  const handleShowCountry = (countryName) => {
    setFilteredCountries(countryName)
  }

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(filteredCountries.toLowerCase()))
  const countryNamesToShow = countriesToShow.map(country => country.name.common)

  return (
    <div>
      <h1>Data for countries</h1>
      <Filter filteredCountries = {filteredCountries} handleFilterChange = {handleFilterChange} ></Filter>
      <CountryList countriesToShow={countriesToShow} countryNamesToShow={countryNamesToShow} handleShowCountry={handleShowCountry}></CountryList>
    </div>
  )
}

export default App