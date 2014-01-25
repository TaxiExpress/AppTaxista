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
    #Lungo.Router.section "home_s"
    if map == undefined
      #currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
      currentLocation = new google.maps.LatLng(43.32197354474697, -2.9898569638094625)
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

  doPickUp: (event) =>
    __Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
    Lungo.Router.section "charge_s"

    #driver = Lungo.Cache.get "driver"
    #push = Lungo.Cache.get "push"
    #server = Lungo.Cache.get "server"
    #$$.ajax
    #  type: "POST"
    #  url: server + "driver/travelstarted"
    #  data:
    #    email: driver.email
    #    travelID: push.travelID
    #    origin: no se lo que hay que poner
    #    #estoy a que coger el punto actual por si le ha recogido en otro sitio al inicialmente acordado 
    #    latitude: 1
    #    longitude: 1
    #  success: (result) =>
    #    __Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
    #    Lungo.Router.section "charge_s"
    #  error: (xhr, type) =>
    #    alert type.response        
    
  cancelPickUp: (event) =>
    Lungo.Router.section "waiting_s"

  doCall: (event) =>
    alert "llamando"
    document.getElementById("fdw").onclick();

  