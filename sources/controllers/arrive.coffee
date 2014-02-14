class __Controller.ArriveCtrl extends Monocle.Controller

  map = undefined
  
  elements:
    "#arrive_streetField"            : "streetField"
    "#arrive_call"                   : "telephone"
    "#arrive_pickup"                 : "button_PickUp"
    "#arrive_cancel"                 : "button_cancel"
  
  events:
    "tap #arrive_pickup"             : "doPickUp"
    "tap #arrive_cancel"             : "cancelPickUp"
    "tap #arrive_call"               : "doCall"

  constructor: ->
    super

  iniArrive: ->
    travel = Lungo.Cache.get "travel"
    @streetField[0].value = travel.origin
    @telephone[0].href = "tel:" + travel.phone

    if navigator.geolocation
      #unless map is undefined
      #  mapCanvas = document.getElementById("map-canvas")
      #  padre = mapCanvas.parentNode
      #  padre.removeChild mapCanvas
        
      #  eDIV = document.createElement("div");
      #  eDIV.setAttribute "id", "map-canvas"
      #  console.log eDIV
      #  document.getElementById("arrive_s").appendChild(eDIV);
      travel = Lungo.Cache.get "travel"
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
          featureType: "poi"
          elementType: "labels"
          stylers: [visibility: "off"]
        ]

      map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions)

      marker = new google.maps.Marker(
        position: arriveLocation 
        map: map
        title: travel.origin
      )

  manageErrors = (err) ->
    console.log "error gps arrive"

  #iniLocation = (location) =>
  #  travel = Lungo.Cache.get "travel"

  #  currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
  #  travel.latitude = location.coords.latitude
  #  travel.longitude = location.coords.longitude
  #  getStreet(currentLocation)  
    
  #  Lungo.Cache.set "travel", travel

  doPickUp: (event) =>
    @button_PickUp[0].disabled = true
    @button_cancel[0].disabled = true

    #if navigator.geolocation
    #  options =
    #    enableHighAccuracy: true,
    #    timeout: 5000,
    #    maximumAge: 0
    #  navigator.geolocation.getCurrentPosition iniLocation, manageErrors

    #Lungo.Router.section "init_s"
      
    #setTimeout((=>
    driver = Lungo.Cache.get "driver"
    travel = Lungo.Cache.get "travel"
    server = Lungo.Cache.get "server"

    latitude = Lungo.Cache.get "latitude"
    longitude = Lungo.Cache.get "longitude"
    # Si la señal del gps ha fallado y no tenemos datos dejamos los valores que nos ha pasado el cliente
    if latitude is undefined or longitude is undefined
      latitude = travel.latitude
      longitude = travel.longitude
      origin = travel.origin
    # si tenemos las coordenadas cuando recogemos al cliente buscamos la calle donde estamos con las coordenadas
    else
      # Cogemos la posicion con latitud y longitud para coger la calle donde estamos
      currentLocation = new google.maps.LatLng(latitude, longitude)
      getStreet(currentLocation)  
      origin = Lungo.Cache.get "origin" 

    $$.ajax
      type: "POST"
      url: server + "driver/travelstarted"
      data:
        email: driver.email
        travelID: travel.travelID
        origin: origin
        latitude: latitude
        longitude: longitude
      success: (result) =>
        @button_PickUp[0].disabled = false
        @button_cancel[0].disabled = false
        __Controller.charge.initialize()
        Lungo.Router.section "charge_s"
      error: (xhr, type) =>
        @button_PickUp[0].disabled = false
        @button_cancel[0].disabled = false
        navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"
          #Lungo.Router.section "arrive_s"       
    #) , 5000)
      
    
  cancelPickUp: (event) =>
    @button_PickUp[0].disabled = true
    @button_cancel[0].disabled = true
    onConfirm = (button) =>
      switch button
        when 1
          @canceltravel()
        when 2
          @button_PickUp[0].disabled = false
          @button_cancel[0].disabled = false
      return
    navigator.notification.confirm "", onConfirm, "¿Esta seguro que desea cancelar el viaje?", "Si, No"

    #Lungo.Notification.confirm
    #  title: "¿Esta seguro que desea cancelar el viaje?"
    #  description: ""
    #  accept:
    #    label: "Si"
    #    callback: =>
    #      @canceltravel()
    #  cancel:
    #    label: "No"
    #    callback: =>
    #      @button_PickUp[0].disabled = false
    #      @button_cancel[0].disabled = false

  canceltravel: =>
    driver = Lungo.Cache.get "driver"
    travel = Lungo.Cache.get "travel"
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/canceltravel"
      data:
        travelID: travel.travelID
        email: driver.email
      success: (result) =>
        @button_PickUp[0].disabled = false
        @button_cancel[0].disabled = false
        Lungo.Router.section "waiting_s"
        Lungo.Cache.remove "requestInProgress"  
        Lungo.Cache.set "requestInProgress", false
      error: (xhr, type) =>
        @button_PickUp[0].disabled = false
        @button_cancel[0].disabled = false
        navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"

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
            street = results[0].address_components[1].short_name
          else 
            street = results[0].address_components[1].short_name + ", " +results[0].address_components[0].short_name
        else
          street = 'Calle desconocida'
      else
        street = 'Calle desconocida'
      Lungo.Cache.remove "origin"  
      Lungo.Cache.set "origin", street
  