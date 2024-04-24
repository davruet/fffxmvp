#!/bin/bash


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
