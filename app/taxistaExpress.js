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
    __Controller.push = new __Controller.PushCtrl;
    return __Controller.App = new __Controller.AppCtrl("section#init_s");
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ArriveCtrl = (function(_super) {
    var getStreet, iniLocation, initialize, manageErrors, map,
      _this = this;

    __extends(ArriveCtrl, _super);

    map = void 0;

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
      var options, travel;
      ArriveCtrl.__super__.constructor.apply(this, arguments);
      travel = Lungo.Cache.get("travel");
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
      var arriveLocation, mapOptions, marker;
      if (map === void 0) {
        arriveLocation = new google.maps.LatLng(travel.latitude, travel.longitude);
        mapOptions = {
          center: arriveLocation,
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
          position: arriveLocation,
          map: map,
          title: street
        });
      }
    };

    iniLocation = function(location) {
      var currentLocation;
      currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
      travel.latitude = location.latitude;
      travel.longitude = location.longitude;
      return travel.newOrigin = ArriveCtrl.getStreet(currentLocation);
    };

    ArriveCtrl.prototype.doPickUp = function(event) {
      var driver, options, push, server,
        _this = this;
      if (navigator.geolocation) {
        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(iniLocation, manageErrors);
      }
      driver = Lungo.Cache.get("driver");
      push = Lungo.Cache.get("push");
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/travelstarted",
        data: {
          email: driver.email,
          travelID: push.travelID,
          origin: travel.newOrigin,
          latitude: travel.latitude,
          longitude: travel.longitude
        },
        success: function(result) {
          __Controller.charge = new __Controller.ChargeCtrl("section#charge_s");
          return Lungo.Router.section("charge_s");
        },
        error: function(xhr, type) {
          return alert(type.response);
        }
      });
    };

    ArriveCtrl.prototype.cancelPickUp = function(event) {
      return Lungo.Router.section("waiting_s");
    };

    ArriveCtrl.prototype.doCall = function(event) {
      alert("llamando");
      return document.getElementById("fdw").onclick();
    };

    getStreet = function(pos) {
      var geocoder;
      geocoder = new google.maps.Geocoder();
      return geocoder.geocode({
        latLng: pos
      }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            if (results[0].address_components[1].short_name === results[0].address_components[0].short_name) {
              return results[0].address_components[1].short_name;
            } else {
              return results[0].address_components[1].short_name + ", " + results[0].address_components[0].short_name;
            }
          } else {
            return 'Calle desconocida';
          }
        } else {
          return 'Calle desconocida';
        }
      });
    };

    return ArriveCtrl;

  }).call(this, Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ChargeCtrl = (function(_super) {
    var iniLocation, manageErrors,
      _this = this;

    __extends(ChargeCtrl, _super);

    ChargeCtrl.prototype.elements = {
      "#charge_amount": "amount",
      "#option_cash": "valorCash",
      "#option_card": "valorCard"
    };

    ChargeCtrl.prototype.events = {
      "tap #charge_charge": "doCharge"
    };

    function ChargeCtrl() {
      this.valideAmount = __bind(this.valideAmount, this);
      this.doCharge = __bind(this.doCharge, this);
      ChargeCtrl.__super__.constructor.apply(this, arguments);
    }

    iniLocation = function(location) {
      var currentLocation;
      currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
      travel.latitude = location.latitude;
      travel.longitude = location.longitude;
      return travel.destination = ChargeCtrl.getStreet(currentLocation);
    };

    manageErrors = function() {
      return console.log("ERROR");
    };

    ChargeCtrl.prototype.doCharge = function(event) {
      var correcto, driver, options, server, travel,
        _this = this;
      correcto = this.valideAmount(this.amount[0].value);
      if (correcto) {
        travel = Lungo.Cache.get("travel");
        if (navigator.geolocation) {
          options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
          navigator.geolocation.getCurrentPosition(iniLocation, manageErrors);
        }
        driver = Lungo.Cache.get("driver");
        server = Lungo.Cache.get("server");
        $$.ajax({
          type: "POST",
          url: server + "driver/travelcompleted",
          data: {
            travelID: travel.id,
            email: driver.email,
            destination: travel.destination,
            latitude: travel.latitude,
            longitude: travel.longitude,
            appPayment: this.valorCard[0].checked,
            cost: this.amount[0].value
          },
          success: function(result) {
            return Lungo.Router.section("waiting_s");
          },
          error: function(xhr, type) {
            return alert(type.response);
          }
        });
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

  }).call(this, Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ConfirmationCtrl = (function(_super) {
    var timer, travel;

    __extends(ConfirmationCtrl, _super);

    timer = null;

    travel = null;

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
      travel = Lungo.Cache.get("travel");
    }

    ConfirmationCtrl.prototype.acceptConfirmation = function(event) {
      var driver, server,
        _this = this;
      driver = Lungo.Cache.get("driver");
      server = Lungo.Cache.get("server");
      $$.ajax({
        type: "POST",
        url: server + "driver/accepttravel",
        data: {
          email: driver.email,
          travelID: travel.id,
          latitude: travel.latitude,
          longitude: travel.longitude
        },
        success: function(result) {
          __Controller.arrive = new __Controller.ArriveCtrl("section#arrive_s");
          return Lungo.Router.section("arrive_s");
        },
        error: function(xhr, type) {
          return alert(type.response);
        }
      });
      return this.stopTimer();
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
      var pushID, server,
        _this = this;
      pushID = Lungo.Cache.get("pushID");
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/login",
        data: {
          email: email,
          password: pass,
          pushID: pushID
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
      __Controller.confirmation = new __Controller.ConfirmationCtrl("section#confirmation_s");
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

  __Controller.PushCtrl = (function(_super) {
    var pushNotification;

    __extends(PushCtrl, _super);

    pushNotification = void 0;

    function PushCtrl() {
      this.handlePush = __bind(this.handlePush, this);
      this.savePushID = __bind(this.savePushID, this);
      PushCtrl.__super__.constructor.apply(this, arguments);
    }

    PushCtrl.prototype.savePushID = function(id) {
      return Lungo.Cache.set("pushID", id);
    };

    PushCtrl.prototype.handlePush = function(notification) {
      var coords, lat, long, pos, travel;
      switch (notification.code) {
        case "801":
        case "802":
          travel = new Object();
          travel.id = notification.travelID;
          travel.origin = notification.origin;
          travel.startpoint = notification.startpoint;
          coords = travel.startpoint.substring(7);
          pos = coords.indexOf(" ");
          long = coords.substring(0, pos);
          lat = coords.substring(pos + 1, coords.indexOf(")"));
          travel.latitude = lat;
          travel.longitude = long;
          travel.valuation = notification.valuation;
          travel.phone = notification.phone;
          Lungo.Cache.set("travel", travel);
          Lungo.Router.section("confirmation_s");
          return navigator.notification.alert("El taxista ha aceptado su solicitud", null, "Taxi Express", "Aceptar");
        case "803":
          Lungo.Router.section("waiting_s");
          return navigator.notification.alert("El pago se ha realizado correctamente", null, "Taxi Express", "Aceptar");
      }
    };

    return PushCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.WaitingCtrl = (function(_super) {
    var disponible, driver, manageError, timer, updatePosition, watchId,
      _this = this;

    __extends(WaitingCtrl, _super);

    timer = null;

    driver = null;

    disponible = true;

    watchId = void 0;

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
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = void 0;
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
      var options, tt;
      if (navigator.geolocation) {
        options = {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 3000
        };
        tt = navigator.geolocation.watchPosition(updatePosition, manageError, options);
        return this.watchId = tt;
      }
    };

    WaitingCtrl.prototype.stopWatch = function() {
      if (this.watchId) {
        navigator.geolocation.clearWatch(this.watchId);
        return this.watchId = void 0;
      }
    };

    updatePosition = function(position) {
      var server;
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
          return WaitingCtrl;
        },
        error: function(xhr, type) {
          return WaitingCtrl;
        }
      });
    };

    manageError = function() {
      return console.log("ERROR");
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

  }).call(this, Monocle.Controller);

}).call(this);
