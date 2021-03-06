'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');

test('openshift client tests', (t) => {
  // Need to stub the config loader for these tests
  const stubbedConfigLoader = (client) => {
    return Promise.resolve(client);
  };

  const openshiftRestClient = proxyquire('../lib/openshift-rest-client', {
    './config-loader': stubbedConfigLoader
  });

  const osClient = openshiftRestClient();
  t.equal(osClient instanceof Promise, true, 'should return a Promise');

  osClient.then((client) => {
    t.ok(client.projects, 'client object should have a projects object');
    t.ok(client.buildconfigs, 'client object should have a buildconfigs object');
    t.ok(client.services, 'client object should have a services object');
    t.ok(client.deploymentconfigs, 'client object should have a deploymentconfigs object');
    t.ok(client.events, 'client object should have a events object');
    t.ok(client.persistentvolumeclaims, 'client object should have a persistentvolumeclaims object');
    t.ok(client.routes, 'client object should have a routes object');
    t.end();
  });
});

test('openshift client settings test', (t) => {
  // Need to stub the config loader for these tests
  const stubbedConfigLoader = (client) => {
    return Promise.resolve(client);
  };

  const openshiftRestClient = proxyquire('../lib/openshift-rest-client', {
    './config-loader': stubbedConfigLoader
  });

  const settings = {
    request: {
      strictSSL: true
    }
  };

  const osClient = openshiftRestClient(settings);

  osClient.then((client) => {
    t.ok(client.settings, 'client object should have a settings object');
    t.ok(client.settings.request, 'client object should have a settings.request object');
    t.end();
  });
});

test('openshift client config settings test', (t) => {
  // Need to stub the config loader for these tests
  const stubbedConfigLoader = (client) => {
    return Promise.resolve(client);
  };

  const openshiftRestClient = proxyquire('../lib/openshift-rest-client', {
    './config-loader': stubbedConfigLoader
  });

  const settings = {
    request: {
      strictSSL: true
    },
    config: {
      cluster: 'https://192.168.99.100:8443/'
    }
  };

  const osClient = openshiftRestClient(settings);

  osClient.then((client) => {
    t.ok(client.settings.config.cluster, 'https://192.168.99.100:8443', 'should have the trailing slash removed');
    t.end();
  });
});

test('openshift client config settings test - no url', (t) => {
  // Need to stub the config loader for these tests
  const stubbedConfigLoader = (client) => {
    return Promise.resolve(client);
  };

  const openshiftRestClient = proxyquire('../lib/openshift-rest-client', {
    './config-loader': stubbedConfigLoader
  });

  const settings = {
    request: {
      strictSSL: true
    },
    config: {}
  };

  const osClient = openshiftRestClient(settings);

  osClient.catch(error => {
    t.equal(error.message, 'Please provide an url of your OpenShift cluster in your configuration settings.', 'should have error message');
    t.end();
  });
});
