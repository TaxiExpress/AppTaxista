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
        currentLocation = new google.maps.LatLng(43.32197354474697, -2.9898569638094625);
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
    var push, timer;

    __extends(ConfirmationCtrl, _super);

    timer = null;

    push = null;

    ConfirmationCtrl.prototype.elements = {
      "#confirmation_streetField": "streetField"
    };

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
      push = new Object();
      push.origin = "Gran Via";
      push.latitude = 43.32197354474697;
      push.longitude = -2.9898569638094625;
      push.travelID = 1;
      push.valoracion = 4;
      push.telephone = 666778899;
      this.streetField[0].value = push.origin;
      Lungo.Cache.set("push", push);
    }

    ConfirmationCtrl.prototype.acceptConfirmation = function(event) {
      var driver;
      this.stopTimer();
      driver = Lungo.Cache.get("driver");
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
    var credentials, db;

    __extends(LoginCtrl, _super);

    db = void 0;

    credentials = void 0;

    LoginCtrl.prototype.elements = {
      "#login_username": "username",
      "#login_password": "password"
    };

    LoginCtrl.prototype.events = {
      "tap #login_login_b": "doLogin"
    };

    function LoginCtrl() {
      this.read = __bind(this.read, this);
      this.drop = __bind(this.drop, this);
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
      var driver, email,
        _this = this;
      this.db.transaction(function(tx) {
        var sql;
        sql = "INSERT INTO accessDataDriver (email, pass) VALUES ('" + _this.username[0].value + "','" + _this.password[0].value + "');";
        return tx.executeSql(sql);
      });
      if (this.username[0].value !== "") {
        email = this.username[0].value;
      } else {
        email = credentials.email;
      }
      driver = new Object();
      driver.email = email;
      driver.first_name = result.first_name;
      driver.last_name = result.last_name;
      Lungo.Cache.set("driver", driver);
      __Controller.waiting = new __Controller.WaitingCtrl("section#waiting_s");
      return Lungo.Router.section("waiting_s");
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

    return LoginCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.WaitingCtrl = (function(_super) {
    var disponible, driver, timer, updatePosition, watchId;

    __extends(WaitingCtrl, _super);

    timer = null;

    driver = null;

    disponible = true;

    WaitingCtrl.prototype.events = {
      "tap #waiting_logout": "logOut",
      "tap #waiting_confirmation": "goConfirmation",
      "tap #waiting_prueba1": "doLocation",
      "change #waiting_available": "changeAvailable"
    };

    WaitingCtrl.prototype.elements = {
      "#waiting_driver": "driver",
      "#waiting_available": "valorAvailable"
    };

    function WaitingCtrl() {
      this.changeAvailable = __bind(this.changeAvailable, this);
      this.updateAvailable = __bind(this.updateAvailable, this);
      this.stopWatch = __bind(this.stopWatch, this);
      this.getLocationUpdate = __bind(this.getLocationUpdate, this);
      this.doLocation = __bind(this.doLocation, this);
      this.goConfirmation = __bind(this.goConfirmation, this);
      this.logOut = __bind(this.logOut, this);
      WaitingCtrl.__super__.constructor.apply(this, arguments);
      driver = Lungo.Cache.get("driver");
      this.driver[0].innerText = driver.last_name + ", " + driver.first_name;
    }

    WaitingCtrl.prototype.logOut = function() {
      var watchId;
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      Lungo.Cache.set("driver", "");
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
      var options, watchID;
      if (navigator.geolocation) {
        options = {
          enableHighAccuracy: true,
          timeout: 27000,
          maximumAge: 30000
        };
        return watchID = navigator.geolocation.watchPosition(updatePosition, null, options);
      }
    };

    WaitingCtrl.prototype.stopWatch = function() {};

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }

    updatePosition = function(position) {
      var server,
        _this = this;
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/updatedriverposition",
        data: {
          email: driver.email,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        success: function(result) {
          return _this;
        },
        error: function(xhr, type) {
          return _this;
        }
      });
    };

    WaitingCtrl.prototype.updateAvailable = function(email, available) {
      var server,
        _this = this;
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/updatedriveravailable",
        data: {
          email: email,
          available: available
        },
        success: function(result) {},
        error: function(xhr, type) {
          return alert(type.response);
        }
      });
    };

    WaitingCtrl.prototype.changeAvailable = function() {
      this.updateAvailable(driver.email, this.valorAvailable[0].checked);
      if (this.valorAvailable[0].checked) {
        return this.getLocationUpdate();
      } else {
        return this.stopWatch();
      }
    };

    return WaitingCtrl;

  })(Monocle.Controller);

}).call(this);
