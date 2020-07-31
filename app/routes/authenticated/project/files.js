import Route from '@ember/routing/route';
import { ScrollTopMixin } from '../../../mixins/scroll-top';

export default class AuthenticatedProjectFilesRoute extends ScrollTopMixin(Route) {
  model() {
    return this.modelFor("authenticated.project");
  }
}
