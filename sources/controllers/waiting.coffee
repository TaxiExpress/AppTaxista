class __Controller.WaitingCtrl extends Monocle.Controller
  timer = null
  driver = null
  disponible = true
  
  events:
    "tap #waiting_logout"                  : "logOut"
    "tap #waiting_confirmation"            : "goConfirmation"
    "tap #waiting_prueba1"                 : "doLocation"
    "change #waiting_available"            : "changeAvailable"

  elements:
    "#waiting_driver"                      : "driver"
    "#waiting_available"                   : "valorAvailable"

  constructor: ->
    super
    driver = Lungo.Cache.get "driver"
    @driver[0].innerText = driver.last_name + ", " + driver.first_name
    
  logOut: =>
    navigator.geolocation.clearWatch(watchId);
    watchId = null;

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
      options = 
        enableHighAccuracy: true
        timeout: 27000
        maximumAge : 30000
      watchID = navigator.geolocation.watchPosition(updatePosition, null, options)

  stopWatch: =>
  if watchId
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  
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
        @
      error: (xhr, type) =>
        @
        #alert type.response
  
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
    if @valorAvailable[0].checked
      @getLocationUpdate()
    else
      @stopWatch()

      



