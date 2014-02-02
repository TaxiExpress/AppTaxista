class __Controller.ArriveCtrl extends Monocle.Controller

  map = undefined
  
  elements:
    "#arrive_streetField"            : "streetField"
    "#arrive_call"                   : "telephone"
  
  events:
    "tap #arrive_pickup"             : "doPickUp"
    "tap #arrive_cancel"             : "cancelPickUp"
    "tap #arrive_call"               : "doCall"

  constructor: ->
    super

  iniArrive: ->
    travel = Lungo.Cache.get "travel"
    @streetField[0].value = travel.origin
    @telephone[0].href = travel.phone

    #alert "travelID: " + travel.travelID 
    #alert "latitude: " + travel.latitude
    #alert "longitude: " + travel.longitude  

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
    console.log "initialize"
    #Lungo.Router.section "home_s"
    if map == undefined
      #currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
      arriveLocation = new google.maps.LatLng(travel.latitude, travel.longitude)
      console.log arriveLocation
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
        title: @streetField[0].value
      )

  iniLocation = (location) =>
    travel = Lungo.Cache.get "travel"

    currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
    #alert "Latitude: " + travel.latitude + ".  Nueva Latitude: " + location.coords.latitude
    travel.latitude = location.coords.latitude
    #alert "Longitude: " + travel.longitude + ".  Nueva Longitude: " + location.coords.longitude
    travel.longitude = location.coords.longitude
    #travel.newOrigin = getStreet(currentLocation)
    travel.newOrigin = "mi calleeeeeee"
    
    Lungo.Cache.set "travel", travel

  doPickUp: (event) =>
   # __Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
   # Lungo.Router.section "charge_s"

    if navigator.geolocation
      options =
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      navigator.geolocation.getCurrentPosition iniLocation, manageErrors

    Lungo.Router.section "init_s"
      
    setTimeout((=>
      driver = Lungo.Cache.get "driver"
      travel = Lungo.Cache.get "travel"
      server = Lungo.Cache.get "server"

      #alert "Arrive travelID: " + travel.travelID 
      #alert "Arrive latitude: " + travel.latitude
      #alert "Arrive longitude: " + travel.longitude  
      travel.newOrigin = "Mi casaaaaa 22222"
      #console.log(travel)
      
      $$.ajax
        type: "POST"
        url: server + "driver/travelstarted"
        data:
          email: driver.email
          travelID: travel.travelID
          origin: travel.newOrigin
          latitude: travel.latitude
          longitude: travel.longitude
        success: (result) =>
          #__Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
          Lungo.Router.section "charge_s"
        error: (xhr, type) =>
          alert type.response 
          Lungo.Router.section "arrive_s"       
    ) , 5000)
      
    
  cancelPickUp: (event) =>
    driver = Lungo.Cache.get "driver"
    travel = Lungo.Cache.get "travel"
    server = Lungo.Cache.get "server"
    alert travel.travelID
    alert driver.email
    $$.ajax
      type: "POST"
      url: server + "driver/canceltravel"
      data:
        travelID: travel.travelID
        email: driver.email
      success: (result) =>
        #__Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
        Lungo.Router.section "waiting_s"
      error: (xhr, type) =>
        alert type.response        

  doCall: (event) =>
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

  