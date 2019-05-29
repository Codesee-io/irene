import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Component.extend({
  project: null,
  profile: computed('project.activeProfileId', function(){
    const profileId = this.get('project.activeProfileId');
    if(!profileId){
      return null;
    }
    return this.get("store").findRecord('profile', profileId);
  }),
  reportPreference: computed('profile.id', function() {
    return this.get('profile.reportPreference');
  }),
  saveDynamic: task(function *(value){
    const dynamicScan = value
    const apiScan = this.get('reportPreference.show_api_scan');
    const manualScan = this.get('reportPreference.show_manual_scan');
    yield this.get('saveReportPreference').perform(
      dynamicScan, apiScan, manualScan
    );
  }).restartable(),
  saveAPI: task(function *(value){
    const dynamicScan = this.get('reportPreference.show_dynamic_scan');
    const apiScan = value
    const manualScan = this.get('reportPreference.show_manual_scan');
    yield this.get('saveReportPreference').perform(
      dynamicScan, apiScan, manualScan
    );
  }).restartable(),
  saveManual: task(function *(value){
    const dynamicScan = this.get('reportPreference.show_dynamic_scan');
    const apiScan = this.get('reportPreference.show_api_scan');
    const manualScan = value
    yield this.get('saveReportPreference').perform(
      dynamicScan, apiScan, manualScan
    );
  }).restartable(),
  saveReportPreference: task(function *(dynamicScan, apiScan, manualScan) {
    const profile = this.store.peekRecord('profile', this.get('profile.id'));
    yield profile.saveReportPreference({
      show_dynamic_scan: dynamicScan,
      show_api_scan: apiScan,
      show_manual_scan: manualScan
    });
  }).restartable(),
});
