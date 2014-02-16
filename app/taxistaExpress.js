(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.AppCtrl = (function(_super) {
    __extends(AppCtrl, _super);

    function AppCtrl() {
      AppCtrl.__super__.constructor.apply(this, arguments);
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
    var map;

    __extends(ArriveCtrl, _super);

    map = void 0;

    ArriveCtrl.prototype.elements = {
      "#arrive_streetField": "streetField",
      "#arrive_call": "telephone",
      "#arrive_pickup": "button_PickUp",
      "#arrive_cancel": "button_cancel"
    };

    ArriveCtrl.prototype.events = {
      "singleTap #arrive_pickup": "doPickUp",
      "singleTap #arrive_cancel": "cancelPickUp"
    };

    function ArriveCtrl() {
      this.cancelPickUp = __bind(this.cancelPickUp, this);
      this.doPickUp = __bind(this.doPickUp, this);
      this.showMap = __bind(this.showMap, this);
      this.iniArrive = __bind(this.iniArrive, this);
      ArriveCtrl.__super__.constructor.apply(this, arguments);
    }

    ArriveCtrl.prototype.iniArrive = function() {
      var travel;
      travel = Lungo.Cache.get("travel");
      this.streetField[0].value = Lungo.Cache.get("origin");
      this.telephone[0].href = "tel:" + travel.phone;
      Lungo.Router.section("arrive_s");
      travel = Lungo.Cache.get("travel");
      return this.showMap(travel);
    };

    ArriveCtrl.prototype.showMap = function(travel) {
      var bounds, destination, directionsDisplay, directionsService, lat, long, origin, request;
      lat = Lungo.Cache.get("latitude");
      long = Lungo.Cache.get("longitude");
      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();
      map = new google.maps.Map(document.getElementById("map-canvas"), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        mapTypeControl: false,
        zoomControl: false,
        styles: [
          {
            featureType: "all",
            elementType: "labels",
            stylers: [
              {
                visibility: "off"
              }
            ]
          }
        ]
      });
      directionsDisplay.setMap(map);
      bounds = new google.maps.LatLngBounds();
      origin = new google.maps.LatLng(lat, long);
      destination = new google.maps.LatLng(travel.latitude, travel.longitude);
      bounds.extend(origin);
      bounds.extend(destination);
      map.fitBounds(bounds);
      request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };
      return directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          return directionsDisplay.setDirections(response);
        }
      });
    };

    ArriveCtrl.prototype.doPickUp = function(event) {
      var driver, server, travel;
      this.button_PickUp[0].disabled = true;
      this.button_cancel[0].disabled = true;
      driver = Lungo.Cache.get("driver");
      travel = Lungo.Cache.get("travel");
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/travelstarted",
        data: {
          email: driver.email,
          travelID: travel.travelID,
          origin: "",
          latitude: "",
          longitude: ""
        },
        success: (function(_this) {
          return function(result) {
            _this.button_PickUp[0].disabled = false;
            _this.button_cancel[0].disabled = false;
            return __Controller.charge.initialize();
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            _this.button_PickUp[0].disabled = false;
            _this.button_cancel[0].disabled = false;
            return navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
          };
        })(this)
      });
    };

    ArriveCtrl.prototype.cancelPickUp = function(event) {
      var onConfirm;
      this.button_PickUp[0].disabled = true;
      this.button_cancel[0].disabled = true;
      onConfirm = (function(_this) {
        return function(button) {
          var driver, server, travel;
          switch (button) {
            case 1:
              driver = Lungo.Cache.get("driver");
              travel = Lungo.Cache.get("travel");
              server = Lungo.Cache.get("server");
              $$.ajax({
                type: "POST",
                url: server + "driver/canceltravel",
                data: {
                  travelID: travel.travelID,
                  email: driver.email
                },
                success: function(result) {
                  _this.button_PickUp[0].disabled = false;
                  _this.button_cancel[0].disabled = false;
                  Lungo.Router.section("waiting_s");
                  Lungo.Cache.remove("requestInProgress");
                  return Lungo.Cache.set("requestInProgress", false);
                },
                error: function(xhr, type) {
                  _this.button_PickUp[0].disabled = false;
                  _this.button_cancel[0].disabled = false;
                  return navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
                }
              });
              break;
            case 2:
              _this.button_PickUp[0].disabled = false;
              _this.button_cancel[0].disabled = false;
          }
        };
      })(this);
      return navigator.notification.confirm("", onConfirm, "¿Esta seguro que desea cancelar el viaje?", "Si, No");
    };

    return ArriveCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ChargeCtrl = (function(_super) {
    __extends(ChargeCtrl, _super);

    ChargeCtrl.prototype.elements = {
      "#charge_amount": "amount",
      "#charge_cash": "optionCash",
      "#charge_app_fieldset": "fieldset_charge_app",
      "#charge_app": "optionApp",
      "#charge_livote": "li_vote",
      "#charge_votebox": "fieldset_vote",
      "#charge_positiveVote": "button_Positive",
      "#charge_negativeVote": "button_Negative",
      "#charge_charge": "button_charge"
    };

    ChargeCtrl.prototype.events = {
      "tap #charge_charge": "doCharge",
      "change #charge_app": "changeApp",
      "change #charge_cash": "changeCash",
      "tap #charge_positiveVote": "votePositive",
      "tap #charge_negativeVote": "voteNegative"
    };

    function ChargeCtrl() {
      this.getStreet = __bind(this.getStreet, this);
      this.vote = __bind(this.vote, this);
      this.voteNegative = __bind(this.voteNegative, this);
      this.votePositive = __bind(this.votePositive, this);
      this.valideAmount = __bind(this.valideAmount, this);
      this.travelCompleted = __bind(this.travelCompleted, this);
      this.doCharge = __bind(this.doCharge, this);
      this.changeCash = __bind(this.changeCash, this);
      this.changeApp = __bind(this.changeApp, this);
      this.initialize = __bind(this.initialize, this);
      var driver;
      ChargeCtrl.__super__.constructor.apply(this, arguments);
      driver = Lungo.Cache.get("driver");
      this.optionApp[0].checked = driver.appPayment;
      if (!driver.appPayment) {
        this.optionCash[0].checked = !driver.appPayment;
        this.optionCash[0].disabled = !driver.appPayment;
        this.fieldset_charge_app[0].style.display = "none";
      }
    }

    ChargeCtrl.prototype.initialize = function() {
      Lungo.Router.section("charge_s");
      this.button_charge[0].disabled = false;
      this.li_vote[0].style.display = "none";
      return this.fieldset_vote[0].style.display = "none";
    };

    ChargeCtrl.prototype.changeApp = function() {
      var driver;
      driver = Lungo.Cache.get("driver");
      if (driver.appPayment) {
        if (this.optionApp[0].checked) {
          this.optionApp[0].checked = true;
          return this.optionCash[0].checked = false;
        } else {
          this.optionApp[0].checked = false;
          return this.optionCash[0].checked = true;
        }
      }
    };

    ChargeCtrl.prototype.changeCash = function() {
      var driver;
      driver = Lungo.Cache.get("driver");
      if (driver.appPayment) {
        if (this.optionCash[0].checked) {
          this.optionApp[0].checked = false;
          return this.optionCash[0].checked = true;
        } else {
          this.optionApp[0].checked = true;
          return this.optionCash[0].checked = false;
        }
      }
    };

    ChargeCtrl.prototype.doCharge = function(event) {
      var currentLocation, lat, long;
      if (this.valideAmount(this.amount[0].value)) {
        this.button_charge[0].disabled = true;
        lat = Lungo.Cache.get("latitude");
        long = Lungo.Cache.get("longitude");
        currentLocation = new google.maps.LatLng(lat, long);
        return this.getStreet(currentLocation);
      }
    };

    ChargeCtrl.prototype.travelCompleted = function() {
      var destination, driver, latitude, longitude, server, travel;
      driver = Lungo.Cache.get("driver");
      travel = Lungo.Cache.get("travel");
      latitude = Lungo.Cache.get("latitude");
      longitude = Lungo.Cache.get("longitude");
      destination = Lungo.Cache.get("destination");
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/travelcompleted",
        data: {
          travelID: travel.travelID,
          email: driver.email,
          destination: destination,
          latitude: latitude,
          longitude: longitude,
          appPayment: this.optionApp[0].checked,
          cost: this.amount[0].value
        },
        success: (function(_this) {
          return function(result) {
            _this.amount[0].value = "";
            _this.li_vote[0].style.display = "block";
            return _this.fieldset_vote[0].style.display = "block";
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
            return Lungo.Router.section("charge_s");
          };
        })(this)
      });
    };

    ChargeCtrl.prototype.valideAmount = function(amount) {
      var decallowed, dectext;
      decallowed = 2;
      if (isNaN(amount)) {
        navigator.notification.alert("El importe introducido no es correcto", null, "Taxi Express", "Aceptar");
        return false;
      } else if (amount === "") {
        navigator.notification.alert("El importe no puede estar vacío", null, "Taxi Express", "Aceptar");
        return false;
      } else {
        if (amount.indexOf(".") === -1) {
          amount += ".";
        }
        dectext = amount.substring(amount.indexOf(".") + 1, amount.length);
        if (dectext.length > decallowed) {
          navigator.notification.alert("Por favor, entra un número con " + decallowed + " números decimales.", null, "Taxi Express", "Aceptar");
          return false;
        } else {
          return true;
        }
      }
    };

    ChargeCtrl.prototype.votePositive = function(event) {
      return this.vote("positive");
    };

    ChargeCtrl.prototype.voteNegative = function(event) {
      return this.vote("negative");
    };

    ChargeCtrl.prototype.vote = function(vote) {
      var data, driver, server, travel;
      driver = Lungo.Cache.get("driver");
      travel = Lungo.Cache.get("travel");
      server = Lungo.Cache.get("server");
      data = {
        email: driver.email,
        travelID: travel.travelID,
        vote: vote
      };
      return $$.ajax({
        type: "POST",
        url: server + "driver/votecustomer",
        data: data,
        success: (function(_this) {
          return function(result) {
            navigator.notification.alert("Cliente valorado", null, "Taxi Express", "Aceptar");
            Lungo.Router.section("waiting_s");
            Lungo.Cache.remove("requestInProgress");
            return Lungo.Cache.set("requestInProgress", false);
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            console.log(type.response);
            navigator.notification.alert("Error al valorar al cliente", null, "Taxi Express", "Aceptar");
            Lungo.Router.section("waiting_s");
            Lungo.Cache.remove("requestInProgress");
            return Lungo.Cache.set("requestInProgress", false);
          };
        })(this)
      });
    };

    ChargeCtrl.prototype.getStreet = function(pos) {
      var geocoder;
      geocoder = new google.maps.Geocoder();
      return geocoder.geocode({
        latLng: pos
      }, (function(_this) {
        return function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              if (results[0].address_components[1].short_name === results[0].address_components[0].short_name) {
                Lungo.Cache.remove("destination");
                Lungo.Cache.set("destination", results[0].address_components[1].short_name);
                return _this.travelCompleted();
              } else {
                Lungo.Cache.remove("destination");
                Lungo.Cache.set("destination", results[0].address_components[1].short_name + ", " + results[0].address_components[0].short_name);
                return _this.travelCompleted();
              }
            } else {
              console.log("falla");
              return _this.getStreet(pos);
            }
          } else {
            console.log("falla");
            return _this.getStreet(pos);
          }
        };
      })(this));
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

    ConfirmationCtrl.prototype.elements = {
      "#confirmation_name": "customerName",
      "#confirmation_valuation": "valuation",
      "#confirmation_image": "image",
      "#confirmation_street": "streetField",
      "#confirmation_accept": "button_accept",
      "#confirmation_reject": "button_reject"
    };

    ConfirmationCtrl.prototype.events = {
      "tap #confirmation_accept": "acceptConfirmation",
      "tap #confirmation_reject": "rejectConfirmation"
    };

    function ConfirmationCtrl() {
      this.getStreet = __bind(this.getStreet, this);
      this.stopTimer = __bind(this.stopTimer, this);
      this.rejectConfirmation = __bind(this.rejectConfirmation, this);
      this.acceptConfirmation = __bind(this.acceptConfirmation, this);
      var travel;
      ConfirmationCtrl.__super__.constructor.apply(this, arguments);
      travel = {
        travelID: "32",
        origin: "Calle falsa 4",
        latitude: "43.32132432",
        longitude: "-2.4567875423",
        customerID: "13",
        phone: "653432423"
      };
    }

    ConfirmationCtrl.prototype.loadTravel = function(travel) {
      var currentLocation, data, server;
      currentLocation = new google.maps.LatLng(travel.latitude, travel.longitude);
      this.getStreet(currentLocation);
      this.button_accept[0].disabled = false;
      this.button_reject[0].disabled = false;
      this.streetField[0].innerText = "Calle desconocida";
      this.customerName[0].innerText = "Usuario desconocido";
      this.image[0].src = "img/user.png";
      this.valuation[0].innerText = "☆☆☆☆☆";
      server = Lungo.Cache.get("server");
      data = {
        customerID: travel.customerID
      };
      $$.ajax({
        type: "GET",
        url: server + "driver/getcustomerdata",
        data: data,
        success: (function(_this) {
          return function(result) {
            var i, val;
            _this.customerName[0].innerText = result.name + " " + result.surname;
            if (result.image) {
              _this.image[0].src = result.image;
            }
            val = "";
            i = 0;
            while (i < result.valuation) {
              val = val + "★";
              i++;
            }
            while (i < 5) {
              val = val + "☆";
              i++;
            }
            return _this.valuation[0].innerText = val;
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            return console.log(type.response);
          };
        })(this)
      });
      Lungo.Cache.remove("travel");
      Lungo.Cache.set("travel", travel);
      setTimeout(((function(_this) {
        return function() {
          return Lungo.Router.section("confirmation_s");
        };
      })(this)), 2000);
      return timer = setTimeout(((function(_this) {
        return function() {
          Lungo.Cache.remove("requestInProgress");
          Lungo.Cache.set("requestInProgress", false);
          return Lungo.Router.section("waiting_s");
        };
      })(this)), 25000);
    };

    ConfirmationCtrl.prototype.acceptConfirmation = function(event) {
      var data, driver, server, travel;
      this.stopTimer();
      this.button_accept[0].disabled = true;
      this.button_reject[0].disabled = true;
      driver = Lungo.Cache.get("driver");
      travel = Lungo.Cache.get("travel");
      data = {
        email: driver.email,
        travelID: travel.travelID,
        latitude: Lungo.Cache.get("latitude"),
        longitude: Lungo.Cache.get("longitude")
      };
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/accepttravel",
        data: data,
        success: (function(_this) {
          return function(result) {
            return __Controller.arrive.iniArrive();
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
            Lungo.Cache.remove("requestInProgress");
            Lungo.Cache.set("requestInProgress", false);
            return Lungo.Router.section("waiting_s");
          };
        })(this)
      });
    };

    ConfirmationCtrl.prototype.rejectConfirmation = function(event) {
      this.stopTimer();
      Lungo.Cache.remove("requestInProgress");
      Lungo.Cache.set("requestInProgress", false);
      return Lungo.Router.section("waiting_s");
    };

    ConfirmationCtrl.prototype.stopTimer = function() {
      return clearTimeout(timer);
    };

    ConfirmationCtrl.prototype.getStreet = function(pos) {
      var geocoder;
      geocoder = new google.maps.Geocoder();
      return geocoder.geocode({
        latLng: pos
      }, (function(_this) {
        return function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              if (results[0].address_components[1].short_name === results[0].address_components[0].short_name) {
                _this.streetField[0].innerText = results[0].address_components[1].short_name;
                Lungo.Cache.remove("origin");
                return Lungo.Cache.set("origin", _this.streetField[0].innerText);
              } else {
                _this.streetField[0].innerText = results[0].address_components[1].short_name + ", " + results[0].address_components[0].short_name;
                Lungo.Cache.remove("origin");
                return Lungo.Cache.set("origin", _this.streetField[0].innerText);
              }
            } else {
              console.log("falla");
              return _this.getStreet(pos);
            }
          } else {
            console.log("falla");
            return _this.getStreet(pos);
          }
        };
      })(this));
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
      LoginCtrl.__super__.constructor.apply(this, arguments);
      this.db = window.openDatabase("TaxiExpressDriver", "1.0", "description", 2 * 1024 * 1024);
      this.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("CREATE TABLE IF NOT EXISTS accessDataDriver (email STRING NOT NULL PRIMARY KEY, pass STRING NOT NULL)");
        };
      })(this));
      this.read();
    }

    LoginCtrl.prototype.doLogin = function(event) {
      if (this.username[0].value && this.password[0].value) {
        this.drop();
        navigator.splashscreen.show();
        return this.valideCredentials(this.username[0].value, this.password[0].value);
      } else {
        return navigator.notification.alert("Debe rellenar el email y la contraseña", null, "Taxi Express", "Aceptar");
      }
    };

    LoginCtrl.prototype.valideCredentials = function(email, pass) {
      var data, pushID, server;
      pushID = Lungo.Cache.get("pushID");
      if (pushID === void 0) {
        return setTimeout(((function(_this) {
          return function() {
            pushID = Lungo.Cache.get("pushID");
            return _this.valideCredentials(email, pass);
          };
        })(this)), 500);
      } else {
        server = Lungo.Cache.get("server");
        data = {
          email: email,
          password: pass,
          pushID: pushID
        };
        server = Lungo.Cache.get("server");
        return $$.ajax({
          type: "POST",
          url: server + "driver/login",
          data: data,
          success: (function(_this) {
            return function(result) {
              return _this.parseResponse(result);
            };
          })(this),
          error: (function(_this) {
            return function(xhr, type) {
              setTimeout((function() {
                return Lungo.Router.section("login_s");
              }), 500);
              _this.password[0].value = "";
              navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
              return navigator.splashscreen.hide();
            };
          })(this)
        });
      }
    };

    LoginCtrl.prototype.parseResponse = function(result) {
      var driver, email, pass;
      if (this.username[0].value === "") {
        email = credentials.email;
        pass = credentials.pass;
      } else {
        email = this.username[0].value;
        pass = this.password[0].value;
      }
      this.db.transaction((function(_this) {
        return function(tx) {
          var sql;
          sql = "INSERT INTO accessDataDriver (email, pass) VALUES ('" + email + "','" + pass + "');";
          return tx.executeSql(sql);
        };
      })(this));
      driver = {
        email: email,
        first_name: result.first_name,
        last_name: result.last_name,
        appPayment: result.appPayment,
        available: result.available,
        model: result.model,
        company: result.company,
        plate: result.plate,
        license: result.license
      };
      Lungo.Cache.set("driver", driver);
      Lungo.Cache.remove("requestInProgress");
      Lungo.Cache.set("requestInProgress", false);
      __Controller.confirmation = new __Controller.ConfirmationCtrl("section#confirmation_s");
      __Controller.charge = new __Controller.ChargeCtrl("section#charge_s");
      __Controller.arrive = new __Controller.ArriveCtrl("section#arrive_s");
      __Controller.waiting = new __Controller.WaitingCtrl("section#waiting_s");
      Lungo.Router.section("waiting_s");
      return navigator.splashscreen.hide();
    };

    LoginCtrl.prototype.drop = function() {
      return this.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("DELETE FROM accessDataDriver");
        };
      })(this));
    };

    LoginCtrl.prototype.read = function() {
      return this.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("SELECT * FROM accessDataDriver", [], (function(tx, results) {
            if (results.rows.length > 0) {
              credentials = results.rows.item(0);
              return _this.valideCredentials(credentials.email, credentials.pass);
            } else {
              Lungo.Router.section("login_s");
              return setTimeout((function() {
                return navigator.splashscreen.hide();
              }), 500);
            }
          }), null);
        };
      })(this));
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
      Lungo.Cache.remove("pushID");
      return Lungo.Cache.set("pushID", id);
    };

    PushCtrl.prototype.handlePush = function(notification) {
      var lat, long, longlat, pos, travel;
      switch (notification.message) {
        case "801":
        case "802":
          if (!Lungo.Cache.get("requestInProgress")) {
            Lungo.Cache.remove("requestInProgress");
            Lungo.Cache.set("requestInProgress", true);
            longlat = notification.startpoint;
            pos = longlat.indexOf(",");
            lat = longlat.substring(0, pos);
            long = longlat.substring(pos + 1, longlat.length);
            travel = {
              travelID: notification.travelID,
              origin: notification.origin,
              startpoint: notification.startpoint,
              latitude: lat,
              longitude: long,
              customerID: notification.customerID,
              phone: notification.phone
            };
            return __Controller.confirmation.loadTravel(travel);
          }
          break;
        case "803":
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
    var driver, getStreet, updatePosition, watchId;

    __extends(WaitingCtrl, _super);

    driver = void 0;

    watchId = void 0;

    WaitingCtrl.prototype.events = {
      "change #waiting_available": "changeAvailable"
    };

    WaitingCtrl.prototype.elements = {
      "#waiting_driver": "driver",
      "#waiting_available": "valorAvailable",
      "#waiting_car": "car",
      "#waiting_plate": "plate",
      "#waiting_license": "license"
    };

    function WaitingCtrl() {
      this.stopWatch = __bind(this.stopWatch, this);
      this.getLocationUpdate = __bind(this.getLocationUpdate, this);
      this.updateAvailable = __bind(this.updateAvailable, this);
      this.changeAvailable = __bind(this.changeAvailable, this);
      WaitingCtrl.__super__.constructor.apply(this, arguments);
      driver = Lungo.Cache.get("driver");
      this.valorAvailable[0].checked = driver.available;
      this.driver[0].innerText = driver.first_name + " " + driver.last_name;
      this.car[0].innerText = driver.company + " " + driver.model;
      this.plate[0].innerText = driver.plate;
      this.license[0].innerText = driver.license;
      if (driver.available) {
        this.getLocationUpdate();
      }
    }

    updatePosition = function(position) {
      var server;
      Lungo.Cache.remove("latitude");
      Lungo.Cache.set("latitude", position.coords.latitude);
      Lungo.Cache.remove("longitude");
      Lungo.Cache.set("longitude", position.coords.longitude);
      driver = Lungo.Cache.get("driver");
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

    WaitingCtrl.prototype.changeAvailable = function() {
      return setTimeout(((function(_this) {
        return function() {
          return _this.updateAvailable(driver.email, _this.valorAvailable[0].checked);
        };
      })(this)), 700);
    };

    WaitingCtrl.prototype.updateAvailable = function(email, available) {
      var server;
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/updatedriveravailable",
        data: {
          email: email,
          available: available
        },
        success: (function(_this) {
          return function(result) {
            _this.valorAvailable[0].checked = available;
            if (available) {
              return _this.getLocationUpdate();
            } else {
              return _this.stopWatch();
            }
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            _this.valorAvailable[0].checked = !available;
            return navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
          };
        })(this)
      });
    };

    WaitingCtrl.prototype.getLocationUpdate = function() {
      var options, tt;
      console.log("empiezo");
      if (navigator.geolocation) {
        options = {
          frequency: 30000
        };
        tt = navigator.geolocation.watchPosition(updatePosition, null, options);
        return this.watchId = tt;
      }
    };

    WaitingCtrl.prototype.stopWatch = function() {
      console.log("dsa" + this.watchId);
      if (this.watchId) {
        navigator.geolocation.clearWatch(this.watchId);
        return this.watchId = void 0;
      }
    };

    getStreet = function(pos) {
      var geocoder;
      geocoder = new google.maps.Geocoder();
      return geocoder.geocode({
        latLng: pos
      }, function(results, status) {
        var street;
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            if (results[0].address_components[1].short_name === results[0].address_components[0].short_name) {
              street = results[0].address_components[1].short_name;
            } else {
              street = results[0].address_components[1].short_name + ", " + results[0].address_components[0].short_name;
            }
          } else {
            street = 'Calle desconocida';
          }
        } else {
          street = 'Calle desconocida';
        }
        Lungo.Cache.remove("street");
        return Lungo.Cache.set("street", street);
      });
    };

    return WaitingCtrl;

  })(Monocle.Controller);

}).call(this);
