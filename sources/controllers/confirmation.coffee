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
    timer = setTimeout((=>Lungo.Router.section "waiting_s") , 5000)
    travel = Lungo.Cache.get "travel"
    #@streetField[0].value = travel.origin

    #prueba push
    #travel = new Object()
    #travel.id = 11
    #travel.origin = "Mi casaaaaa"
    #travel.startpoint = notification.startpoint
    ##travel.latitude = 43.32197354474697
    #travel.longitude = -2.9898569638094625
    #travel.valuation = 4
    #travel.phone = 666778899

  acceptConfirmation: (event) =>
    
    driver = Lungo.Cache.get "driver"
    
    #__Controller.arrive = new __Controller.ArriveCtrl "section#arrive_s"
    #Lungo.Router.section "arrive_s"
    
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/accepttravel"
      data:
        email: driver.email
        travelID: travel.id 
        latitude: travel.latitude
        longitude: travel.longitude 
      success: (result) =>
        __Controller.arrive = new __Controller.ArriveCtrl "section#arrive_s"
        Lungo.Router.section "arrive_s"
      error: (xhr, type) =>
        alert type.response        

    @stopTimer()

  rejectConfirmation: (event) =>
    @stopTimer()
    Lungo.Router.section "waiting_s"

  stopTimer: =>
    clearTimeout timer
  

  