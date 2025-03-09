import axios from 'axios';
import qs from 'qs';
import getConfig from 'next/config';
import { deleteCookie, getCookie } from 'cookies-next';

import { logout } from '@/utils/util';
import Toast from '@/utils/toast';
// import { getToken } from '@/utils/localStorage';
import { KEYS } from '@/utils/constant';
import { setDeviceIdCookie } from '@/utils/common';
import { handleRefreshToken } from '@/utils/helper';

const { publicRuntimeConfig } = getConfig();

export const baseUrl = `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/`;
const GET = 'GET';
const DELETE = 'DELETE';
const POST = 'POST';
const PUT = 'PUT';
const PATCH = 'PATCH';

let cache = [];

const cancel = [];
const ACTION_HANDLERS = {
  [GET]: (url, data, headers) => {
    let queryUrl = url;

    if (data !== undefined) {
      const query = qs.stringify(data);
      queryUrl = `${queryUrl}?${query}`;
    }

    return axios.get(baseUrl + queryUrl, {
      // cancelToken: new axios.CancelToken((cToken) => {
      //   cancel.push({ url, cToken });
      // }),

      headers,
    });
  },

  [DELETE]: (url, data, headers) => axios.delete(baseUrl + url, { headers, data }),

  [POST]: (url, data, headers) =>
    axios.post(baseUrl + url, data, {
      headers,
    }),
  [PATCH]: (url, data, headers) =>
    axios.patch(baseUrl + url, data, {
      headers,
    }),

  [PUT]: (url, data, headers) =>
    axios.put(baseUrl + url, data, {
      headers,
    }),
};

function setHeaders({
  contentType = 'application/json',
  authToken = true,
  isServer = false,
  timezone = true,
  // destination,
  // origin,
  userToken,
  deviceToken = true,
}) {
  if (authToken && !isServer) {
    const token = getCookie(KEYS.TOKEN) || userToken;

    if (token) {
      axios.defaults.headers.common.authorization = ` Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.authorization;
    }
  }

  if (deviceToken) {
    setDeviceIdCookie();
    axios.defaults.headers.post['x-device-id'] = getCookie(KEYS.deviceToken);
  }
  if (timezone) {
    axios.defaults.headers.post.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  if (contentType) {
    axios.defaults.headers.post['Content-Type'] = contentType;
    axios.defaults.headers.post.Accept = 'application/json';
  }
}

function handleError(error) {
  cache = [];
  const { response = {} } = error || {};
  const UnauthorizedCode = 401;

  // this condtition was applied in the below If()
  //   response.status === UnauthorizedCode &&
  //     typeof window !== 'undefined' &&
  //     !Object.prototype.hasOwn(response.data, 'confirmed') &&
  //     window.location.pathname !== routes.home,

  if (response.status === UnauthorizedCode) {
    logout();
    return;
  }

  const { message } = response.data || {};

  message && Toast.error(message);

  return Promise.reject(error instanceof Error ? error : new Error(message));
}

const cacheHandler = (url, { shouldRefetch, handleCache = true }, type) => {
  if (!shouldRefetch && handleCache) {
    if (type.toUpperCase() === 'GET') {
      if (cache.includes(url)) {
        const controller = Array.isArray(cancel) ? cancel.filter((index) => index.url === url) : [];
        controller?.map((item) => item?.cToken());
      } else {
        cache.push(url);
      }
    }
  }
};

const fetchUrl = ({ type, url, data = {}, config = {}, hash = '' }) => {
  setHeaders(config);
  cacheHandler(hash ? `${url}?${hash}` : url, config, type.toUpperCase());
  // const time = Number(getCookie(KEYS.EXPIRES)) - Math.floor(Date.now() / 1000);

  if (getCookie(KEYS.EXPIRES)) {
    if (Number(getCookie(KEYS.EXPIRES)) - Math.floor(Date.now() / 1000) < 900000) {
      handleRefreshToken();
      deleteCookie(KEYS.EXPIRES);
    }
  }

  const handler = ACTION_HANDLERS[type.toUpperCase()];

  return handler(url, data, config.headers)
    .then((response) => Promise.resolve(response.data))
    .catch(handleError);
};
0;
export default fetchUrl;
