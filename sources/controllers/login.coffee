class __Controller.LoginCtrl extends Monocle.Controller

  db = undefined
  credentials = undefined
  map = undefined
  latitude = 43.3256502 
  longitude = -2.990092699999991
      
  elements:
    "#login_username"                              : "username"
    "#login_password"                              : "password"

  events:
    "tap #login_login_b"                           : "doLogin"
    "tap #location"                                : "doLocation"

  constructor: ->
    super
    @db = window.openDatabase("TaxiExpressDriver", "1.0", "description", 2 * 1024 * 1024) #2MB
    @db.transaction (tx) =>
      tx.executeSql "CREATE TABLE IF NOT EXISTS accessDataDriver (email STRING NOT NULL PRIMARY KEY, pass STRING NOT NULL)"
    @read()

  doLogin: (event) =>
    if (@username[0].value && @password[0].value)
      #Lungo.Router.section "init_s"
      @drop()
      date = new Date("1/1/1970").toISOString().substring 0, 19
      date = date.replace "T", " "
      @valideCredentials(@username[0].value, @password[0].value, date)
          

      # borrarlo cuando active las credenciales
      #__Controller.waiting = new __Controller.WaitingCtrl "section#waiting_s"
      #Lungo.Router.section "waiting_s"
      #@db.transaction (tx) =>
      #  sql = "INSERT INTO accessDataDriver (email, pass) VALUES ('"+@username[0].value+"','"+@password[0].value+"');"
      #  tx.executeSql sql

      #__Controller.confirmation = new __Controller.ConfirmationCtrl "section#confirmation_s"
      #Lungo.Router.section "confirmation_s"
      #Lungo.Cache.set "logged", true
      #Lungo.Cache.set "nombre", "Fermin"
      #Lungo.Cache.set "apellidos", "Querejeta Mendo"
      #@checkPosition()
      #@updatePosition(@username[0].value, 43.3256502, -2.990092699999991)
      # borrar hasta aquí
    else
      alert "Debe rellenar el email y la contraseña"

  valideCredentials: (email, pass)=>
    alert "valideCredentials"
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/login"
      data:
        email: email
        password: pass
      success: (result) =>
        @parseResponse result
      error: (xhr, type) =>
        setTimeout((=>Lungo.Router.section "login_s") , 500)
        @password[0].value = ""
        alert type.response        

  parseResponse: (result) ->
    @db.transaction (tx) =>
      sql = "INSERT INTO accessDataDriver (email, pass) VALUES ('"+@username[0].value+"','"+@password[0].value+"');"
      tx.executeSql sql
    Lungo.Cache.set "logged", true
    
    driver = new Object()
    driver.nombre = "Fermin"
    driver.apellidos = "Querejeta Mendo"
    driver.getDriver = ->
      @apellidos + ", " + @nombre

    Lungo.Cache.set "driver", driver
      
    #@checkPosition()
    __Controller.waiting = new __Controller.WaitingCtrl "section#waiting_s"
    Lungo.Router.section "waiting_s"

  checkPosition: =>
    timer = setTimeout((=>@currentPosition()) , 5000)
    
  currentPosition: =>
    if navigator.geolocation
      options =
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      navigator.geolocation.getCurrentPosition initialize, manageErrors
  #  @valideCredentials("","")
    @checkPosition()
  
  initialize = (location) =>
    alert "Latitude location: " + location.coords.latitude
    alert "Longitude location: " + location.coords.longitude
    #latitudeCache = Lungo.Cache.get "latitude"
    #longitudeCache = Lungo.Cache.get "longitude" 
    alert "latitudeCache: " + latitudeCache
    alert "longitudeCache: " + longitudeCache
    #if latitudeCache isnt location.coords.latitude or longitudeCache isnt location.coords.longitude
    #  Lungo.Cache.set "latitude", location.coords.latitude
    #  Lungo.Cache.set "longitude", location.coords.longitude
    #  latitudeCache2 = Lungo.Cache.get "latitude"
    #  longitudeCache2 = Lungo.Cache.get "longitude" 
    #  alert "latitudeCache2: " + latitudeCache2.toString()
    #  alert "longitudeCache2: " + longitudeCache2.toString()
    #  @updatePosition(@username[0].value, location.coords.latitude, location.coords.longitude)
    @updatePosition("conductor@gmail.com", location.coords.latitude, location.coords.longitude)
    

  manageErrors = (err) ->
    #alert "Error de localización GPS"
    console.log "Error de localización GPS"
    setTimeout((=> navigator.geolocation.getCurrentPosition initialize, manageErrors) , 5000)

  updatePosition: (email, latitude, longitude)=>
    alert "update position"
    server = Lungo.Cache.get "server"
    alert server
    $$.ajax
      type: "POST"
      url: server + "driver/updateDriverPosition"
      data:
        email: "conductor@gmail.com"
        latitude: 43.3256503 
        longitude: -2.990092699999933
     success: (result) =>
        #alert "posicion actualizada"
      error: (xhr, type) =>
        alert type.response    

  drop: =>
    @db.transaction (tx) =>
      tx.executeSql "DELETE FROM accessDataDriver"

  read: =>
    @db.transaction (tx) =>
      tx.executeSql "SELECT * FROM accessDataDriver", [], ((tx, results) =>
        if results.rows.length > 0
          credentials = results.rows.item(0)
          @valideCredentials(credentials.email, credentials.pass)
        else
          Lungo.Router.section "login_s"
      ), null

  doLocation: =>
    #@checkPosition()
    @updatePosition("conductor@gmail.com", 43.3256503, -2.990092699999933)

    
  