# project-planner
## Description
Welcome to the ProjectFlow App! ProjectFlow is an efficient and appealing app that allows users to visualize and organize assignments.
Through a variety of special features such as a dynamic calendar, AI-based project planning, and progress visualization, users are able
to take charge of their assignments in a timely manner.


To make our application available to you, please follow the following steps:

## Getting Started
Before you begin, please ensure you have downloaded the following on your machine: 
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- [Node.js](https://nodejs.org)

Please ensure that you have downloaded the software compatible with your device. These are the only external downloads you must make to allow for backend setup.

## Installing Dependencies
First, clone the repository to your local machine. Run this command in your command prompt:

`git clone https://github.com/vik135/project-planner`

Change your local working directory to the cloned repository:

`cd project-planner`

And to install all dependencies:

`npm install`

## Running App on Local Host

Once you have installed all the modules and project dependencies, you are ready to deploy the app! However, you must complete one more setup step, to initialize the backend and database. In the root directory of the project, please create a **.env** file and insert this text:

`MONGO_URI='YOUR_MONGODB_URL'`

Replace "YOUR_MONGODB_URL" with your MongoDB URL Connection String, for example, _mongodb://127.0.0.1:27017/test_

Now, To view and use the app in your local host, change your current working directory to project-planner (or root directory of the project), and run:

`npm start` 

**Note:** If you are not able to see the app in your browser, you can view it manually by searching: 

`https://localhost:3000`

## Notes
If you would like to visualize the database and view database entries, please install the MongoDB Compass as such: 
- [MongoDB Compass](https://www.mongodb.com/try/download/compass)

Once you open the Compass, you can connect to the local port by connecting to `mongodb://localhost:27017/` and navigating to the "test" directory.

**IMPORTANT NOTE:**
Due to the nature of this repo being public, the AI project generation feature is temporarily disabled. Please see this [video](https://drive.google.com/file/d/1Mc7YjiUJKoow6Kky5X-_Ozp6hBJodCt4/view?usp=sharing) for a demonstration of the feature.

**CREDIT:**
All `<svg>` elements were designed on Figma and then generated with Figma Dev Mode.
