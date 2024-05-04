// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://192.168.190.43/api/',
  apiUrl: 'http://127.0.0.1:8000/api/',
  chatUrl: 'http://localhost:4040/api/',
  encrypt: '090e49a56ead7eaef7794cfea2bdaef78098c3b474b62567e68e23b9dde3a74e',
  oneSignalAppId: '0223dd42-0ff3-475a-bfbe-b8a0f19207d1',
  oneSignalApiId: 'YjVmNWQwMTEtYWY0Ny00NTMzLWE4Y2ItYzYxODJiNmU4M2Q2',
  pusher: {
    key: '8a331fade1d7a51db1ed',
    cluster: 'ap1',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
