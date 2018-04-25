import Ember from 'ember';
import ENUMS from 'irene/enums';

export function userRole(params) {

  const currentRole = params[0];

  if (currentRole === ENUMS.ORGANIZATION_ROLES.MEMBER) {
    return "memberRole";
  } else if (currentRole === ENUMS.ORGANIZATION_ROLES.OWNER) {
    return "owner";
  }
}

export default Ember.Helper.helper(userRole);
