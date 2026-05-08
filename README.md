## World Explorer

An interactive world expolartion application built with React, TypeScript, and Leaflet.
Users can explore countries on a interactive map, view real-time weather data, save favorite 
countries, track visited countries, and navigate through border nations.

## Features 

- Interactive world map using Leaflet and GeoJSON
- Search countries dynamically
- Add countires to Favorites
- Mark countries as Visited 
- Real-time weather integration
- Google Maps integration
- Interactive country popups
- Border country navigation
- Persistent localStorage state
- Custom styled UI with responsive design
- Hover effects on countries

## Technologies Useed

- React
- Typescript
- Vite
- React Router DOM
- React Leaflet
- Leaflet
- REST Countries API
- Weather API 
- CSS3

## APIs Used

Rest Sountries API
Used for: 
- Country information
- Population
- Capital
- Region
- Flags
- Border countries

WeatherAPI
Used for:
- Current weather conditions
- Temperature
- Humidity
- Wind Speed 
- Weather Icons

## Future Improvements

- Dark mode/ theme switcher
- Currency conversion
- Country comparison feature
- Travel journal system
- Improved mobile optimization

# Deployed Link

- https://jas-michele.github.io/Rest-Countries/

## Reflection

During the development of this project, I focused on building an interactive and visually engaging world exploration experience using React, TypeScript, React Leaflet, and external APIs. The application allows users to explore countries on an interactive map, search for countries, save favorites, track visited countries, view real-time weather data, and navigate to detailed country information pages.

One of the biggest challenges I faced was handling inconsistencies between the GeoJSON dataset and the REST Countries API. Certain countries had different naming conventions, which caused navigation and data-fetching issues. To solve this problem, I implemented a country alias mapping system to normalize country names and improve routing between the map and country detail pages. Another challenge was integrating asynchronous weather data into Leaflet popups while maintaining smooth interactions and responsive UI updates.

Throughout the process, I focused heavily on improving the user experience and visual design. I redesigned the layout into a full-screen interactive map with floating UI elements, custom styling, hover effects, responsive design, and persistent localStorage state for favorites and visited countries.

If I continue improving this project, I would like to add additional features such as dark mode, country comparison tools, and more advanced mobile responsiveness. I would also improve edge-case handling for country data inconsistencies across APIs.