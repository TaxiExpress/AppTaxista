class __Controller.LoginCtrl extends Monocle.Controller

  db = undefined
  credentials = undefined
      
  elements:
    "#login_username"                              : "username"
    "#login_password"                              : "password"

  events:
    "tap #login_login_b"                           : "doLogin"

  constructor: ->
    super
    @db = window.openDatabase "TaxiExpressDriver", "1.0", "description", 2 * 1024 * 1024
    @db.transaction (tx) =>
      tx.executeSql "CREATE TABLE IF NOT EXISTS accessDataDriver (email STRING NOT NULL PRIMARY KEY, pass STRING NOT NULL)"
    @read()

  doLogin: (event) =>
    if @username[0].value && @password[0].value
      @drop()
      @valideCredentials @username[0].value, @password[0].value
    else
      navigator.notification.alert "Debe rellenar el email y la contraseña", null, "Taxi Express", "Aceptar"

  valideCredentials: (email, pass)=>
    pushID = Lungo.Cache.get "pushID"
    if pushID == undefined
      setTimeout((=> 
        pushID = Lungo.Cache.get "pushID"
        @valideCredentials email, pass
      ) , 500)
    else
      device = Lungo.Cache.get "pushDevice"
      server = Lungo.Cache.get "server"
      data = 
        email: email
        password: pass
        pushID: pushID
        pushDevice: device

      server = Lungo.Cache.get "server"
      $$.ajax
        type: "POST"
        url: server + "driver/login"
        data:  data
        success: (result) =>
          @parseResponse result
        error: (xhr, type) =>
          setTimeout((=>Lungo.Router.section "login_s") , 500)
          @password[0].value = ""
          navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"

  parseResponse: (result) ->
    if @username[0].value == ""
      email = credentials.email
      pass = credentials.pass
    else
      email = @username[0].value
      pass = @password[0].value

    @db.transaction (tx) =>
      sql = "INSERT INTO accessDataDriver (email, pass) VALUES ('"+email+"','"+pass+"');"
      tx.executeSql sql
    driver =
      email: email
      first_name: result.first_name
      last_name: result.last_name
      appPayment: result.appPayment

    Lungo.Cache.set "driver", driver    
    __Controller.confirmation = new __Controller.ConfirmationCtrl "section#confirmation_s"
    __Controller.valuation = new __Controller.ValuationCtrl "section#valuation_s"
    __Controller.charge = new __Controller.ChargeCtrl "section#charge_s"
    __Controller.arrive = new __Controller.ArriveCtrl "section#arrive_s"
    __Controller.waiting = new __Controller.WaitingCtrl "section#waiting_s"
    __Controller.waiting.getLocationUpdate()
    Lungo.Router.section "waiting_s"

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