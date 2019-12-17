const delayms = 1;

function getCurrentCity(callback) {
  setTimeout(function () {
    const city = "New York, NY";
    callback(null, city);

  }, delayms)
}

function getWeather(city, callback) {
  setTimeout(function () {

    if (!city) {
      callback(new Error("City required to get weather"));
      return;
    }

    const weather = {
      temp: 50
    };

    callback(null, weather)

  }, delayms)
}

function getForecast(city, callback) {
  setTimeout(function () {

    if (!city) {
      callback(new Error("City required to get forecast"));
      return;
    }

    const fiveDay = {
      fiveDay: [60, 70, 80, 45, 50]
    };

    callback(null, fiveDay)

  }, delayms)
}

function fetchCurrentCity() {
  const operation = {
    successReactions: [],
    errorReactions: []
  };

  getCurrentCity(function (error, result) {
    if (error) {
      operation.errorReactions.forEach(r => r(error));
      return;
    }
    operation.successReactions.forEach(r => r(result));
  });

  operation.onCompletion = function setCallbacks(onSuccess, onError) {
    const noop = function () { };

    operation.successReactions.push(onSuccess || noop);
    operation.errorReactions.push(onError || noop);
  };

  operation.onFailure = function onFailure(onError) {
    operation.onCompletion(null, onError);
  }

  return operation;
}

function fetchWeather(city) {
  const operation = {
    successReactions: [],
    errorReactions: []
  };

  getWeather(city, function (error, result) {
    if (error) {
      operation.errorReactions.forEach(r => r(error));
      return;
    }
    operation.successReactions.forEach(r => r(result));
  });

  operation.onCompletion = function setCallbacks(onSuccess, onError) {
    const noop = function () { };

    operation.successReactions.push(onSuccess || noop);
    operation.errorReactions.push(onError || noop);
  };

  operation.onFailure = function onFailure(onError) {
    operation.onCompletion(null, onError);
  }

  return operation;
}

test("noop if no success handler passed", function (done) {
  //initiate operation
  const operation = fetchCurrentCity();

  //noop should register for success handler
  operation.onFailure(error => done(error));

  //trigger success to make sure noop registered
  operation.onCompletion(result => done());
});

test("noop if no error handler passed", function (done) {
  //initiate operation
  const operation = fetchWeather();

  //noop should register for error handler
  operation.onCompletion(result => done(new Error("shouldn't succeed")));

  //trigger success to make sure noop registered
  operation.onFailure(error => done());
});

test("pass multiple callbacks - all of them are called", function (done) {
  //initiate operation
  const operation = fetchCurrentCity();
  const multiDone = callDone(done).afterTwoCalls();

  //register callbacks
  operation.onCompletion(result => multiDone());
  operation.onCompletion(result => multiDone());
});

test("fetchCurrentCity pass the callbacks later on", function (done) {
  //initiate operation
  const operation = fetchCurrentCity();

  //register callbacks
  operation.onCompletion(
    result => done(),
    error => done(error)
  );
});