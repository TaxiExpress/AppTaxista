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
      @drop()
      date = new Date("1/1/1970").toISOString().substring 0, 19
      date = date.replace "T", " "
      @valideCredentials(@username[0].value, @password[0].value, date)
    else
      alert "Debe rellenar el email y la contraseña"

  valideCredentials: (email, pass)=>
    pushID = Lungo.Cache.get "pushID"
    
    if pushID == undefined
      setTimeout((=> 
        pushID = Lungo.Cache.get "pushID"
        @valideCredentials email, pass, pushID
      ) , 500)
    else
      server = Lungo.Cache.get "server"

      $$.ajax
        type: "POST"
        url: server + "driver/login"
        data:
          email: email
          password: pass
          pushID: pushID
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
       
    unless @username[0].value is ""
      email = @username[0].value
    else
      email = credentials.email

    driver = new Object()
    driver.email = email
    driver.first_name = result.first_name
    driver.last_name = result.last_name
    Lungo.Cache.set "driver", driver
    
    __Controller.confirmation = new __Controller.ConfirmationCtrl "section#confirmation_s"
    __Controller.waiting = new __Controller.WaitingCtrl "section#waiting_s"
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

    

