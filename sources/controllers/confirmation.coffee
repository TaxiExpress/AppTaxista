class __Controller.ConfirmationCtrl extends Monocle.Controller
  timer = null
  travel = null

  elements:
    "#confirmation_streetField"           : "streetField"

  events:
    "tap #confirmation_accept"            : "acceptConfirmation"
    "tap #confirmation_reject"            : "rejectConfirmation"

  constructor: ->
    super
    
    #prueba push
    #travel = 
    #  id: 4
    #  origin: "Mi casaaaaa"
    #  latitude: 43.32197354474697
    #  longitude: -2.9898569638094625
    #  valuation: 4
    #  phone: 666778899

  loadTravel: (travel) ->
    @streetField[0].value = travel.origin
    Lungo.Cache.set "travel", travel
    timer = setTimeout((=>Lungo.Router.section "waiting_s") , 5000)
    
  acceptConfirmation: (event) =>
    driver = Lungo.Cache.get "driver"
    travel = Lungo.Cache.get "travel"
    #__Controller.arrive = new __Controller.ArriveCtrl "section#arrive_s"
    #Lungo.Router.section "arrive_s"

    #alert "Confirmation latitude: " + travel.latitude
    #alert "Confirmation longitude: " + travel.longitude  

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
        alert type.response        

    @stopTimer()

  rejectConfirmation: (event) =>
    @stopTimer()
    Lungo.Router.section "waiting_s"

  stopTimer: =>
    clearTimeout timer
  

  