class __Controller.ConfirmationCtrl extends Monocle.Controller
  timer = null

  elements:
    #"#confirmation_streetField"           : "streetField"
    "#confirmation_name"                  : "customerName"
    "#confirmation_valuation"             : "valuation"
    "#confirmation_street"                : "streetField"
    "#confirmation_accept"                : "button_accept"
    "#confirmation_reject"                : "button_reject"
    
  events:
    "tap #confirmation_accept"            : "acceptConfirmation"
    "tap #confirmation_reject"            : "rejectConfirmation"

  constructor: ->
    super

  loadTravel: (travel) ->
    
    @button_accept[0].disabled = false
    @button_reject[0].disabled = false

    #@streetField[0].value = travel.origin
    #@customerName[0].innerText = travel.name
    @customerName[0].innerText = "Nombre y Apellidos"
    @streetField[0].innerText = travel.origin

    val = ""
    i = 0
    while i < travel.valuation
      val = val + "★"
      i++
    while i < 5
      val = val + "☆"
      i++
    @valuation[0].innerText = val

    #Lungo.Cache.set "travel", travel
    #timer = setTimeout((=>Lungo.Router.section "waiting_s") , 15000)
    #@streetField[0].value = travel.origin
    
    Lungo.Cache.remove "travel"
    Lungo.Cache.set "travel", travel

    timer = setTimeout((=>
      Lungo.Cache.remove "requestInProgress"  
      Lungo.Cache.set "requestInProgress", false
      Lungo.Router.section "waiting_s") 
    , 25000)
    
  acceptConfirmation: (event) =>
    @stopTimer()

    @button_accept[0].disabled = true
    @button_reject[0].disabled = true

    driver = Lungo.Cache.get "driver"
    travel = Lungo.Cache.get "travel"
    data = 
      email: driver.email
      travelID: travel.travelID 
      latitude: travel.latitude
      longitude: travel.longitude   
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/accepttravel"
      data: data
      success: (result) =>
        Lungo.Router.section "arrive_s"
        __Controller.arrive.iniArrive()
      error: (xhr, type) =>
        @button_accept[0].disabled = false
        @button_reject[0].disabled = false
        navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"
        Lungo.Cache.remove "requestInProgress"  
        Lungo.Cache.set "requestInProgress", false
        Lungo.Router.section "waiting_s"


  rejectConfirmation: (event) =>
    @stopTimer()
    Lungo.Cache.remove "requestInProgress"  
    Lungo.Cache.set "requestInProgress", false
    Lungo.Router.section "waiting_s"

  stopTimer: =>
    clearTimeout timer
  

  