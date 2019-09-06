import {BANNER} from '../src/mediaTypes';
import {registerBidder} from '../src/adapters/bidderFactory';

export const spec = {
  code: 'test',
  supportedMediaTypes: [BANNER],
  isBidRequestValid: function (bid) {
    return true;
  },
  buildRequests: function (bidRequests) {
    const requests = bidRequests.map(function (bid) {
      const size = getMaxPrioritySize(bid.sizes);
      const params = {
        tz: getTz(),
        w: size[0],
        h: size[1],
        bidid: bid.bidId,
        transactionid: bid.transactionId,
        auctionid: bid.auctionId,
        bidfloor: bid.params.bidfloor,
        cpm: bid.params.cpm
      };

      return {method: 'GET', url: '//httpstat.us/200', data: params}
    });

    return requests;
  },
  interpretResponse: function (serverResponse, bidRequest) {
    const answer = [];
    const data = bidRequest.data;

    answer.push({
      requestId: data.bidid,
      cpm: data.cpm,
      width: data.w,
      height: data.h,
      creativeId: "test-abc-1",
      currency: 'RUB',
      netRevenue: true,
      ad: "<img src='https://via.placeholder.com/" + data.w + "x" + data.h + "'>",
      ttl: 5000,
      transactionId: data.transactionid
    });

    return answer;
  },
};

function getTz() {
  return new Date().getTimezoneOffset();
}

function getMaxPrioritySize(sizes) {
  var maxPrioritySize = null;

  const sizesByPriority = [
    [300, 250],
    [240, 400],
    [728, 90],
    [300, 600],
    [970, 250],
    [300, 50],
    [320, 100]
  ];

  const sizeToString = (size) => {
    return size[0] + 'x' + size[1];
  };

  const sizesAsString = sizes.map(sizeToString);

  sizesByPriority.forEach(size => {
    if (!maxPrioritySize) {
      if (sizesAsString.indexOf(sizeToString(size)) !== -1) {
        maxPrioritySize = size;
      }
    }
  });

  if (maxPrioritySize) {
    return maxPrioritySize;
  } else {
    return sizes[0];
  }
}

registerBidder(spec);
