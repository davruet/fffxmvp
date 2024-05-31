/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information. */

import { generate } from "rxjs";

export const environment = {
  production: true,
  dataUrl: '/api/parameters',
  generateUrl: '/api/generate', 
  imageUrl:'/api/generateImage',
  emailUrl:'/api/sendEmail'

};
