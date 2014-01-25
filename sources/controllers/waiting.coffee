class __Controller.WaitingCtrl extends Monocle.Controller
  timer = null
  driver = null
  disponible = true
  
  events:
    "tap #waiting_logout"                  : "logOut"
    "tap #waiting_confirmation"            : "goConfirmation"
    "tap #waiting_prueba1"                 : "doLocation"
    "tap #waiting_prueba2"                 : "doBackground"
    "change #waiting_available"            : "changeAvailable"

  elements:
    "#waiting_driver"                      : "driver"
    "#waiting_available"                   : "valorAvailable"

  constructor: ->
    super
    driver = Lungo.Cache.get "driver"
    @driver[0].innerText = driver.last_name + ", " + driver.first_name
    
  logOut: =>
    Lungo.Cache.set "driver", ""
    Lungo.Router.section "login_s"
    
  goConfirmation: =>
    __Controller.confirmation = new __Controller.ConfirmationCtrl "section#confirmation_s"
    Lungo.Router.section "confirmation_s"
  
  doLocation: =>
    #setTimeout((=>@getLocationUpdate()) , 30000)
    @getLocationUpdate()

  getLocationUpdate: =>
    #@updatePosition("conductor@gmail.com", 43.3256502, -2.990092699999991)
    if navigator.geolocation
      # timeout at 60000 milliseconds (60 seconds)
      options = timeout: 60000
      geoLoc = navigator.geolocation
      watchID = geoLoc.watchPosition(updatePosition, errorHandler, options)
    #else
    #  alert "Sorry, browser does not support geolocation!"

    @doLocation()

  errorHandler = (err) ->
  #  if err.code is 1
  #    alert "Error: Access is denied!"
  #  else alert "Error: Position is unavailable!"  if err.code is 2

  updatePosition = (position)->
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/updatedriverposition"
      data:
        email: driver.email
        latitude: position.coords.latitude
        longitude: position.coords.longitude
      success: (result) =>
        #alert "posicion actualizada. Latitud: " + position.coords.latitude + ". Longitud: " + position.coords.longitude
      error: (xhr, type) =>
        alert type.response
  
  updateAvailable: (email, available) =>
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/updatedriveravailable"
      data:
        email: email
        available: available
      success: (result) =>
        #alert "posicion actualizada"
      error: (xhr, type) =>
        alert type.response

  changeAvailable: =>
    @updateAvailable(driver.email, @valorAvailable[0].checked)

  doBackground: =>
    setTimeout((=>@actAvailable()) , 5000)


  actAvailable: =>
    if disponible
      disponible = false
    else
      disponible = true
    
    @updateAvailable(driver.email, disponible)

    @doBackground()


      



