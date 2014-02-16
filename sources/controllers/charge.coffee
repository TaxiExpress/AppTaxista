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
    "change #charge_app"          : "changeApp"
    "change #charge_cash"         : "changeCash"
    "tap #charge_positiveVote"       : "votePositive"
    "tap #charge_negativeVote"       : "voteNegative"


  constructor: ->
    super
    driver = Lungo.Cache.get "driver"
    @optionApp[0].checked = driver.appPayment
    if !driver.appPayment
      @optionCash[0].checked = !driver.appPayment
      @optionCash[0].disabled = !driver.appPayment
      @fieldset_charge_app[0].style.display = "none"


  initialize: =>
    Lungo.Router.section "charge_s"
    @button_charge[0].disabled = false  
    @li_vote[0].style.display = "none"
    @fieldset_vote[0].style.display = "none"


  changeApp: =>
    driver = Lungo.Cache.get "driver"
    if driver.appPayment
      if @optionApp[0].checked
        @optionApp[0].checked = true
        @optionCash[0].checked = false
      else
        @optionApp[0].checked = false
        @optionCash[0].checked = true

    

  changeCash: =>
    driver = Lungo.Cache.get "driver"
    if driver.appPayment
      if @optionCash[0].checked
        @optionApp[0].checked = false
        @optionCash[0].checked = true
      else
        @optionApp[0].checked = true          
        @optionCash[0].checked = false

    
  doCharge: (event) =>
    if @valideAmount(@amount[0].value)
      @button_charge[0].disabled = true
      lat = Lungo.Cache.get "latitude"
      long = Lungo.Cache.get "longitude"
      currentLocation = new google.maps.LatLng(lat, long)
      @getStreet(currentLocation)



  travelCompleted: =>
    driver = Lungo.Cache.get "driver"
    travel = Lungo.Cache.get "travel"
    latitude = Lungo.Cache.get "latitude"
    longitude = Lungo.Cache.get "longitude"
    destination = Lungo.Cache.get "destination"
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/travelcompleted"
      data:
        travelID: travel.travelID
        email: driver.email
        destination: destination
        latitude: latitude
        longitude: longitude
        appPayment: @optionApp[0].checked
        cost: @amount[0].value
      success: (result) =>
        @amount[0].value = ""
        @li_vote[0].style.display = "block"
        @fieldset_vote[0].style.display = "block"
      error: (xhr, type) =>
        navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"
        Lungo.Router.section "charge_s"



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
      travelID: travel.travelID
      vote: vote
    $$.ajax
      type: "POST"
      url: server + "driver/votecustomer"
      data: data
      success: (result) =>
        navigator.notification.alert "Cliente valorado", null, "Taxi Express", "Aceptar"
        Lungo.Router.section "waiting_s"
        Lungo.Cache.remove "requestInProgress"  
        Lungo.Cache.set "requestInProgress", false
      error: (xhr, type) =>
        console.log type.response
        navigator.notification.alert "Error al valorar al cliente", null, "Taxi Express", "Aceptar"
        Lungo.Router.section "waiting_s"
        Lungo.Cache.remove "requestInProgress"  
        Lungo.Cache.set "requestInProgress", false


  getStreet: (pos) =>
    geocoder = new google.maps.Geocoder()
    geocoder.geocode
      latLng: pos
    , (results, status) =>
      if status is google.maps.GeocoderStatus.OK
        if results[1]
          if results[0].address_components[1].short_name == results[0].address_components[0].short_name
            Lungo.Cache.remove "destination"
            Lungo.Cache.set "destination", results[0].address_components[1].short_name
            @travelCompleted()
          else 
            Lungo.Cache.remove "destination"
            Lungo.Cache.set "destination", results[0].address_components[1].short_name + ", " +results[0].address_components[0].short_name
            @travelCompleted()
        else
          console.log "falla"
          @getStreet pos
      else
        console.log "falla"
        @getStreet pos

  