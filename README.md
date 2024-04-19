# FFFxMVP

## Requirements

* Docker
* OpenAI account with positive balance, API key

GCloud deployment:
* Gcloud CLI: https://cloud.google.com/sdk/docs/install
* Google Cloud Run account with billing configured


## Architecture overview

This app uses an ionic/Angular frontend, a gunicorn/flask backend, and nginx for serving web requests.
All of these are packaged into a single Docker image.


## Building

To build the client app, run:
`ng build` in the base directory. This creates a www folder that will be used to build the docker image.

Then, to build the Docker image, run
`docker build .`

## Local testing

Set the OpenAI API key env variable:

`export OPENAI_API_KEY=YOUR KEY HERE`

In the backend folder, run:

```docker-compose up --build```

To test the generate endpoint, you can post some JSON in this format:
```
curl -X POST http://localhost:8080/generate -H "Content-Type: application/json" -d '{"type":"surprise-me","ingredients":["test ingredient"], "mvp":"Test Protein","style":"test","serving":"test", "directive":"test"}' > test.html
```

## GCloud setup and deployment



### Login and create project
`gcloud init`

Log in.
```
Pick cloud project to use: 
 [1] crafty-almanac-420514
 [2] platinum-voice-420514
 [3] Enter a project ID
 [4] Create a new project
Please enter numeric choice or text value (must exactly match list item):  4
```

```
Enter a Project ID. Note that a Project ID CANNOT be changed later.
Project IDs must be 6-30 characters (lowercase ASCII, digits, or
hyphens) in length and start with a lowercase letter. fffxmvp
```

Project IDs must be lowercase.
```
gcloud projects create fffxmvp
```

### Create repo
`gcloud artifacts repositories create fffxmvp-repo --repository-format=docker  --description="fffxmvp repository" --location=europe-west1`

### Build image

`cd backend && gcloud builds submit --region=europe-west1 --tag europe-west1-docker.pkg.dev/fffxmvp/fffxmvp-repo/fffxvmp:0.1`

### Grant deploy permissions
`backend/grantDeployPermissions.sh`

### Add secret for sheets API and OPENAI api
`gcloud secrets create sheets-service-worker-key --replication-policy="automatic"`
`gcloud secrets versions add sheets-service-worker-key --data-file="(path to key json file here)"`

`gcloud secrets create openai-api-key --replication-policy="automatic"`
`echo YOUR_OPENAI_API_KEY_HERE |  gcloud secrets versions add openai-api-key --data-file=-`

Generate a service worker account and key by following these instructions, saving the key locally:
https://support.google.com/a/answer/7378726?hl=en

### Deploy
```
gcloud auth configure-docker europe-west1-docker.pkg.dev
```

```
gcloud run services replace --region europe-west1 service.yaml
```



```
gcloud secrets add-iam-policy-binding my-secret \
    --member="serviceAccount:your-cloud-run-service-account@your-project.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```