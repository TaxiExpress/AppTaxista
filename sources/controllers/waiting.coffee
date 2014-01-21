class __Controller.WaitingCtrl extends Monocle.Controller
  timer = null

  events:
    "tap #waiting_logout"                  : "logOut"
    "tap #waiting_confirmation"            : "goConfirmation"
    "tap #waiting_prueba1"                 : "doLocation"
    "tap #waiting_prueba2"                 : "doAvailable"

  elements:
    "#waiting_driver"                      : "driver"

  constructor: ->
    super
    alert "waiting"
    driver = Lungo.Cache.get "driver"
    @driver[0].innerText = driver.apellidos + ", " + driver.nombre
    console.log driver.nombre
    
  logOut: =>
    alert "logout"
    Lungo.Cache.set "nombre", ""
    Lungo.Cache.set "apellidos", ""
    Lungo.Router.section "login_s"
    
  goConfirmation: =>
    __Controller.confirmation = new __Controller.ConfirmationCtrl "section#confirmation_s"
    Lungo.Router.section "confirmation_s"
  
  doLocation: =>
    @getLocationUpdate()

  getLocationUpdate: ->
    if navigator.geolocation
      # timeout at 60000 milliseconds (60 seconds)
      options = timeout: 60000
      geoLoc = navigator.geolocation
      watchID = geoLoc.watchPosition(showLocation, errorHandler, options)
    else
      alert "Sorry, browser does not support geolocation!"

  showLocation = (position) ->
    latitude = position.coords.latitude
    longitude = position.coords.longitude
    alert "Latitude : " + latitude + " Longitude: " + longitude
    @updatePosition("conductor@gmail.com", latitude, longitude)

  errorHandler = (err) ->
    if err.code is 1
      alert "Error: Access is denied!"
    else alert "Error: Position is unavailable!"  if err.code is 2

  updatePosition: (email, latitude, longitude)=>
    alert "update position"
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/updateDriverPosition"
      data:
        email: email
        latitude: latitude 
        longitude: longitude
      success: (result) =>
        #alert "posicion actualizada"
      error: (xhr, type) =>
        alert type.response
  
  doAvailable: =>
    alert "Available"
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/updateDriverAvailable"
      data:
        email: "conductor@gmail.com"
        available: true
      success: (result) =>
        #alert "posicion actualizada"
      error: (xhr, type) =>
        alert type.response
  