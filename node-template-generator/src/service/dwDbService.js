/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class DwDbService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  getProposalVoteSearch(params){//董事会监事会投票
    let url = '/org/ann/voteInfo/stat';
    return this.http.getJson(url,params);
  }


}

export default {
  DwDbService: DwDbService,
}
