class __Controller.WaitingCtrl extends Monocle.Controller
  timer = null
  driver = null
  disponible = true
  watchId = undefined

  events:
    "tap #waiting_logout"                  : "logOut"
    "tap #waiting_confirmation"            : "goConfirmation"
    "tap #waiting_prueba1"                 : "doLocation"
    "tap #waiting_prueba2"                 : "doPost"
    "tap #waiting_prueba3"                 : "doPago"
    "change #waiting_available"            : "changeAvailable"

  elements:
    "#waiting_driver"                      : "driver"
    "#waiting_available"                   : "valorAvailable"

  constructor: ->
    super
    driver = Lungo.Cache.get "driver"
    @driver[0].innerText = driver.last_name + ", " + driver.first_name

  doPago: =>
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/travelcompleted"
      data:
        travelID: 84
        email: "conductor@gmail.com"
        destination: "Mi otraaaa cassssaa"
        latitude: 44.2641160000000013
        longitude: -4.9237662000000002
        appPayment: true
        cost: 33.42
      success: (result) =>
        Lungo.Router.section "waiting_s"
      error: (xhr, type) =>
        alert type.response        

    Lungo.Router.section "waiting_s"
      
  doPost: =>
    notification=
      code: "801"
      travelID: 132
      origin: "Mi casaaaaa"
      startpoint: "66.2641160000000013, -6.9237662000000002"
      valuation: 3
      phone: 666666666
    __Controller.push.handlePush(notification)
    
  logOut: =>
    navigator.geolocation.clearWatch @watchId
    @watchId = undefined
    #AQUI HABRIA QUE HACER UNA PETICION A SERVER PARA QUE TE PONGA A NO DISPONIBLE
    Lungo.Cache.set "pushID", undefined
    @updateAvailable(driver.email, false)
    Lungo.Cache.set "driver", ""
    Lungo.Router.section "login_s"
    
  goConfirmation: =>
    #__Controller.confirmation = new __Controller.ConfirmationCtrl "section#confirmation_s"
    Lungo.Router.section "confirmation_s"
  
  doLocation: =>
    @getLocationUpdate()
    
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
        #alert "posicion actualizada"
      error: (xhr, type) =>
        alert type.response

  changeAvailable: =>
    @updateAvailable(driver.email, @valorAvailable[0].checked)
    if @valorAvailable[0].checked
      @getLocationUpdate()
    else
      @stopWatch()
