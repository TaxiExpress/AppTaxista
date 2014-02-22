class __Controller.ChargeCtrl extends Monocle.Controller

	elements:
    "#charge_amount"                 : "amount"
    "#charge_cash"                   : "optionCash"
    "#charge_app_fieldset"           : "fieldset_charge_app"
    "#charge_app"                    : "optionApp"
    "#charge_charge"                 : "button_charge"

  events:
    "change #charge_amount"          : "addEuros"
    "tap #charge_amount"             : "cleanAmount"
    "tap #charge_charge"             : "doCharge"
    "change #charge_app"             : "changeApp"
    "change #charge_cash"            : "changeCash"

  constructor: ->
    super
    @amountToSend = 0
    driver = Lungo.Cache.get "driver"
    @optionApp[0].checked = driver.appPayment
    if !driver.appPayment
      @optionCash[0].checked = !driver.appPayment
      @optionCash[0].disabled = !driver.appPayment
      @fieldset_charge_app[0].style.display = "none"


  initialize: =>
    @amountToSend = 0
    Lungo.Router.section "charge_s"
    @amount[0].value = ""
    @button_charge[0].disabled = false


  cleanAmount: =>
    @amount[0].value = ""
    @amountToSend = ""


  addEuros: =>
    if @amount[0].value
      @amountToSend = @amount[0].value
      @amount[0].value = @amount[0].value + " €"


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
    @button_charge[0].focus()
    driver = Lungo.Cache.get "driver"
    if driver.appPayment
      if @optionCash[0].checked
        @optionApp[0].checked = false
        @optionCash[0].checked = true
      else
        @optionApp[0].checked = true          
        @optionCash[0].checked = false

    
  doCharge: (event) =>
    if !@button_charge[0].disabled
      if @valideAmount(@amountToSend)
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
        cost: @amountToSend
      success: (result) =>
        @showVote()
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
    else if amount < 0
      navigator.notification.alert "El importe debe ser un número positivo", null, "Taxi Express", "Aceptar"
      return false
    else
      amount += "."  if amount.indexOf(".") is -1
      dectext = amount.substring(amount.indexOf(".") + 1, amount.length)
      if dectext.length > decallowed
        navigator.notification.alert "El importe debe tener " + decallowed + " decimales.", null, "Taxi Express", "Aceptar"
        return false
      else
        return true


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
          @getStreet pos
      else
        @getStreet pos

  
  # VOTE #

  showVote: =>
    onConfirm = (button) =>
      switch button
        when 1
          @vote "negative"
        when 2
          @vote "positive"
      return
    navigator.notification.confirm "¿Cómo valora al cliente que acaba de contratar sus servicios?", onConfirm, "Valoración cliente", "Mal, Bien"


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
        navigator.notification.alert "Trayecto finalizado. Gracias por usar TaxiExpress", null, "Taxi Express", "Aceptar"
        Lungo.Router.section "waiting_s"
        Lungo.Cache.remove "requestInProgress"  
        Lungo.Cache.set "requestInProgress", false
      error: (xhr, type) =>
        console.log type.response
        navigator.notification.alert "Error al valorar al cliente", null, "Taxi Express", "Aceptar"
        Lungo.Router.section "waiting_s"
        Lungo.Cache.remove "requestInProgress"  
        Lungo.Cache.set "requestInProgress", false

