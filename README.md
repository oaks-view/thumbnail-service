thumbnail-service is a nodejs app purely meant to demonstrate the use of nodejs to build api projects.
Here in contains the steps involved to setup and run the project.

#Project setup
1. Clone BlockchainAPI repository using the following commands
    `git clone https://github.com/oaks-view/thumbnail-service`
OR
`git clone git@github.com:oaks-view/thumbnail-service.git`

2.  `cd thumbnail-service` and run `npm install`

#Run project
Simply navigate into the project directory and run the command `npm start`

#Running tests
To run unit tests use the following command `npm test`

#Debug tests with vscode
An extra script is provided to provide a convenient way to debug unit tests using vscode's debugger.
Assuming vscode is installed on current machine use the following steps to setup and debug tests.

- Setting up debugger
1. Creat a `launch.json` file from vscode. See the following link for more info https://code.visualstudio.com/docs/editor/debugging.
2. Add the following configuration
```
{
    "name": "Debug Api Test",
    "type": "node",
    "request": "launch",
    "address": "localhost",
    "port": 9229,
    "sourceMaps": false
}
```
- Debugging tests
1. Select the debugger icon, and make sure the selected launch config is pointing to `Debug Api Test`
2. Next open a terminal and navigate into project root directory if not there already.
3. Now run the command `npm run test:debug`
4. Now head to the debugger view on vscode and start the debugger by clicking on the play button
See more information from here https://scottaddie.com/2015/10/22/debugging-mocha-unit-tests-in-visual-studio-code/


#Generate Code coverage for tests
Use the following command to generate coverage report, `npm run coverage` 

#api specs / doc
To see the list of api endpoints provided, visit the following endpoint `/api-docs`
