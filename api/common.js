import fetchUrl from '@/api/index';
import apiList from '@/api/list';

/**
 * Use this commonApi function to call all APIs.
 * The only thing you need to make sure you pass valid arguments,
 * For reference you can find api list in @/api/list.js
 * @param {*} { parameters = [], action, module = '', data }
 * @return {*}
 */
// const reload = true;
const commonApi = ({ parameters = [], action, module = '', data, config }) => {
  const api = apiList[`${action}${module}`];
  if (api) {
    return fetchUrl({
      type: api.method,
      url: api.url(...parameters),
      data,
      config,
    }).then((items) => {
      // if (
      //   String(items?.reloadVersion) !== LocalStorage.get('reloadVersion') &&
      //   LocalStorage.get(KEYS.AUTH_TOKEN)
      // ) {
      //   if (reload) {
      //     window.location.reload()
      //     reload = false
      //   }
      // }
      // LocalStorage.set('reloadVersion', items.reloadVersion)
      return Promise.resolve(items);
    });
  }

  return Promise.reject(new Error('Ooops!, i belive you have called wrong url.'));
};

export default commonApi;
