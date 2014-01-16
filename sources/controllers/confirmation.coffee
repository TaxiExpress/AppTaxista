class __Controller.ConfirmationCtrl extends Monocle.Controller
  timer = null

  events:
    "tap #confirmation_accept"            : "acceptConfirmation"
    "tap #confirmation_reject"            : "rejectConfirmation"

  constructor: ->
    super
    timer = setTimeout((=>Lungo.Router.section "init_s") , 5000)
    
  acceptConfirmation: (event) =>
    @stopTimer()
    __Controller.arrive = new __Controller.ArriveCtrl "section#arrive_s"
    Lungo.Router.section "arrive_s"
    
  rejectConfirmation: (event) =>
    @stopTimer()
    Lungo.Router.section "init_s"

  stopTimer: =>
    clearTimeout timer
  

  