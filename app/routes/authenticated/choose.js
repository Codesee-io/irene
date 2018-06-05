import Ember from 'ember';
import config from 'irene/config/environment';
import ScrollTopMixin from 'irene/mixins/scroll-top';

const AuthenticatedChooseRoute = Ember.Route.extend(ScrollTopMixin, {

  title: `Choose File${config.platform}`,
  model(params){
    return this.get('store').find('file', params.fileId);
  }
}
);


export default AuthenticatedChooseRoute;