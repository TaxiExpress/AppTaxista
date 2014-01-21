(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.AppCtrl = (function(_super) {
    __extends(AppCtrl, _super);

    function AppCtrl() {
      AppCtrl.__super__.constructor.apply(this, arguments);
      Lungo.Cache.set("phone", "669338946");
      Lungo.Cache.set("server", "http://TaxiLoadBalancer-638315338.us-east-1.elb.amazonaws.com/");
      __Controller.login = new __Controller.LoginCtrl("section#login_s");
    }

    return AppCtrl;

  })(Monocle.Controller);

  $$(function() {
    Lungo.init({});
    return __Controller.App = new __Controller.AppCtrl("section#init_s");
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ArriveCtrl = (function(_super) {
    var initialize, manageErrors, map, street,
      _this = this;

    __extends(ArriveCtrl, _super);

    map = void 0;

    street = "Aldapabarrena kalea";

    ArriveCtrl.prototype.elements = {
      "#arrive_streetField": "streetField"
    };

    ArriveCtrl.prototype.events = {
      "tap #arrive_pickup": "doPickUp",
      "tap #arrive_cancel": "cancelPickUp",
      "tap #arrive_call": "doCall"
    };

    function ArriveCtrl() {
      this.doCall = __bind(this.doCall, this);
      this.cancelPickUp = __bind(this.cancelPickUp, this);
      this.doPickUp = __bind(this.doPickUp, this);
      var options;
      ArriveCtrl.__super__.constructor.apply(this, arguments);
      this.streetField[0].value = street;
      if (navigator.geolocation) {
        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(initialize, manageErrors);
      }
    }

    manageErrors = function(err) {
      var _this = this;
      alert("Error de localización GPS");
      return setTimeout((function() {
        return navigator.geolocation.getCurrentPosition(initialize, manageErrors);
      }), 5000);
    };

    initialize = function(location) {
      var currentLocation, mapOptions, marker;
      if (map === void 0) {
        currentLocation = new google.maps.LatLng(43.3256502, -2.990092699999991);
        mapOptions = {
          center: currentLocation,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: false,
          streetViewControl: false,
          overviewMapControl: false,
          mapTypeControl: false,
          zoomControl: false,
          styles: [
            {
              featureType: "poi.business",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            }
          ]
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        return marker = new google.maps.Marker({
          position: currentLocation,
          map: map,
          title: street
        });
      }
    };

    ArriveCtrl.prototype.doPickUp = function(event) {
      __Controller.charge = new __Controller.ChargeCtrl("section#charge_s");
      return Lungo.Router.section("charge_s");
    };

    ArriveCtrl.prototype.cancelPickUp = function(event) {
      return Lungo.Router.section("waiting_s");
    };

    ArriveCtrl.prototype.doCall = function(event) {
      alert("llamando");
      return document.getElementById("fdw").onclick();
    };

    return ArriveCtrl;

  }).call(this, Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ChargeCtrl = (function(_super) {
    __extends(ChargeCtrl, _super);

    ChargeCtrl.prototype.elements = {
      "#charge_amount": "amount"
    };

    ChargeCtrl.prototype.events = {
      "tap #charge_charge": "doCharge"
    };

    function ChargeCtrl() {
      this.valideAmount = __bind(this.valideAmount, this);
      this.doCharge = __bind(this.doCharge, this);
      ChargeCtrl.__super__.constructor.apply(this, arguments);
    }

    ChargeCtrl.prototype.doCharge = function(event) {
      var correcto;
      correcto = this.valideAmount(this.amount[0].value);
      if (correcto) {
        return Lungo.Router.section("waiting_s");
      }
    };

    ChargeCtrl.prototype.valideAmount = function(amount) {
      var decallowed, dectext;
      decallowed = 2;
      if (isNaN(amount)) {
        alert("El importe introducido no es correcto.");
        return false;
      } else if (amount === "") {
        alert("El importe no puede estar vacío");
        return false;
      } else {
        if (amount.indexOf(".") === -1) {
          amount += ".";
        }
        dectext = amount.substring(amount.indexOf(".") + 1, amount.length);
        if (dectext.length > decallowed) {
          alert("Por favor, entra un número con " + decallowed + " números decimales.");
          return false;
        } else {
          return true;
        }
      }
    };

    return ChargeCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ConfirmationCtrl = (function(_super) {
    var timer;

    __extends(ConfirmationCtrl, _super);

    timer = null;

    ConfirmationCtrl.prototype.events = {
      "tap #confirmation_accept": "acceptConfirmation",
      "tap #confirmation_reject": "rejectConfirmation"
    };

    function ConfirmationCtrl() {
      this.stopTimer = __bind(this.stopTimer, this);
      this.rejectConfirmation = __bind(this.rejectConfirmation, this);
      this.acceptConfirmation = __bind(this.acceptConfirmation, this);
      var _this = this;
      ConfirmationCtrl.__super__.constructor.apply(this, arguments);
      timer = setTimeout((function() {
        return Lungo.Router.section("waiting_s");
      }), 5000);
    }

    ConfirmationCtrl.prototype.acceptConfirmation = function(event) {
      this.stopTimer();
      __Controller.arrive = new __Controller.ArriveCtrl("section#arrive_s");
      return Lungo.Router.section("arrive_s");
    };

    ConfirmationCtrl.prototype.rejectConfirmation = function(event) {
      this.stopTimer();
      return Lungo.Router.section("waiting_s");
    };

    ConfirmationCtrl.prototype.stopTimer = function() {
      return clearTimeout(timer);
    };

    return ConfirmationCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.LoginCtrl = (function(_super) {
    var credentials, db, initialize, latitude, longitude, manageErrors, map,
      _this = this;

    __extends(LoginCtrl, _super);

    db = void 0;

    credentials = void 0;

    map = void 0;

    latitude = 43.3256502;

    longitude = -2.990092699999991;

    LoginCtrl.prototype.elements = {
      "#login_username": "username",
      "#login_password": "password"
    };

    LoginCtrl.prototype.events = {
      "tap #login_login_b": "doLogin",
      "tap #location": "doLocation"
    };

    function LoginCtrl() {
      this.doLocation = __bind(this.doLocation, this);
      this.read = __bind(this.read, this);
      this.drop = __bind(this.drop, this);
      this.updatePosition = __bind(this.updatePosition, this);
      this.currentPosition = __bind(this.currentPosition, this);
      this.checkPosition = __bind(this.checkPosition, this);
      this.valideCredentials = __bind(this.valideCredentials, this);
      this.doLogin = __bind(this.doLogin, this);
      var _this = this;
      LoginCtrl.__super__.constructor.apply(this, arguments);
      this.db = window.openDatabase("TaxiExpressDriver", "1.0", "description", 2 * 1024 * 1024);
      this.db.transaction(function(tx) {
        return tx.executeSql("CREATE TABLE IF NOT EXISTS accessDataDriver (email STRING NOT NULL PRIMARY KEY, pass STRING NOT NULL)");
      });
      this.read();
    }

    LoginCtrl.prototype.doLogin = function(event) {
      var date;
      if (this.username[0].value && this.password[0].value) {
        this.drop();
        date = new Date("1/1/1970").toISOString().substring(0, 19);
        date = date.replace("T", " ");
        return this.valideCredentials(this.username[0].value, this.password[0].value, date);
      } else {
        return alert("Debe rellenar el email y la contraseña");
      }
    };

    LoginCtrl.prototype.valideCredentials = function(email, pass) {
      var server,
        _this = this;
      alert("valideCredentials");
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/login",
        data: {
          email: email,
          password: pass
        },
        success: function(result) {
          return _this.parseResponse(result);
        },
        error: function(xhr, type) {
          setTimeout((function() {
            return Lungo.Router.section("login_s");
          }), 500);
          _this.password[0].value = "";
          return alert(type.response);
        }
      });
    };

    LoginCtrl.prototype.parseResponse = function(result) {
      var driver,
        _this = this;
      this.db.transaction(function(tx) {
        var sql;
        sql = "INSERT INTO accessDataDriver (email, pass) VALUES ('" + _this.username[0].value + "','" + _this.password[0].value + "');";
        return tx.executeSql(sql);
      });
      Lungo.Cache.set("logged", true);
      driver = new Object();
      driver.nombre = "Fermin";
      driver.apellidos = "Querejeta Mendo";
      driver.getDriver = function() {
        return this.apellidos + ", " + this.nombre;
      };
      Lungo.Cache.set("driver", driver);
      __Controller.waiting = new __Controller.WaitingCtrl("section#waiting_s");
      return Lungo.Router.section("waiting_s");
    };

    LoginCtrl.prototype.checkPosition = function() {
      var timer,
        _this = this;
      return timer = setTimeout((function() {
        return _this.currentPosition();
      }), 5000);
    };

    LoginCtrl.prototype.currentPosition = function() {
      var options;
      if (navigator.geolocation) {
        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(initialize, manageErrors);
      }
      return this.checkPosition();
    };

    initialize = function(location) {
      alert("Latitude location: " + location.coords.latitude);
      alert("Longitude location: " + location.coords.longitude);
      alert("latitudeCache: " + latitudeCache);
      alert("longitudeCache: " + longitudeCache);
      return LoginCtrl.updatePosition("conductor@gmail.com", location.coords.latitude, location.coords.longitude);
    };

    manageErrors = function(err) {
      var _this = this;
      console.log("Error de localización GPS");
      return setTimeout((function() {
        return navigator.geolocation.getCurrentPosition(initialize, manageErrors);
      }), 5000);
    };

    LoginCtrl.prototype.updatePosition = function(email, latitude, longitude) {
      var server,
        _this = this;
      alert("update position");
      server = Lungo.Cache.get("server");
      alert(server);
      $$.ajax({
        type: "POST",
        url: server + "driver/updateDriverPosition",
        data: {
          email: "conductor@gmail.com",
          latitude: 43.3256503,
          longitude: -2.990092699999933
        }
      });
      return {
        success: function(result) {
          return {
            error: function(xhr, type) {
              return alert(type.response);
            }
          };
        }
      };
    };

    LoginCtrl.prototype.drop = function() {
      var _this = this;
      return this.db.transaction(function(tx) {
        return tx.executeSql("DELETE FROM accessDataDriver");
      });
    };

    LoginCtrl.prototype.read = function() {
      var _this = this;
      return this.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM accessDataDriver", [], (function(tx, results) {
          if (results.rows.length > 0) {
            credentials = results.rows.item(0);
            return _this.valideCredentials(credentials.email, credentials.pass);
          } else {
            return Lungo.Router.section("login_s");
          }
        }), null);
      });
    };

    LoginCtrl.prototype.doLocation = function() {
      return this.updatePosition("conductor@gmail.com", 43.3256503, -2.990092699999933);
    };

    return LoginCtrl;

  }).call(this, Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.WaitingCtrl = (function(_super) {
    var errorHandler, showLocation, timer;

    __extends(WaitingCtrl, _super);

    timer = null;

    WaitingCtrl.prototype.events = {
      "tap #waiting_logout": "logOut",
      "tap #waiting_confirmation": "goConfirmation",
      "tap #waiting_prueba1": "doLocation",
      "tap #waiting_prueba2": "doAvailable"
    };

    WaitingCtrl.prototype.elements = {
      "#waiting_driver": "driver"
    };

    function WaitingCtrl() {
      this.doAvailable = __bind(this.doAvailable, this);
      this.updatePosition = __bind(this.updatePosition, this);
      this.doLocation = __bind(this.doLocation, this);
      this.goConfirmation = __bind(this.goConfirmation, this);
      this.logOut = __bind(this.logOut, this);
      var driver;
      WaitingCtrl.__super__.constructor.apply(this, arguments);
      alert("waiting");
      driver = Lungo.Cache.get("driver");
      this.driver[0].innerText = driver.apellidos + ", " + driver.nombre;
      console.log(driver.nombre);
    }

    WaitingCtrl.prototype.logOut = function() {
      alert("logout");
      Lungo.Cache.set("nombre", "");
      Lungo.Cache.set("apellidos", "");
      return Lungo.Router.section("login_s");
    };

    WaitingCtrl.prototype.goConfirmation = function() {
      __Controller.confirmation = new __Controller.ConfirmationCtrl("section#confirmation_s");
      return Lungo.Router.section("confirmation_s");
    };

    WaitingCtrl.prototype.doLocation = function() {
      return this.getLocationUpdate();
    };

    WaitingCtrl.prototype.getLocationUpdate = function() {
      var geoLoc, options, watchID;
      if (navigator.geolocation) {
        options = {
          timeout: 60000
        };
        geoLoc = navigator.geolocation;
        return watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
      } else {
        return alert("Sorry, browser does not support geolocation!");
      }
    };

    showLocation = function(position) {
      var latitude, longitude;
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      alert("Latitude : " + latitude + " Longitude: " + longitude);
      return this.updatePosition("conductor@gmail.com", latitude, longitude);
    };

    errorHandler = function(err) {
      if (err.code === 1) {
        return alert("Error: Access is denied!");
      } else {
        if (err.code === 2) {
          return alert("Error: Position is unavailable!");
        }
      }
    };

    WaitingCtrl.prototype.updatePosition = function(email, latitude, longitude) {
      var server,
        _this = this;
      alert("update position");
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/updateDriverPosition",
        data: {
          email: email,
          latitude: latitude,
          longitude: longitude
        },
        success: function(result) {},
        error: function(xhr, type) {
          return alert(type.response);
        }
      });
    };

    WaitingCtrl.prototype.doAvailable = function() {
      var server,
        _this = this;
      alert("Available");
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/updateDriverAvailable",
        data: {
          email: "conductor@gmail.com",
          available: true
        },
        success: function(result) {},
        error: function(xhr, type) {
          return alert(type.response);
        }
      });
    };

    return WaitingCtrl;

  })(Monocle.Controller);

}).call(this);
