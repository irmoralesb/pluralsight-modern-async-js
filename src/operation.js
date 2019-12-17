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
  const operation = {};

  getCurrentCity(function (error, result) {
    if (error) {
      operation.onError(error);
      return;
    }
    operation.onSuccess(result);
  });

  operation.setCallbacks = function setCallbacks(onSuccess, onError) {
    operation.onSuccess = onSuccess;
    operation.onError = onError;
  };

  return operation;
}

test("pass multiple callbacks - all of them are called", function (done) {
  //initiate operation
  const operation = fetchCurrentCity();

  //register callbacks
  operation.setCallbacks(result => done());
  operation.setCallbacks(result => done());
});

test("fetchCurrentCity pass the callbacks later on", function (done) {
  //initiate operation
  const operation = fetchCurrentCity();

  //register callbacks
  operation.setCallbacks(
    result => done(),
    error => done(error)
  );
});