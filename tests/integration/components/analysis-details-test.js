import Ember from 'ember';
import ENUMS from 'irene/enums';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { test, moduleForComponent } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

moduleForComponent('analysis-details', 'Integration | Component | analysis details', {
  unit: true,
  needs: [
    'component:attach-tooltip',
    'component:modal-card',
    'component:confirm-box',
    'component:ember-popper',
    'helper:eq',
    'helper:risk-text',
    'service:i18n',
    'service:ajax',
    'service:notification-messages-service',
    'service:session',
    'locale:en/translations',
    'locale:en/config',
    'util:i18n/missing-message',
    'util:i18n/compile-template',
    'config:environment'
  ],
  beforeEach() {
    // set the locale and the config
    Ember.getOwner(this).lookup('service:i18n').set('locale', 'en');
    this.register('locale:en/config', localeConfig);

    // register t helper
    this.register('helper:t', tHelper);

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
  this.render();
  Ember.run(function() {
    component.set("risks", ENUMS.RISK.CHOICES.slice(0, -1));
    component.set('analysis', {computedRisk:ENUMS.RISK.NONE});
    assert.deepEqual(component.get("filteredRisks"),
      [
        {"key": "LOW","value": 1},
        {"key": "MEDIUM","value": 2},
        {"key": "HIGH","value": 3},
        {"key": "CRITICAL","value": 4}
      ], 'Filtered Risks');
    assert.equal(component.get("markedRisk"), 1, 'Marked Risk');
    assert.equal(component.get('riskClass'), "is-success", "Success");
    component.set('analysis', {computedRisk:ENUMS.RISK.LOW});
    assert.equal(component.get('riskClass'), "is-info", "Info");
    component.set('analysis', {computedRisk:ENUMS.RISK.MEDIUM});
    assert.equal(component.get('riskClass'), "is-warning", "Warning");
    component.set('analysis', {computedRisk:ENUMS.RISK.HIGH});
    assert.equal(component.get('riskClass'), "is-danger", "Danger");
    component.set('analysis', {computedRisk:ENUMS.RISK.CRITICAL});
    assert.equal(component.get('riskClass'), "is-critical", "Critical");
    component.set('analysis', {computedRisk:ENUMS.RISK.UNKNOWN});
    assert.equal(component.get('progressClass'), "is-progress", "Progress");
    component.send('toggleVulnerability');
    assert.equal(component.get('showVulnerability'),true, "Show Vulnerability");

    component.send('openEditAnalysisModal');
    component.send('selectMarkedAnalyis');
    component.send('selectMarkedAnalyisType');
    component.send('selectIgnoredAnalyisType');
    component.send('removeMarkedAnalysis');
    component.set('analysis', {file: {id: 1}, vulnerability: {id: 1}});
    component.send('markAnalysis');
    component.send('ignoreAnalysis');
    component.send('doNotIgnoreAnalysis');
    component.send('editMarkedAnalysis');
    component.send('cancelEditMarkingAnalysis');
    component.send('ignoreAnalysisRequest');
    component.send('resetMarkedAnalysis');
    component.send('openResetMarkedAnalysisConfirmBox');
    assert.notOk(component.confirmCallback());
  });
});
