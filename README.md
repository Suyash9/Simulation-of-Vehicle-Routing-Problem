# Vehicle Routing

This application simulates the Vehicle Routing Problem and several of its variations.
It is a serverless cloud application built using Microsoft Azure that allows users to enter vehicles, locations and algorithms and run a variety of Vehicle Routing Algorithms. 
The user can run a variety of algorithms to obtain near-optimal routes for various vehicle and location inputs.
It is assumed that the vehicles will operate as autonomous systems, without any direct human interaction. Human involvement will only be required if a problem arises.

The web application can be accessed on this link: https://vehicleroutingsolution.azurewebsites.net/.

## Getting Started

The application is deployed on Microsoft Azure App Service and implemented using a combination of JavaScript and HTML/CSS frontend (React framework) and Python backend. 
Storage and retrieval of vehicles, locations and algorithms is achieved using Microsoft Azure Table Storage and Microsoft Azure Function Apps. 
The algorithms used for evaluation are implemented using Java.

The backend Python servers need to be running in order to run the algorithms and obtain results on the web application.

### Prerequisites

To run the frontend ReactJS application on a local machine, Node.js and React web framework need to be installed.

To run the backend servers, Python, flask, Google OR tools for python and selenium are required. Google Chrome or Firefox also needs to be installed for the servers to run.

To run the Java algorithms used for evaluation, Google OR Tools for Java needs to be installed.

## Microsoft Azure Function App

The Azure Functions written in the Azure Function App can be found in the Microsoft Azure Function App folder.

## Web Application

The web application can be accessed on this link: https://vehicleroutingsolution.azurewebsites.net/.

The code written for the deployed web application can be found in the React folder inside the VRP Web App folder. 

### Static Website

The HTML/CSS code for the static help website is included in the Help Website folder inside the VRP Web App folder. 

## Running Python Servers

The Python servers can be run by executing the appropriate file from the Run Flask Servers folder.
For UNIX operating systems, the RunFlaskUnix.bash file should be executed.
For Windows, the RunFlaskWindows.bat file should be executed.

### Python Servers

The code for the Python Flask Servers can be found in the VRP Flask Algorithms folder inside the Run Flask Servers folder.

#### Uploading Graphs

The code for uploading the graphs to Imgur using the imgurpython library can be found in the GraphUploadScripts folder inside the VRP Flask Algorithms folder.

#### Browser Drivers

Browser drivers required by the imgurpython library for authenticating and uploading the generated graphs to Imgur.
These can be found in the Browser Drivers folder in the GraphUploadScripts folder.

### Unit Testing

Unit testing was performed using an older version of the Python servers. These have been included in the VRP Python Algorithms Unit Testing folder.

## Built With

* [Microsoft Azure](https://azure.microsoft.com/en-gb/) - Used for deployment and storage
* [React](https://reactjs.org/) - The web framework used
* [Google OR Tools](https://developers.google.com/optimization) - Used for implementing algorithms
* [Flask](https://flask.palletsprojects.com/en/1.1.x/) - Used for creating backend servers
* [imgurpython](https://github.com/Imgur/imgurpython) - Used to upload images to Imgur

## Author

**Suyash Dubey**