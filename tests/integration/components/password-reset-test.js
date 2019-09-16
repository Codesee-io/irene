import { getOwner } from '@ember/application';
import { test, moduleForComponent } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';
import { run } from '@ember/runloop';
import tHelper from 'ember-intl/helpers/t';


moduleForComponent('password-reset', 'Integration | Component | password reset', {
  unit: true,
  needs: [
    'service:ajax',
    'service:notification-messages-service',
    'service:session',
    'config:environment',
    'service:intl',
    'ember-intl@adapter:default',
    'cldr:en',
    'cldr:ja',
    'translation:en',
    'util:intl/missing-message'
  ],
  beforeEach() {
    // set the locale and the config
    getOwner(this).lookup('service:intl').setLocale('en');

    this.registry.register('helper:t', tHelper);
    // start Mirage
    this.server = startMirage();
  },
  afterEach() {
    // shutdown Mirage
    this.server.shutdown();
  }
});

test('tapping button fires an external action', function(assert) {

  var component = this.subject();
  run(function() {
    component.set("password", "test");
    assert.equal(component.validate()[0], "Passwords must be greater than or equal to 6", "Validate Password");
    component.set("password", "test233s");
    component.set("confirmPassword", "test233s1");
    assert.equal(component.validate()[0], "Passwords doesnt match", "Validate Password");

    component.send("reset");

    component.set("password", "test21234");
    component.set("confirmPassword", "test21234");

    assert.equal(component.validate(), undefined, "Validate Password");

    component.send("reset");
    assert.equal(component.get("isResettingPassword"), true, 'Resetting Password');
  });
});
