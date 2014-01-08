class __Controller.ConfirmationCtrl extends Monocle.Controller

  events:
    "tap #confirmation_accept"            : "acceptConfirmation"
    "tap #confirmation_reject"            : "rejectConfirmation"

  constructor: ->
    super
    
  acceptConfirmation: (event) =>
    __Controller.arrive = new __Controller.ArriveCtrl "section#arrive_s"
    Lungo.Router.section "arrive_s"
    
  rejectConfirmation: (event) =>
    Lungo.Router.section "init_s"

  