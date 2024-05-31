#!/bin/bash
#Copyright(c) David Rueter All rights reserved. This program is made
#available under the terms of the AGPLv3 license. See the LICENSE file in the project root for more information.

export FFF_IMAGE="europe-west1-docker.pkg.dev/fffxmvp/fffxmvp-repo/fffxvmp:0.1"
export FFF_SERVICE="fffxmvp"
export FFF_REGION="europe-west1"

echo "Building frontend..."
(cd .. && ng build)

echo "Building image..."
gcloud builds submit --region=$FFF_REGION  --tag $FFF_IMAGE

echo "Deploying to Cloud Run..."
gcloud run deploy fffxmvp  --image $FFF_IMAGE  --platform managed --region $FFF_REGION  --allow-unauthenticated

echo "Deployment complete."
