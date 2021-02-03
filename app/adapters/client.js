import commondrf from './commondrf';

export default class ClientAdapter extends commondrf {
  buildURL() {
    return this.buildURLFromBase(`${this.namespace_v2}/partner/${this.me.partner.id}/clients`);
  }
}
