import { useState, useEffect } from 'react'
import axios from 'axios'
// Vite 的读取方式，记得吗？
const api_key = import.meta.env.VITE_WEATHER_API_KEY

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    // 🌍 构建查询地址：我们需要查城市(q)，并且用摄氏度(units=metric)
    // 记得把 api_key 拼进去
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }, [city]) // 👈 这里的依赖很重要！只有当“城市”变了，我才去查新天气

  // 🛑 守卫语句：如果数据还没回来（weather 是 null），先别渲染，否则会报错
  if (!weather) {
    return null
  }

  // 🎨 渲染部分
  // 图标的 URL 是 OpenWeatherMap 规定的格式
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h3>Weather in {city}</h3>
      <p>temperature {weather.main.temp} Celcius</p>
      
      {/* 天气图标 */}
      <img src={iconUrl} alt={weather.weather[0].description} />
      
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather