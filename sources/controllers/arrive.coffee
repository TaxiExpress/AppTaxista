class __Controller.ArriveCtrl extends Monocle.Controller

  map = undefined
  
  elements:
    "#arrive_streetField"            : "streetField"
  
  events:
    "tap #arrive_pickup"             : "doPickUp"
    "tap #arrive_cancel"             : "cancelPickUp"
    "tap #arrive_call"               : "doCall"

  constructor: ->
    super

    travel = Lungo.Cache.get "travel"
    #@streetField[0].value = travel.origin

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
    #Lungo.Router.section "home_s"
    if map == undefined
      #currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
      arriveLocation = new google.maps.LatLng(travel.latitude, travel.longitude)
      mapOptions =
        center: arriveLocation
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
        position: arriveLocation
        map: map
        title: street
      )

  iniLocation = (location) =>
    currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
    travel.latitude = location.latitude
    travel.longitude = location.longitude
    travel.newOrigin = @getStreet(currentLocation)

  doPickUp: (event) =>
    #__Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
    #Lungo.Router.section "charge_s"

    if navigator.geolocation
      options =
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      navigator.geolocation.getCurrentPosition iniLocation, manageErrors

    driver = Lungo.Cache.get "driver"
    push = Lungo.Cache.get "push"
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/travelstarted"
      data:
        email: driver.email
        travelID: push.travelID
        origin: travel.newOrigin
        latitude: travel.latitude
        longitude: travel.longitude
      success: (result) =>
        __Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
        Lungo.Router.section "charge_s"
      error: (xhr, type) =>
        alert type.response        
    
  cancelPickUp: (event) =>
    Lungo.Router.section "waiting_s"

  doCall: (event) =>
    alert "llamando"
    document.getElementById("fdw").onclick();

  getStreet = (pos) =>
    geocoder = new google.maps.Geocoder()
    geocoder.geocode
      latLng: pos
    , (results, status) =>
      if status is google.maps.GeocoderStatus.OK
        if results[1]
          if results[0].address_components[1].short_name == results[0].address_components[0].short_name
            results[0].address_components[1].short_name
          else 
            results[0].address_components[1].short_name + ", " +results[0].address_components[0].short_name
        else
          'Calle desconocida'
      else
        'Calle desconocida'

  