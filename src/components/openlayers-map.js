'use client'

import { useEffect, useRef, useState } from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import { fromLonLat } from 'ol/proj'
import { Style, Icon, Stroke, Fill, Text } from 'ol/style'
import Overlay from 'ol/Overlay'
import { Draw } from 'ol/interaction'
import { getLength } from 'ol/sphere'

// Location data with coordinates and photos
const locations = [
  // Seoul locations
  { 
    id: 'gangnam', 
    name: 'Gangnam District', 
    coords: [127.0276, 37.4979], 
    city: 'Seoul', 
    description: 'Modern financial and commercial district, famous for its upscale shopping and entertainment. The heart of K-pop culture and luxury lifestyle.',
    folder: 'gangnam',
    photos: [
      '/korea/gangnam/os823bc26ynymvyzj3s5.avif',
      '/korea/gangnam/rsk0hxyk3qxhhnemdcfv.avif',
      '/korea/gangnam/wahzhb3jvyoyth9w6egi.avif'
    ]
  },
  { 
    id: 'gyeongbok', 
    name: 'Gyeongbokgung Palace', 
    coords: [126.9770, 37.5796], 
    city: 'Seoul', 
    description: 'The largest of the Five Grand Palaces built during the Joseon Dynasty. Built in 1395, it served as the main royal palace.',
    folder: 'gyeongbokgung',
    photos: [
      '/korea/gyeongbokgung/Ekran Alıntısı.PNG',
      '/korea/gyeongbokgung/IMG_1055-2.jpg',
      '/korea/gyeongbokgung/IMG_1055.jpg',
      '/korea/gyeongbokgung/IMG_1078.jpg',
      '/korea/gyeongbokgung/IMG_1082.jpg'
    ]
  },
  { 
    id: 'changdeok', 
    name: 'Changdeok Palace', 
    coords: [126.9910, 37.5814], 
    city: 'Seoul', 
    description: 'UNESCO World Heritage site known for its beautiful Secret Garden. One of the best-preserved royal palaces.',
    folder: 'palace',
    photos: [
      '/korea/palace/sv0ljwl551mphow5neou.gif'
    ]
  },
  { 
    id: 'bukchon', 
    name: 'Bukchon Hanok Village', 
    coords: [126.9816, 37.5814], 
    city: 'Seoul', 
    description: 'Traditional Korean houses (hanok) preserved in the heart of Seoul. A living cultural heritage site.',
    folder: 'seoul',
    photos: [
      '/korea/seoul/fddhrbt2kp8bo2kivc6x.avif',
      '/korea/seoul/mgg33vvcd2c9lzq9vcw5.avif'
    ]
  },
  { 
    id: 'bongeunsa', 
    name: 'Bongeunsa Temple', 
    coords: [127.0561, 37.5147], 
    city: 'Seoul', 
    description: 'Buddhist temple in the heart of Gangnam district. A peaceful oasis amidst the bustling city.',
    folder: 'bongeunsa',
    photos: [
      '/korea/bongeunsa/edqzhitqbsveghil0toh.avif',
      '/korea/bongeunsa/gxgifgqnou5k6lg4zk49.avif',
      '/korea/bongeunsa/qapttbyy5q8kkjtircfi.avif',
      '/korea/bongeunsa/vgszp6wwrhyr5lzfqywl.avif',
      '/korea/bongeunsa/xkmb7rnoird8afkdqy1w.avif'
    ]
  },
  { 
    id: 'myeongdong', 
    name: 'Myeongdong Cathedral', 
    coords: [126.9875, 37.5633], 
    city: 'Seoul', 
    description: 'Gothic-style Catholic cathedral in the bustling Myeongdong shopping district. A significant religious and architectural landmark.',
    folder: 'cathedral',
    photos: [
      '/korea/cathedral/l6wpgvzzpaqhftonygqw.avif',
      '/korea/cathedral/n73rzipthhhgdfyuwcn4.avif'
    ]
  },
  { 
    id: 'chinatown', 
    name: 'Seoul Chinatown', 
    coords: [126.9784, 37.5665], 
    city: 'Seoul', 
    description: 'Historic Chinese district with traditional architecture and authentic cuisine. A cultural melting pot in the city.',
    folder: 'chinatown',
    photos: [
      '/korea/chinatown/dypmsvo8hux5rufwiuie.avif',
      '/korea/chinatown/hce42o0lgvygk0iy9bx1.avif',
      '/korea/chinatown/hkiobnsuicjp995b8hby.avif',
      '/korea/chinatown/m0w2merhcdoozsy0nug9.avif',
      '/korea/chinatown/qjhuoa5nmdqwpui1tveg.avif',
      '/korea/chinatown/zlsqwsfxfctethjza4qy.avif'
    ]
  },
  { 
    id: 'lotteworldtower', 
    name: 'Seoul Sky Tower Lotteworld', 
    coords: [127.10271246400836, 37.512673396251735], 
    city: 'Seoul', 
    description: 'The tallest building in South Korea and the 6th tallest in the world. Offers breathtaking panoramic views of Seoul.',
    folder: 'sky tower',
    photos: [
      '/korea/sky tower/mzcmjsjhsljo1yyuphka.avif',
      '/korea/sky tower/pxepgktddillxsrtn76p.avif',
      '/korea/sky tower/upd0hygykwo58agwjoau.avif'
    ]
  },
  { 
    id: 'yeouido', 
    name: 'Yeouido', 
    coords: [126.9240, 37.5219], 
    city: 'Seoul', 
    description: 'Financial district and island on the Han River, home to the National Assembly. Cherry blossom destination.',
    folder: 'yeouido',
    photos: [
      '/korea/yeouido/a0blmz05ha9iiwghfouk.avif',
      '/korea/yeouido/braz4r82afaip5vjchze.avif',
      '/korea/yeouido/pnxodh6kjhy3zvkxuudq.avif'
    ]
  },
  { 
    id: 'warmemorial', 
    name: 'War Memorial of Korea', 
    coords: [126.9773, 37.5347], 
    city: 'Seoul', 
    description: 'Museum dedicated to Korean military history and the Korean War. Important historical and educational site.',
    folder: 'war',
    photos: [
      '/korea/war/bog4o0yza0lt6giwynwa.avif',
      '/korea/war/btlrdrbzmvckmzmvd43x.avif',
      '/korea/war/f0iwrltoue5fid4unlva.avif',
      '/korea/war/ffjgvthj8vgkodlag868.avif',
      '/korea/war/qqugfqlusqzp0bazwysx.avif',
      '/korea/war/w6a86rqdxrbnitxf4ykp.avif',
      '/korea/war/zmima4re1jioj3td6omi.avif'
    ]
  },
  
  // Incheon locations
  { 
    id: 'icnairport', 
    name: 'Incheon International Airport', 
    coords: [126.4407, 37.4692], 
    city: 'Incheon', 
    description: 'Major international airport serving Seoul metropolitan area. One of the world\'s best airports.',
    folder: null,
    photos: []
  },
  { 
    id: 'songdo', 
    name: 'Songdo Central Park', 
    coords: [126.6419, 37.3894], 
    city: 'Incheon', 
    description: 'Modern urban development with sustainable city planning and Central Park. A smart city showcase.',
    folder: null,
    photos: []
  },
  { 
    id: 'inha', 
    name: 'Inha University', 
    coords: [126.6528, 37.4500], 
    city: 'Incheon', 
    description: 'Private research university known for engineering and business programs. International educational hub.',
    folder: 'inha',
    photos: [
      '/korea/inha/i3srksl6rufenbrvq6vg.avif',
      '/korea/inha/yuolwr2symlsw61mhzeu.avif'
    ]
  },
  
  // Yangyang locations
  { 
    id: 'yangyang-beach', 
    name: 'Yangyang Surf Beach', 
    coords: [128.7190, 38.0776], 
    city: 'Yangyang', 
    description: 'Beautiful east coast beach popular for surfing and ocean activities. Perfect waves and pristine coastline.',
    folder: 'surffy',
    photos: [
      '/korea/surffy/dayptjebdlwlpw40enty.avif',
      '/korea/surffy/lquob4qe1ejlfdad7xzw.avif'
    ]
  },
  { 
    id: 'imgye', 
    name: 'Imgye Village', 
    coords: [128.6500, 38.0500], 
    city: 'Yangyang', 
    description: 'Traditional mountain village in Gangwon province. Peaceful rural life and natural beauty.',
    folder: 'imgye',
    photos: [
      '/korea/imgye/bnscygnaxhchnu6ktkyd.avif',
      '/korea/imgye/ppdy8cl7ufszc82gizwu.avif',
      '/korea/imgye/tkporys4zd3gltxqx57l.avif'
    ]
  },
  { 
    id: 'najon', 
    name: 'Najon Beach', 
    coords: [128.7500, 38.1000], 
    city: 'Yangyang', 
    description: 'Beautiful coastal area in Yangyang. Perfect for relaxation and enjoying ocean views.',
    folder: 'najon',
    photos: [
      '/korea/najon/qacltxiedreecgwmaxdk.avif',
      '/korea/najon/rvx5jw1giyhwor8qa0zw.avif'
    ]
  }
]

