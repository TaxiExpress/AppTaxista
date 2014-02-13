class __Controller.ChargeCtrl extends Monocle.Controller

	elements:
    "#charge_amount"                 : "amount"
    "#charge_cash"                   : "optionCash"
    "#charge_app_fieldset"           : "fieldset_charge_app"
    "#charge_app"                    : "optionApp"
    "#charge_livote"                 : "li_vote"
    "#charge_votebox"                : "fieldset_vote"
    "#charge_positiveVote"           : "button_Positive"
    "#charge_negativeVote"           : "button_Negative"
    "#charge_charge"                 : "button_charge"

  events:
    "tap #charge_charge"             : "doCharge"
    "singleTap #charge_app"          : "changeCash"
    "singleTap #charge_cash"         : "changeApp"
    "tap #charge_positiveVote"       : "votePositive"
    "tap #charge_negativeVote"       : "voteNegative"

  constructor: ->
    super

  initialize: =>
    
    @optionCash[0].checked = true
    @button_charge[0].disabled = false
    
    driver = Lungo.Cache.get "driver"
    if driver.appPayment is false
      @optionCash[0].disabled = true
      if document.getElementById("charge_app_fieldset")
        fieldset = document.getElementById("charge_app_fieldset")
        alert fieldset
        padre = fieldset.parentNode
        padre.removeChild fieldset
      else
        @optionApp[0].checked = false

    @li_vote[0].style.visibility = "hidden"
    @fieldset_vote[0].style.visibility = "hidden"
    #@button_Positive[0].style.visibility = "hidden"
    #@button_Negative[0].style.visibility = "hidden"

  changeCash: =>
    driver = Lungo.Cache.get "driver"

    if driver.appPayment is true
      if @optionApp[0].checked is true
        @optionCash[0].checked = false
      else
        @optionCash[0].checked = true

  changeApp: =>
    driver = Lungo.Cache.get "driver"

    if driver.appPayment is true
      if @optionCash[0].checked is true
        @optionApp[0].checked = false
      else
        @optionApp[0].checked = true

  iniLocation = (location) =>
    travel = Lungo.Cache.get "travel"

    currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
    travel.latitude = location.coords.latitude
    travel.longitude = location.coords.longitude
    getStreet(currentLocation)  
    
    Lungo.Cache.set "travel", travel

  manageErrors = =>
    console.log "ERROR CHARGE"
    
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

      @button_charge[0].disabled = true  
      #Lungo.Router.section "init_s"
      setTimeout((=> @travelCompleted()) , 5000)

  travelCompleted: =>
    driver = Lungo.Cache.get "driver"
    server = Lungo.Cache.get "server"
    travel = Lungo.Cache.get "travel"

    travel.destination = Lungo.Cache.get "destination"
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
        appPayment: @optionApp[0].checked
        cost: @amount[0].value
      success: (result) =>
        @amount[0].value = ""
        if @optionCash[0].checked
          @li_vote[0].style.visibility = "visible"
          @fieldset_vote[0].style.visibility = "visible"
          #Lungo.Router.section "waiting_s"
          #Lungo.Router.section "valuation_s"
      error: (xhr, type) =>
        navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"
        Lungo.Router.section "charge_s"
    # Lungo.Router.section "waiting_s"

  getStreet = (pos) =>
    geocoder = new google.maps.Geocoder()
    geocoder.geocode
      latLng: pos
    , (results, status) =>
      if status is google.maps.GeocoderStatus.OK
        if results[1]
          if results[0].address_components[1].short_name == results[0].address_components[0].short_name
            street = results[0].address_components[1].short_name
          else 
            street = results[0].address_components[1].short_name + ", " +results[0].address_components[0].short_name
        else
          street = 'Calle desconocida'
      else
        street = 'Calle desconocida'
      Lungo.Cache.remove "destination"  
      Lungo.Cache.set "destination", street

  valideAmount: (amount) =>
    # how many decimals are allowed?
    decallowed = 2 
    if isNaN(amount)
      navigator.notification.alert "El importe introducido no es correcto", null, "Taxi Express", "Aceptar"
      return false
    else if amount is ""
      navigator.notification.alert "El importe no puede estar vacío", null, "Taxi Express", "Aceptar"
      return false
    else
      amount += "."  if amount.indexOf(".") is -1
      dectext = amount.substring(amount.indexOf(".") + 1, amount.length)
      if dectext.length > decallowed
        navigator.notification.alert "Por favor, entra un número con " + decallowed + " números decimales.", null, "Taxi Express", "Aceptar"
        return false
      else
        return true

  votePositive: (event) =>
    @vote "positive"

  voteNegative: (event) =>
    @vote "negative"

  vote: (vote) =>
    driver = Lungo.Cache.get "driver"
    travel = Lungo.Cache.get "travel"
    server = Lungo.Cache.get "server"
    data =
      email: driver.email
      vote: vote
      travelID: travel.travelID
    $$.ajax
      type: "POST"
      url: server + "driver/votecustomer"
      data: data
      success: (result) =>
        navigator.notification.alert "Cliente valorado", null, "Taxi Express", "Aceptar"
        Lungo.Router.section "waiting_s"
      error: (xhr, type) =>
        console.log type.response
        navigator.notification.alert "Error al valorar al cliente", null, "Taxi Express", "Aceptar"
        Lungo.Router.section "waiting_s"