class __Controller.ConfirmationCtrl extends Monocle.Controller
  timer = null
  push = null

  elements:
    "#confirmation_streetField"           : "streetField"

  events:
    "tap #confirmation_accept"            : "acceptConfirmation"
    "tap #confirmation_reject"            : "rejectConfirmation"

  constructor: ->
    super
    timer = setTimeout((=>Lungo.Router.section "waiting_s") , 5000)
    push = new Object()
    push.origin = "Gran Via"
    push.latitude = 43.32197354474697
    push.longitude = -2.9898569638094625
    push.travelID = 1
    push.valoracion = 4
    push.telephone = 666778899
    @streetField[0].value = push.origin
    Lungo.Cache.set "push", push
    
  acceptConfirmation: (event) =>
    @stopTimer()
    driver = Lungo.Cache.get "driver"
    
    __Controller.arrive = new __Controller.ArriveCtrl "section#arrive_s"
    Lungo.Router.section "arrive_s"
    

    #server = Lungo.Cache.get "server"
    #$$.ajax
    #  type: "POST"
    #  url: server + "driver/accepttravel"
    #  data:
    #    email: driver.email
    #    travelID: push.travelID 
    #    latitude: push.latitude
    #    longitude: push.longitude 
    #  success: (result) =>
    #    __Controller.arrive = new __Controller.ArriveCtrl "section#arrive_s"
    #    Lungo.Router.section "arrive_s"
    #  error: (xhr, type) =>
    #    alert type.response        

  rejectConfirmation: (event) =>
    @stopTimer()
    Lungo.Router.section "waiting_s"

  stopTimer: =>
    clearTimeout timer
  

  