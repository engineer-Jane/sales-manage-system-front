"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

let request;

var mockApiClient = require('./mockApiClient');

var _default = {
  init: req => {
    request = req;
  },
  post: (data, url, options) => {
    if (mockApiClient.isMockApiEnabled()) {
      var mockedPost = mockApiClient.resolveSalesMock('POST', url);
      if (mockedPost !== undefined) return Promise.resolve(mockedPost);
    }
    if (request) {
      return request(url, _objectSpread({
        method: 'POST',
        data
      }, options || {}));
    }

    return;
  },
  get: (params, url, options) => {
    if (mockApiClient.isMockApiEnabled()) {
      var mockedGet = mockApiClient.resolveSalesMock('GET', url);
      if (mockedGet !== undefined) return Promise.resolve(mockedGet);
    }
    if (request) {
      return request(url, _objectSpread({
        method: 'GET',
        params
      }, options || {}));
    }

    return;
  },
  put: (data, url, options) => {
    if (mockApiClient.isMockApiEnabled()) {
      var mockedPut = mockApiClient.resolveSalesMock('PUT', url);
      if (mockedPut !== undefined) return Promise.resolve(mockedPut);
    }
    if (request) {
      return request(url, _objectSpread({
        method: 'PUT',
        data
      }, options || {}));
    }

    return;
  },
  delete: (data, url, options) => {
    if (mockApiClient.isMockApiEnabled()) {
      var mockedDel = mockApiClient.resolveSalesMock('DELETE', url);
      if (mockedDel !== undefined) return Promise.resolve(mockedDel);
    }
    if (request) {
      return request(url, _objectSpread({
        method: 'DELETE',
        params: data || {}
      }, options || {}));
    }

    return;
  }
};
exports.default = _default;
