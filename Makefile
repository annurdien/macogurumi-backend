# Define the stage variable, default to 'dev'
STAGE ?= dev

# Build the project using the existing build-lambda command
build: clean
	yarn build:lambda

# Deploy the lambda function using serverless
# Always runs 'build' before deploying
deploy: build
	serverless deploy --stage $(STAGE)

# Clean the dist folder
clean:
	rm -rf dist

# Deploy specifically to the 'dev' stage (runs build first)
deploy-dev: 
	make deploy STAGE=dev

# Deploy specifically to the 'production' stage (runs build first)
deploy-prod: 
	make deploy STAGE=production