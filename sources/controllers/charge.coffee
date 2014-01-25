class __Controller.ChargeCtrl extends Monocle.Controller

	elements:
    "#charge_amount"                 : "amount"

	events:
    "tap #charge_charge"             : "doCharge"
    
  constructor: ->
    super
    
  doCharge: (event) =>
    correcto = @valideAmount(@amount[0].value)
    if correcto
      Lungo.Router.section "waiting_s"

      #driver = Lungo.Cache.get "driver"
      #push = Lungo.Cache.get "push"
      #server = Lungo.Cache.get "server"
      #$$.ajax
      #  type: "POST"
      #  url: server + "driver/travelcompleted"
      #  data:
      #    travelID: push.travelID
      #    email: driver.email
      #    destination: preguntar a david
      #    latitude: ?
      #    longitude: ?
      #    appPayment: ?
      #    cost: @amount[0].value
      #  success: (result) =>
      #    Lungo.Router.section "waiting_s"
      #  error: (xhr, type) =>
      #    alert type.response        

  valideAmount: (amount) =>
    # how many decimals are allowed?
    decallowed = 2 
    if isNaN(amount)
      alert "El importe introducido no es correcto."
      return false
    else if amount is ""
      alert "El importe no puede estar vacío"  
      return false
    else
      amount += "."  if amount.indexOf(".") is -1
      dectext = amount.substring(amount.indexOf(".") + 1, amount.length)
      if dectext.length > decallowed
        alert "Por favor, entra un número con " + decallowed + " números decimales."
        return false
      else
        return true