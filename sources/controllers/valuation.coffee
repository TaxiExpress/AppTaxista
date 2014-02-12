class __Controller.ValuationCtrl extends Monocle.Controller

	#elements:
  #  "#valuation_name"                  : "customerName"
  #  "#valuation_valuation"             : "valuation"

  #events:
  #  "singleTap #charge_positiveVote" : "votePositive"
  #  "singleTap #charge_negativeVote" : "voteNegative"
    
  constructor: ->
    super

  initialize: (travel)=>
    #travel = Lungo.Cache.get "travel"

    #alert travel.name
    #@customerName[0].innerText = travel.name
    #alert travel.valuation

    #val = ""
    #i = 0
    #while i < travel.valuation
    #  val = val + "★"
    #  i++
    #while i < 5
    #  val = val + "☆"
    #  i++
    #alert val
    #@valuation[0].innerText = val
 
  #votePositive: (event) =>
  #  @vote "positive"

  #voteNegative: (event) =>
  #  @vote "negative"

  #vote: (vote) =>
  #  travel = Lungo.Cache.get "travel"
  #  server = Lungo.Cache.get "server"
  #  data =
  #    email: travel.email
  #    vote: vote
  #    travelID: @travel.id
  #  $$.ajax
  #    type: "POST"
  #    url: server + "driver/votecustomer"
  #    data: data
  #    success: (result) =>
  #      navigator.notification.alert "Cliente valorado", null, "Taxi Express", "Aceptar"
  #    error: (xhr, type) =>
  #     console.log type.response
  #      navigator.notification.alert "Error al valorar al cliente", null, "Taxi Express", "Aceptar"