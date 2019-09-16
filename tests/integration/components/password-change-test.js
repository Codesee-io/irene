import { getOwner } from '@ember/application';
import { test, moduleForComponent } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';
import { run } from '@ember/runloop';
import tHelper from 'ember-intl/helpers/t';

moduleForComponent('password-change', 'Integration | Component | password change', {
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
    component.send("changePassword");
    component.set("passwordCurrent", "testpassword");
    component.set("passwordNew", "testpassword");
    component.set("passwordConfirm", "testpassword1");
    component.send("changePassword");
    component.set("passwordConfirm", "testpassword");
    component.send("changePassword");
    assert.equal(component.get("isChangingPassword"), true, 'Changing Password');
  });
});
