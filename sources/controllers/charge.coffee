class __Controller.ChargeCtrl extends Monocle.Controller

	elements:
    "#charge_amount"                 : "amount"
    "#option_cash"                   : "valorCash"
    "#option_card"                   : "valorCard"

	events:
    "tap #charge_charge"             : "doCharge"
    
  constructor: ->
    super

  iniLocation = (location) =>
    currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
    travel.latitude = location.latitude
    travel.longitude = location.longitude
    travel.destination = @getStreet(currentLocation)  

  manageErrors = =>
    console.log "ERROR"
    
  doCharge: (event) =>
    correcto = @valideAmount(@amount[0].value)
    if correcto
      travel = Lungo.Cache.get "travel"

      if navigator.geolocation
        options =
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        navigator.geolocation.getCurrentPosition iniLocation, manageErrors
    
      driver = Lungo.Cache.get "driver"
      server = Lungo.Cache.get "server"
      $$.ajax
        type: "POST"
        url: server + "driver/travelcompleted"
        data:
          travelID: travel.id
          email: driver.email
          destination: travel.destination
          latitude: travel.latitude
          longitude: travel.longitude
          appPayment: @valorCard[0].checked
          cost: @amount[0].value
        success: (result) =>
          Lungo.Router.section "waiting_s"
        error: (xhr, type) =>
          alert type.response        

      Lungo.Router.section "waiting_s"

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