class __Controller.ConfirmationCtrl extends Monocle.Controller
  timer = null

  elements:
    #"#confirmation_streetField"           : "streetField"
    "#confirmation_name"                  : "customerName"
    "#confirmation_valuation"             : "valuation"
    "#confirmation_street"                : "streetField"
    
  events:
    "tap #confirmation_accept"            : "acceptConfirmation"
    "tap #confirmation_reject"            : "rejectConfirmation"

  constructor: ->
    super

  loadTravel: (travel) ->
    alert travel.origin
    #@streetField[0].value = travel.origin
    @customerName[0].innerText = travel.name
    @streetField[0].innerText = travel.origin
    alert travel.valuation

    val = ""
    i = 0
    while i < travel.valuation
      val = val + "★"
      i++
    while i < 5
      val = val + "☆"
      i++
    alert val
    @valuation[0].innerText = val

    Lungo.Cache.set "travel", travel
    timer = setTimeout((=>Lungo.Router.section "waiting_s") , 15000)

    @streetField[0].value = travel.origin
    Lungo.Cache.remove "travel"
    Lungo.Cache.set "travel", travel
    timer = setTimeout((=>Lungo.Router.section "waiting_s") , 25000)
    
  acceptConfirmation: (event) =>
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
        __Controller.arrive.iniArrive()
        Lungo.Router.section "arrive_s"
      error: (xhr, type) =>
        navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"
        Lungo.Router.section "waiting_s"
    @stopTimer()

  rejectConfirmation: (event) =>
    @stopTimer()
    Lungo.Router.section "waiting_s"

  stopTimer: =>
    clearTimeout timer
  

  