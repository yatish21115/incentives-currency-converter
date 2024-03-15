#!/usr/bin/env bash

export AWS_PROFILE= sandbox

sam deploy \
    --template-file template.yml \
    --stack-name YatishCurrencyConverter \
    --capabilities CAPABILITY_NAMED_IAM  \
    --region $AWS_REGION \
    --tags \
          creator=yatish \
          squad=im \
    --no-fail-on-empty-changeset

if [[ $? -eq 0 ]];then
   echo "Deployed Successfully"
else
   echo "Failed to deploy"
   exit 1
fi