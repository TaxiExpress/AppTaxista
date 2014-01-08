class __Controller.ArriveCtrl extends Monocle.Controller

  elements:
    "#arrive_telephone"              : "telephone"
  events:
    "tap #arrive_pickup"             : "doPickUp"
    "tap #arrive_cancel"             : "cancelPickUp"
    "tap #arrive_call"               : "doCall"

  constructor: ->
    super
    
  doPickUp: (event) =>
    __Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
    Lungo.Router.section "charge_s"
    
  cancelPickUp: (event) =>
    Lungo.Router.section "init_s"

  doCall: (event) =>
    alert "llamando"

  