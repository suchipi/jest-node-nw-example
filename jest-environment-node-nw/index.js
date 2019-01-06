/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
"use strict";

// This package is almost *exactly* the same as jest-environment-node,
// except that on lines 38-40 we copy every global into the global for
// the environment, instead of just a few select ones. (And the flow
// parts are commented out because I didn't want to set up flow for a
// small demonstration project).

// import type {Config} from 'types/Config';
// import type {Global} from 'types/Global';
// import type {Script} from 'vm';
// import type {ModuleMocker} from 'jest-mock';

const FakeTimers = require("jest-util").FakeTimers;
const installCommonGlobals = require("jest-util").installCommonGlobals;
const mock = require("jest-mock");
const vm = require("vm");

class NodeNwEnvironment {
  // context: ?vm$Context;
  // fakeTimers: ?FakeTimers;
  // global: ?Global;
  // moduleMocker: ?ModuleMocker;

  constructor(config /*: Config*/) {
    this.context = vm.createContext();
    const global = (this.global = vm.runInContext("this", this.context));
    for (const key in window) {
      global[key] = window[key];
    }
    installCommonGlobals(global, config.globals);
    this.moduleMocker = new mock(global);
    this.fakeTimers = new FakeTimers(global, this.moduleMocker, config);
  }

  dispose() {
    if (this.fakeTimers) {
      this.fakeTimers.dispose();
    }
    this.context = null;
    this.fakeTimers = null;
  }

  runScript(script /*: Script*/) /*: ?any*/ {
    if (this.context) {
      return script.runInContext(this.context);
    }
    return null;
  }
}

module.exports = NodeNwEnvironment;
