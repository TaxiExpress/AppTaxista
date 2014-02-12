class __Controller.WaitingCtrl extends Monocle.Controller
  driver = null
  watchId = undefined

  events:
    #"tap #waiting_logout"                  : "logOut"
    "change #waiting_available"            : "changeAvailable"
    "tap #waiting_prueba1"                 : "confirmation"
    "tap #waiting_prueba3"                 : "charge"
    "tap #waiting_prueba4"                 : "valuation"

  elements:
    "#waiting_driver"                      : "driver"
    "#waiting_available"                   : "valorAvailable"

  constructor: ->
    super
    driver = Lungo.Cache.get "driver"
    @driver[0].innerText = driver.last_name + ", " + driver.first_name
    #@getLocationUpdate()

  confirmation: =>
    travel = 
      name: "Fermin Querejeta Mendo"
      valuation: 4
      origin: "mi casa"
    __Controller.confirmation.loadTravel(travel)
    Lungo.Router.section "confirmation_s"

  charge: =>
    Lungo.Router.section "charge_s"
    __Controller.charge.initialize()

  valuation: =>
    travel = 
      name: "Fermin Querejeta Mendo"
      valuation: 4
      origin: "mi casa"
    alert "valuation"
    __Controller.valuation.initialize(travel)
    Lungo.Router.section "valuation_s"

  getLocationUpdate: =>
    if navigator.geolocation
      options = 
        enableHighAccuracy: true
        timeout: 3000
        maximumAge : 3000
      tt = navigator.geolocation.watchPosition updatePosition, manageError, options
      @watchId = tt

  stopWatch: =>
    if @watchId
      navigator.geolocation.clearWatch(@watchId)
      @watchId = undefined
  
  updatePosition = (position) =>
    driver = Lungo.Cache.get "driver"
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

  manageError = =>
    console.log "ERROR"

  updateAvailable: (email, available) =>
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/updatedriveravailable"
      data:
        email: email
        available: available
      success: (result) =>
        @
      error: (xhr, type) =>
        navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"

  changeAvailable: =>
    @updateAvailable(driver.email, @valorAvailable[0].checked)
    if @valorAvailable[0].checked
      @getLocationUpdate()
    else
      @stopWatch()

  #logOut: =>
  #  @stopWatch()
    
  #  Lungo.Cache.set "pushID", undefined
  #  @updateAvailable(driver.email, false)
  #  Lungo.Cache.set "driver", ""
  #  Lungo.Router.section "login_s"
    
  
