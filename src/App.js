import React, { useEffect, useState } from 'react';
import './App.css';
import Container from './Container';
import Particles from 'particlesjs';

export default function App() {
	let date = new Date();
	let options = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	};

	const today = date.toLocaleTimeString('en-au', options);
	const [value, setValue] = useState('');
	const [temp, setTemp] = useState({});
	const [location, setLocation] = useState([]);
	const [showTemp, setShowTemp] = useState(false);
	const [weather, setWeather] = useState({});
	const [cityName, setCityName] = useState('');
	const [result, setResult] = useState(false);
	const [showArea, setShowArea] = useState(false);

	function selectCity(city) {
		const key = process.env.REACT_APP_API_KEY;
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`
		)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					setShowTemp(false);
				}
			})
			.then(data => {
				if (data) {
					setTemp(data.main);
					setWeather(data.weather[0]);
					setCityName(data.name);
				}
			})
			.catch(err => console.log(err));
	}

	window.onload = () => {
		Particles.init({
			// normal options
			selector: '.background',
			maxParticles: 350,
			color: ['#DA0463', '#404B69', '#61045f'],
			connectParticles: true,
			minDistance: 150,

			// options for breakpoints
			responsive: [
				{
					breakpoint: 768,
					options: {
						maxParticles: 200,
						color: '#48F2E3',
						connectParticles: false,
					},
				},
				{
					breakpoint: 425,
					options: {
						maxParticles: 100,
						connectParticles: true,
					},
				},
				{
					breakpoint: 320,
					options: {
						maxParticles: 0,

						// disables particles.js
					},
				},
			],
		});
		selectCity('London');
	};

	function useLatLon() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(position => {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;

				setLocation([latitude, longitude]);
			});
		} else {
			return 'Failed to read location...';
		}
	}

	useEffect(() => {
		if (location) {
			const lat = location[0];
			const lon = location[1];
			const key = process.env.REACT_APP_API_KEY;
			if (lat && lon) {
				fetch(
					`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
				)
					.then(resolve => resolve.json())
					.then(data => {
						setTemp(data.main);
						setWeather(data.weather[0]);
						setCityName(data.name);
					})
					.catch(err => {
						throw err;
					});
			}
		}
	}, [location]);

	useEffect(() => {
		if (Object.keys(temp).length && cityName) {
			setShowTemp(true);
		}
	}, [temp, weather, cityName]);

	useEffect(() => {
		if (result) {
			selectCity(result);
		}
	}, [result]);

	useEffect(() => {
		if (showArea) {
			setLocation(useLatLon);
		}
	}, [showArea]);

	return (
		<div className="App">
			<div className="weather__info">
				<h4>{today}</h4>
				<button onClick={() => setShowArea(true)}>
					Get Weather In Your Area
				</button>

				<br />

				<form
					onSubmit={e => {
						e.preventDefault();
						setResult(value);
						setValue('');
					}}
					className="form"
				>
					<input
						value={value}
						onChange={e => setValue(e.target.value)}
						type="text"
						placeholder="Search by city..."
					/>
					<button type="submit">Search</button>
				</form>

				{showTemp ? (
					<Container name={cityName} temp={temp} weather={weather} />
				) : (
					<h3>Sorry, couldn't fetch the weather info</h3>
				)}
			</div>

			<canvas className="background"></canvas>
		</div>
	);
}
