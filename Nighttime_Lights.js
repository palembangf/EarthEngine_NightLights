// Filter for May 2017 and May 2020
var may2017 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG')
                  .filter(ee.Filter.date('2017-05-01', '2017-05-31'))
                  .select('avg_rad')
                  .map(function(image) {
                    return image.clip(geometry);
                  });

var may2020 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG')
                  .filter(ee.Filter.date('2020-05-01', '2020-05-31'))
                  .select('avg_rad')
                  .map(function(image) {
                    return image.clip(geometry);
                  });

var nighttimeVis = {min: 0.0, max: 60.0};
Map.addLayer(may2017.mean(), nighttimeVis, 'May 2017');
Map.addLayer(may2020.mean(), nighttimeVis, 'May 2020');
Map.centerObject(geometry);

// Export May 2017 image
Export.image.toDrive({
  image: may2017.mean(),
  description: 'Nighttime_Lights_May_2017',
  scale: 500,
  region: geometry,
  maxPixels: 1e13
});

// Export May 2020 image
Export.image.toDrive({
  image: may2020.mean(),
  description: 'Nighttime_Lights_May_2020',
  scale: 500,
  region: geometry,
  maxPixels: 1e13
});
