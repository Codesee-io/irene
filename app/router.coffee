`import Ember from 'ember';`
`import config from 'irene/config/environment';`

Router = Ember.Router.extend
  location: config.locationType,
  rootURL: config.rootURL

Router.map ->
  @route 'freestyle'
  @route 'login'

`export default Router;`
