import React from 'react';

const Container = ({ name, temp, weather }) => {
	return (
		<div className="container">
			<div className="weather_icon">
				<h3>
					Temperature: {temp['temp']}&deg;C{' '}
					{weather.icon && (
						<img
							src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
							alt=""
						/>
					)}
				</h3>
			</div>

			<h3>Feels like: {temp['feels_like']}&deg;C</h3>
			<h3>Humidity: {temp['humidity']}%</h3>
			<h3>Weather: {weather['main']}</h3>
			<h3>City or Area: {name}</h3>
		</div>
	);
};

export default Container;
