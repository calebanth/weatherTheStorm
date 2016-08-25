import React from 'react'
import { render } from 'react-dom'
import $ from 'jquery'
require('../css/style.less')

const WeatherApp = React.createClass({
  render: function() {
    return (
      <div>
        <Header />
        <Body />
      </div>
    )
  }
})

const Header = React.createClass({
  render: function() {
    return (
      <section className="grid ta-center">
        <h1>Weather The Storm</h1>
      </section>
    )
  }
})

const Body = React.createClass({
  getInitialState: function() {
    return {
      lat: '',
      lon: '',
      weather : {
        main : {
          temp : ''
        },
        name : null,
        weather : [{
          id : ''
        }],
      },
      forecast : {
        list : [{
          main : {},
          weather : [{
            id : ''
          }]
        }],
      },
    }
  },
  updateLoc: function(e) {
    e.preventDefault()
    const googKey = 'AIzaSyDZpqCmR8JFphxdOgXYd-QlEPRWmS3paLs'
    let zip = document.getElementById('zipCode').value
    let self = this
    if (zip.length === 5) {
      $.ajax({
        dataType: 'json',
        type: 'GET',
        crossDomain: true,
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&key=' + googKey,
        success: function(data) {
          self.setState({
            lat: data.results[0].geometry.location.lat,
            lon: data.results[0].geometry.location.lng
          })
          self.getWeather()
        }
      })
    }
  },
  getWeather: function() {
    let self = this
    const owmKey = '5ca178bab1fce990c4f1f6ecdd438bb4'
    // Use lat/long to get weather data
    $.ajax({
      dataType: 'json',
      type: 'GET',
      crossDomain: true,
      url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + this.state.lat + '&lon=' + this.state.lon + '&units=imperial&appid=' + owmKey,
      success: function(data) {
        self.setState({ weather: data })
      }
    })
    // Get forecast
    $.ajax({
      dataType: 'json',
      type: 'GET',
      crossDomain: true,
      url: 'http://api.openweathermap.org/data/2.5/forecast?lat=' + this.state.lat + '&lon=' + this.state.lon + '&units=imperial&appid=' + owmKey,
      success: function(data) {
        self.setState({ forecast: data })
      }
    })
  },
  componentWillMount: function() {
    let self = this
    navigator.geolocation.getCurrentPosition((position) => {
      self.setState({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      })
    })
    setTimeout(() => { this.getWeather() }, 200)
    setInterval(() => { this.getWeather() }, 30000)
  },
  render: function() {
    return (
      <div>
        <form onSubmit={this.updateLoc}>
          <section className="grid">
            <div className="updateZip">
              <input type="text" placeholder="Zip Code" id="zipCode" />
              <input className="button-primary" type="submit" value="Update" />
            </div>
          </section>
        </form>
        <section className="grid ta-center">
          <h2>{this.state.weather.name}</h2>
        </section>
        <section className="grid grid--large">
          <CurrentWeatherCard weather={this.state.weather} />
          <div>
            <div className="ta-center">
              <h3>5-Day Forecast</h3>
            </div>
            <ForecastCard forecast={this.state.forecast.list[0]} />
            <ForecastCard forecast={this.state.forecast.list[8]} />
            <ForecastCard forecast={this.state.forecast.list[16]} />
            <ForecastCard forecast={this.state.forecast.list[24]} />
            <ForecastCard forecast={this.state.forecast.list[32]} />
          </div>
        </section>
      </div>
    )
  }
})

const CurrentWeatherCard = React.createClass({
  render: function() {
    return (
      <div className="ta-center">
        <div>
          <h3>Current Weather</h3>
        </div>
        <section className="grid">
          <div>
            <i className={"owf owf-5x owf-" + this.props.weather.cod}></i>
          </div>
          <div className="temp">
            <h2><strong>{this.props.weather.main.temp}&deg;</strong></h2>
          </div>
          <div>
            <div className="temp tempMax ta-center">
              {this.props.weather.main.temp_max}&deg;
            </div>
            <div className="temp tempMin ta-center">
              {this.props.weather.main.temp_min}&deg;
            </div>
          </div>
        </section>
      </div>
    )
  }
})

const ForecastCard = React.createClass({
  getDayName: function() {
    let date = new Date(this.props.forecast.dt * 1000)
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
  },
  render: function() {
    // Refuses to load component until props exist
    if (!this.props.forecast) { return null }
    return (
      <section className="grid ta-center">
        <div className="day">
          {this.getDayName()}
        </div>
        <div>
          <i className={"owf owf-3x owf-" + this.props.forecast.weather[0].id}></i>
        </div>
        <section className="grid grid--medium">
          <div className="temp tempMax">
            {this.props.forecast.main.temp_max}&deg;
          </div>
          <div className="temp tempMin">
            {this.props.forecast.main.temp_min}&deg;
          </div>
        </section>
      </section>
    )
  }
})

render(<WeatherApp />, document.getElementById('container'))
