const express = require('express');
const geolib = require('geolib');

const app = express();
const PORT = 3000;

// Función para obtener las coordenadas geográficas de una ciudad usando la API de OpenStreetMap
async function obtenerCoordenadas(ciudad) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ciudad)}`;

    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            return { latitud: parseFloat(lat), longitud: parseFloat(lon) };
        } else {
            throw new Error('No se encontraron resultados para la ciudad especificada.');
        }
    } catch (error) {
        throw new Error(`Error al obtener las coordenadas: ${error.message}`);
    }
}

// Función para calcular la distancia entre dos puntos dadas sus coordenadas utilizando geolib
function calcularDistancia(lat1, lon1, lat2, lon2) {
    // Coordenadas de los puntos
    const punto1 = { latitude: lat1, longitude: lon1 };
    const punto2 = { latitude: lat2, longitude: lon2 };

    // Calcular la distancia en metros
    const distancia = geolib.getDistance(punto1, punto2);

    // Convertir la distancia a kilómetros y redondear a dos decimales
    const distanciaKm = (distancia / 1000).toFixed(2);

    return distanciaKm;
}

// Ruta GET para calcular la distancia entre dos ciudades
app.get('/distancia', async (req, res) => {
    const { ciudad1, ciudad2 } = req.query;

    try {
        const coordenadasCiudad1 = await obtenerCoordenadas(ciudad1);
        const coordenadasCiudad2 = await obtenerCoordenadas(ciudad2);

        const distancia = calcularDistancia(
            coordenadasCiudad1.latitud,
            coordenadasCiudad1.longitud,
            coordenadasCiudad2.latitud,
            coordenadasCiudad2.longitud
        );

        res.json({ distancia });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});