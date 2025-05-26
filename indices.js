var s2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED');
var admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2');

var filteredAdmin2 = admin2
  .filter(ee.Filter.eq('ADM2_NAME', 'Halmahera Timur'))
  .filter(ee.Filter.eq('ADM1_NAME', 'Maluku Utara'));
var geometry = filteredAdmin2.geometry();
Map.centerObject(geometry);

var filteredS2 = s2.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .filter(ee.Filter.date('2022-01-01', '2023-01-01'))
  .filter(ee.Filter.bounds(geometry));

var image = filteredS2.median(); 
var NDVI = image.normalizedDifference (['B8', 'B4']);
var MNDWI = image.normalizedDifference (['B3', 'B11']);
var SAVI = image.expression (
  '1.5 * ((NIR - RED) / (NIR + RED) + 0.5)', {
    'NIR': image.select('B8').multiply(0.00001),
    'RED': image.select('B4').multiply(0.00001),
  });
var NDBI = image.expression (
  '(SWIR1 - NIR)/(SWIR1 + NIR)', {
    'SWIR1': image.select('B11').multiply(0.00001),
    'NIR': image.select('B8').multiply(0.00001)
  });

var rgbVis = {min: 0.0, max: 3000, bands: ['B4', 'B3', 'B2']};
var ndviVis = {min: 0, max: 1, palette: ['white', 'green']};
var mndwiVis = {min: 0, max: 0.5, palette: ['white', 'blue']};
var ndbiVis = {min: 0, max: 0.5, palette: ['white', 'red']};

Map.addLayer(image.clip(geometry), rgbVis, 'Image');
Map.addLayer(NDVI.clip(geometry), ndviVis, 'NDVI');
Map.addLayer(MNDWI.clip(geometry), mndwiVis, 'MNDWI');
Map.addLayer(SAVI.clip(geometry), ndviVis, 'SAVI');
Map.addLayer(NDBI.clip(geometry), ndbiVis, 'NDBI');
