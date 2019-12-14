# ASSIGNMENT 2 - AGILE SOFTWARE PRACTICE

Name: Tsvetoslav Dimov

## Client UI

![Log in](./imgs/1.png?raw=true "Log in")

A page for authentication of existing users. The form includes validation for all fields.

---
![Sign up](./imgs/2.png?raw=true "Sign up")

A page for authentication of new users. The form includes validation for all fields.

---
![Dashboard](./imgs/4.png?raw=true "Dashboard")

Dashboard that displays all user posts.
It allows the users to create new posts.
Once there are posts on the dashboard, possible actions are sharing, deleting and editing. Sharing can only be performed once; deleting and updating can be done only by post owners.

---
![OwnPosts](./imgs/5.png?raw=true "Own posts")

A page that displays current user's posts. If empty, it will display a feedback message.

## E2E / Cypress testing

* Tests execution is being recorded and uploaded to [cypress.io](https://dashboard.cypress.io/projects/n4jj7m/runs "https://dashboard.cypress.io/projects/n4jj7m/runs").
* Extensive authentication tests.
* Selectors not covered in class: '.children()', ':nth-child(int)', 'clear()', 'trigger()'
* Assertions not covered in class: 'be.disabled', 'have.class', 'be.visible', 'have.value', 'exist'
* Clean test code, made possible through using helper methods stored in ```/support/helpers.js``` and fixtures.
* Utilised bundling/building and test scripts provided by Vue.js by default.
* Custom cypress config.

## Web API CI/CD

[gitlab-pages](https://cecobask.gitlab.io/socialdeckapi/ "https://cecobask.gitlab.io/socialdeckapi/")
It includes a page with navigation to the Web API repository, the CI/CD pipelines, and test coverage reports.

All pushes to ```develop``` and ```master``` branches, trigger a CI pipeline that sets up the environment, builds the project and executes tests. If all tests are successful, the API gets deployed to Heroku for staging / production.
## GitLab CI/CD

* Deployment of client app to AWS S3 bucket
* Caching of resources for speeding up the CI/CD process, including ```.npm```, ```cache/Cypress```, ```node_modules```.
* Using Cypress Docker image that comes with necessary dependencies to run cypress test in a CI environment.
* Setting environment variables per job, in order to trigger deployment to production or staging environment.
* Uploading video results of Cypress test execution to a [cypress.io](https://dashboard.cypress.io/projects/n4jj7m/runs "https://dashboard.cypress.io/projects/n4jj7m/runs") dashboard.
* Continuous deployment, continuous delivery and continuous integration scripts.

[staging-client](http://socialdeck-client-staging.s3-website-eu-west-1.amazonaws.com/ "http://socialdeck-client-staging.s3-website-eu-west-1.amazonaws.com/")  
[staging-api](https://socialdeck-api-staging.herokuapp.com/ "https://socialdeck-api-staging.herokuapp.com/")  
[prod-client](http://socialdeck-client-prod.s3-website-eu-west-1.amazonaws.com/ "http://socialdeck-client-prod.s3-website-eu-west-1.amazonaws.com/")  
[prod-api](https://socialdeck-api-prod.herokuapp.com/ "https://socialdeck-api-prod.herokuapp.com/")  


