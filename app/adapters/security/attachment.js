import commondrf from '../commondrf';

export default class Attachment extends commondrf {
  namespace = "api/hudson-api"
  _buildURL(modelName, id) {
    if (id) {
      return this.buildURLFromBase(`${this.get('namespace')}/attachments/${id}`);
    }
    return this.buildURLFromBase(`${this.get('namespace')}/attachments`);
  }

}