export default function OpenLayersMap() {
  const mapRef = useRef()
  const mapInstanceRef = useRef()
  const overlayRef = useRef()
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [popupVisible, setPopupVisible] = useState(false)
  const [currentLayer, setCurrentLayer] = useState('satellite')
  const [measureMode, setMeasureMode] = useState(false)
  const [measureInteraction, setMeasureInteraction] = useState(null)
  const [measureSource, setMeasureSource] = useState(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Create popup overlay
    const overlay = new Overlay({
      element: overlayRef.current,
      autoPan: false,
      positioning: 'bottom-center',
      offset: [0, -10]
    })

    // South Korea coordinates (Seoul)
    const southKoreaCenter = [126.9780, 37.5665] // [longitude, latitude]

    // Create base layers
    const osmLayer = new TileLayer({
      source: new OSM()
    })

    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        attributions: '© Google'
      })
    })

    // Create measurement source and layer
    const measureVectorSource = new VectorSource()
    setMeasureSource(measureVectorSource)
    
    const measureVectorLayer = new VectorLayer({
      source: measureVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: '#ff0000',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.2)'
        })
      })
    })

    // Create features for each location
    const features = locations.map(location => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(location.coords)),
        locationData: location
      })
      
      feature.setStyle(new Style({
        image: new Icon({
          src: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="black" stroke="white" stroke-width="2"></circle>
              <circle cx="10" cy="10" r="4" fill="white"></circle>
            </svg>
          `),
          scale: 1,
          anchor: [0.5, 0.5]
        })
      }))
      
      return feature
    })

    // Create vector source and layer for locations
    const vectorSource = new VectorSource({
      features: features
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource
    })

    const map = new Map({
      target: mapRef.current,
      layers: [
        satelliteLayer,
        vectorLayer,
        measureVectorLayer
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat(southKoreaCenter),
        zoom: 6 // Slightly zoomed out to better fit South Korea on screen
      })
    })

    // Add click event with improved tolerance and zoom
    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
        hitTolerance: 10  // Increased hit tolerance for easier clicking
      })
      if (feature) {
        const locationData = feature.get('locationData')
        setSelectedLocation(locationData)
        
        // Zoom to the clicked location
        const view = map.getView()
        view.animate({
          center: fromLonLat(locationData.coords),
          zoom: 12,
          duration: 1000
        })
      }
    })

    // Add hover event with improved tolerance
    map.on('pointermove', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
        hitTolerance: 8  // Improved hover detection
      })
      if (feature) {
        const locationData = feature.get('locationData')
        overlay.setPosition(event.coordinate)
        setPopupVisible(true)
        map.getTarget().style.cursor = 'pointer'
      } else {
        setPopupVisible(false)
        map.getTarget().style.cursor = ''
      }
    })

    mapInstanceRef.current = map

    // Layer switching functions
    window.switchToOSM = () => {
      map.getLayers().removeAt(0)
      map.getLayers().insertAt(0, osmLayer)
      setCurrentLayer('osm')
    }

    window.switchToSatellite = () => {
      map.getLayers().removeAt(0)
      map.getLayers().insertAt(0, satelliteLayer)
      setCurrentLayer('satellite')
    }

    // Distance measurement functions
    window.toggleMeasure = () => {
      if (measureInteraction) {
        map.removeInteraction(measureInteraction)
        setMeasureInteraction(null)
        setMeasureMode(false)
      } else {
        const draw = new Draw({
          source: measureVectorSource,
          type: 'LineString',
          style: new Style({
            stroke: new Stroke({
              color: '#ff0000',
              width: 3,
              lineDash: [10, 10]
            })
          })
        })

        draw.on('drawend', (event) => {
          const line = event.feature.getGeometry()
          const length = getLength(line)
          const lengthKm = (length / 1000).toFixed(2)
          
          // Add text label
          const labelFeature = new Feature({
            geometry: new Point(line.getLastCoordinate())
          })
          
          labelFeature.setStyle(new Style({
            text: new Text({
              text: `${lengthKm} km`,
              font: '14px sans-serif',
              fill: new Fill({ color: '#000' }),
              stroke: new Stroke({ color: '#fff', width: 3 }),
              offsetY: -15
            })
          }))
          
          measureVectorSource.addFeature(labelFeature)
        })

        map.addInteraction(draw)
        setMeasureInteraction(draw)
        setMeasureMode(true)
      }
    }

    window.clearMeasurements = () => {
      measureVectorSource.clear()
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null)
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 space-y-2">
          {/* Layer Switcher */}
          <div className="bg-white rounded-lg shadow-lg p-3 border">
            <h4 className="text-sm font-semibold mb-2">Layers</h4>
            <div className="space-y-1">
              <button
                onClick={() => window.switchToOSM?.()}
                className={`w-full text-left px-2 py-1 text-xs rounded ${
                  currentLayer === 'osm' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'
                }`}
              >
                🗺️ Map
              </button>
              <button
                onClick={() => window.switchToSatellite?.()}
                className={`w-full text-left px-2 py-1 text-xs rounded ${
                  currentLayer === 'satellite' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'
                }`}
              >
                🛰️ Satellite
              </button>
            </div>
          </div>

          {/* Distance Tool */}
          <div className="bg-white rounded-lg shadow-lg p-3 border">
            <h4 className="text-sm font-semibold mb-2">Distance Tool</h4>
            <div className="space-y-1">
              <button
                onClick={() => window.toggleMeasure?.()}
                className={`w-full text-left px-2 py-1 text-xs rounded ${
                  measureMode ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'
                }`}
              >
                📏 {measureMode ? 'Stop Measuring' : 'Measure Distance'}
              </button>
              <button
                onClick={() => window.clearMeasurements?.()}
                className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-50"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={mapRef} 
          className="h-[600px] w-full rounded-lg shadow-sm"
          style={{ minHeight: '600px' }}
        />
        
        {/* Hover Popup */}
        <div
          ref={overlayRef}
          className={`absolute bg-white border rounded-lg shadow-lg p-3 pointer-events-none transition-opacity duration-200 z-10 ${
            popupVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ minWidth: '200px' }}
        >
          <div className="text-sm font-medium text-gray-900">Click to view details</div>
          <div className="text-xs text-gray-500 mt-1">Photos and description</div>
        </div>
      </div>

      {/* Location Description Area with Photos */}
      {selectedLocation && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{selectedLocation.name}</h3>
            <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
              {selectedLocation.city}
            </span>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-6 text-base">{selectedLocation.description}</p>
          
          {/* Photo Gallery */}
          {selectedLocation.photos && selectedLocation.photos.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Photos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedLocation.photos.map((photo, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-lg border shadow-sm bg-white">
                    <img
                      src={photo}
                      alt={`${selectedLocation.name} - Photo ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Location Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-medium">📍 Coordinates:</span>
              <span>{selectedLocation.coords[1]}°N, {selectedLocation.coords[0]}°E</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">📸 Photos:</span>
              <span>{selectedLocation.photos ? selectedLocation.photos.length : 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}