import Component from '@ember/component';
import { computed } from '@ember/object';

const RecentIssuesComponent = Component.extend({

  recentIssues: computed(function() {
    return this.get('store').findAll('analytics/recent-issue');
  })

});

export default RecentIssuesComponent;
