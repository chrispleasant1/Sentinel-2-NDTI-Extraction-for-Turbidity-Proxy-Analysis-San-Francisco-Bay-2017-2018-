//////////////////////////////////////////////////////
// SF BAY NDTI EXPORT
// Full study area export using a composite
// 2017 to 2018
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// SIMPLE SF BAY EXPORT
// No points-based AOI
// No ranking
// No slider
// Just export one usable composite
//////////////////////////////////////////////////////

// Sentinel-2 SR Harmonized
var S2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED');

// 1. MANUAL STUDY AREA
// xmin, ymin, xmax, ymax
var studyArea = ee.Geometry.Rectangle([-123.0, 37.2, -121.6, 38.4]);

Map.centerObject(studyArea, 9);
Map.addLayer(studyArea, {color: 'cyan'}, 'Study Area', true);

// 2. DATE RANGE
var startDate = '2017-01-01';
var endDate   = '2018-12-31';

// 3. SIMPLE MASK
function maskS2(img) {
  var scl = img.select('SCL');

  // keep water, vegetation, bare soil, dark area
  var good = scl.eq(2)
    .or(scl.eq(4))
    .or(scl.eq(5))
    .or(scl.eq(6));

  return img.updateMask(good);
}

// 4. ADD INDICES
function addIndices(img) {
  var ndwi = img.normalizedDifference(['B3', 'B8']).rename('NDWI');
  var ndti = img.normalizedDifference(['B4', 'B3']).rename('NDTI');
  return img.addBands(ndwi).addBands(ndti);
}

// 5. FILTER COLLECTION
var collection = S2
  .filterDate(startDate, endDate)
  .filterBounds(studyArea)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 80))
  .map(maskS2)
  .map(addIndices);

print('Image count after filtering:', collection.size());

// 6. BUILD COMPOSITE
var composite = collection.median().clip(studyArea);

// 7. DISPLAY
var rgbVis = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000,
  gamma: 1.2
};

var ndtiVis = {
  min: -0.5,
  max: 0.1,
  palette: ['4112ff', '0affff', '10ff17', 'fbff00', 'ffa604', 'ff0000']
};

Map.addLayer(composite.select(['B4', 'B3', 'B2']), rgbVis, 'RGB composite');
Map.addLayer(composite.select('NDTI'), ndtiVis, 'NDTI composite');

// 8. EXPORT NDTI
Export.image.toDrive({
  image: composite.select('NDTI'),
  description: 'SFBay_NDTI_2017_2018_simple',
  folder: 'EarthEngineExports',
  fileNamePrefix: 'SFBay_NDTI_2017_2018_simple',
  region: studyArea,
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

// 9. EXPORT RGB
Export.image.toDrive({
  image: composite.select(['B4', 'B3', 'B2']),
  description: 'SFBay_RGB_2017_2018_simple',
  folder: 'EarthEngineExports',
  fileNamePrefix: 'SFBay_RGB_2017_2018_simple',
  region: studyArea,
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});
