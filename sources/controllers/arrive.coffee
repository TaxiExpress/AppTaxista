class __Controller.ArriveCtrl extends Monocle.Controller

  map = undefined
  street = "Aldapabarrena kalea"

  elements:
    "#arrive_streetField"            : "streetField"
  
  events:
    "tap #arrive_pickup"             : "doPickUp"
    "tap #arrive_cancel"             : "cancelPickUp"
    "tap #arrive_call"               : "doCall"

  constructor: ->
    super
    @streetField[0].value = street
    if navigator.geolocation
      options =
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      navigator.geolocation.getCurrentPosition initialize, manageErrors

  manageErrors = (err) ->
    alert "Error de localización GPS"
    setTimeout((=> navigator.geolocation.getCurrentPosition initialize, manageErrors) , 5000)

  initialize = (location) =>
    Lungo.Router.section "home_s"
    if map == undefined
      #currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
      currentLocation = new google.maps.LatLng(43.3256502, -2.990092699999991)
      mapOptions =
        center: currentLocation
        zoom: 16
        mapTypeId: google.maps.MapTypeId.ROADMAP
        panControl: false
        streetViewControl:false
        overviewMapControl:false
        mapTypeControl:false
        zoomControl:false
        styles: [
          featureType: "poi.business"
          elementType: "labels"
          stylers: [visibility: "off"]
        ]
      map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions)

      marker = new google.maps.Marker(
        position: currentLocation
        map: map
        title: street
      )

      #getStreet(currentLocation)
      #google.maps.event.addListener map, "dragend", (event) ->
      #  getStreet(map.getCenter())
      #google.maps.event.addListener map, "dragstart", (event) ->
      #  home_streetField.value = 'Localizando ...'
      #google.maps.event.addListener map, "zoom_changed", (event) ->
      #  getStreet(map.getCenter())

  #getStreet = (pos) =>
  #  Lungo.Cache.set "geoPosition", pos
  #  geocoder = new google.maps.Geocoder()
  #  geocoder.geocode
  #    latLng: pos
  #  , (results, status) =>
  #    if status is google.maps.GeocoderStatus.OK
  #      if results[1]
  #        home_streetField.value = results[0].address_components[1].short_name + ", " +results[0].address_components[0].short_name
  #      else
  #        home_streetField.value = 'Calle desconocida'
  #    else
  #      home_streetField.value = 'Calle desconocida'  

  doPickUp: (event) =>
    __Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
    Lungo.Router.section "charge_s"
    
  cancelPickUp: (event) =>
    Lungo.Router.section "init_s"

  doCall: (event) =>
    alert "llamando"

  