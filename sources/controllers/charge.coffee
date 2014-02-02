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
    travel = Lungo.Cache.get "travel"

    currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
    #alert "latitude: "  + travel.latitude
    #alert "Nueva latitude: "  + location.coords.latitude
    #alert "longitude: " + travel.latitude
    #alert "Nueva longitude: " + location.coords.longitude
    travel.latitude = location.coords.latitude
    travel.longitude = location.coords.longitude
    #travel.destination = @getStreet(currentLocation)  
    #alert "Street: " + travel.destination
    #alert "Street: " + getStreet(43.32197354474697 -2.9898569638094625)
    travel.destination = "mi segunda casa"

    Lungo.Cache.set "travel", travel

    #@travelCompleted()

  manageErrors = =>
    console.log "ERROR CHARGE"
    
  doCharge: (event) =>
    #getStreet(43.32197354474697 -2.9898569638094625)  
    correcto = @valideAmount(@amount[0].value)
    if correcto
      travel = Lungo.Cache.get "travel"
      #alert "doCharge"
      if navigator.geolocation
        #alert "geo"
        options =
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        navigator.geolocation.getCurrentPosition iniLocation, manageErrors

    Lungo.Router.section "init_s"
    setTimeout((=> @travelCompleted()) , 5000)

  travelCompleted: =>
    #alert "travelCompleted"
    driver = Lungo.Cache.get "driver"
    server = Lungo.Cache.get "server"
    travel = Lungo.Cache.get "travel"
    #alert "Charget travel: " + travel.travelID 
    #alert "Charget email: " + driver.email
    #alert "Charget destination: " + travel.destination
    #alert "Charget latitude: " + travel.latitude
    #alert "Charget longitude: " + travel.longitude
    #alert "Charget appPayment: " + @valorCard[0].checked
    #alert "Charget Amount: " + @amount[0].value

    travel.destination = ""  if travel.destination is 'undefined'

    $$.ajax
      type: "POST"
      url: server + "driver/travelcompleted"
      data:
        travelID: travel.travelID
        email: driver.email
        destination: travel.destination
        latitude: travel.latitude
        longitude: travel.longitude
        appPayment: @valorCard[0].checked
        cost: @amount[0].value
      success: (result) =>
        #@charge_amount[0].innerText = ""
        Lungo.Router.section "waiting_s"
      error: (xhr, type) =>
        alert type.response        
        Lungo.Router.section "charge_s"
     Lungo.Router.section "waiting_s"

  getStreet = (pos) =>
    #alert "street"
    geocoder = new google.maps.Geocoder()
    geocoder.geocode
      latLng: pos
    , (results, status) =>
      if status is google.maps.GeocoderStatus.OK
        if results[1]
          if results[0].address_components[1].short_name == results[0].address_components[0].short_name
            results[0].address_components[1].short_name
          else 
            results[0].address_components[1].short_name + ", " +results[0].address_components[0].short_name
        else
          'Calle desconocida'
      else
        'Calle desconocida'
    #alert "fin street"

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