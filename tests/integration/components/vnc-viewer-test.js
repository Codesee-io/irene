/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { test, moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('vnc-viewer', 'Integration | Component | vnc viewer', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);


  // Set any properties with @set 'myProperty', 'value'
  // Handle any actions with @on 'myAction', (val) ->

  this.render(hbs("{{vnc-viewer}}"));

  return assert.equal(this.$().text().trim(), '');
});
