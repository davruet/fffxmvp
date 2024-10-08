/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information. */

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dataUrl: '//localhost:5001/api/parameters', 
  generateUrl: '//localhost:5001/api/generate',
  imageUrl:'//localhost:5001/api/generateImage',
  emailUrl:'//localhost:5001/api/sendEmail'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
