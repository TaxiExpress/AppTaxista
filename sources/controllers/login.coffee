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
      #@valideCredentials(@username[0].value, @password[0].value, date)
      # borrarlo cuando active las credenciales
      @db.transaction (tx) =>
        sql = "INSERT INTO accessDataDriver (email, pass) VALUES ('"+@username[0].value+"','"+@password[0].value+"');"
        tx.executeSql sql
      alert "doLogin"
      Lungo.Cache.set "login", true
      # borrar hasta aquí
      __Controller.confirmation = new __Controller.ConfirmationCtrl "section#confirmation_s"
      Lungo.Router.section "confirmation_s"
    else
      alert "Debe rellenar el email y la contraseña"

  valideCredentials: (email, pass)=>
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
    Lungo.Cache.set "login", true
    alert "parseResponse"
    __Controller.confirmation = new __Controller.ConfirmationCtrl "section#confirmation_s"
    Lungo.Router.section "confirmation_s"

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