===============================================================
README.TXT
Created by Dee Luo and Mike Sciarrino
Innovative Decisions, Inc. @August2015
===============================================================
CONTENT of Latest Working Version (AOAWebApp_Aug6.zip)

The folder should contain the following files:
	-ReadMe.txt
	-index.html
	-value.html
	-cost.html
	-display.html
	-js folder:
		-bootstrap.js
		-highcharts.js
	-css folder:
		-bootstrap-theme.css
		-bootstrap.css
		-custom.css
	-fonts folder:
		-glyphicons-halflings-regular.eot
		-glyphicons-halflings-regular.svg
		-glyphicons-halflings-regular.ttf
		-glyphicons-halflings-regular.woff
		-glyphicons-halflings-regular.woff2

Also included are files for MarkLogic set up:
	-marklogic_config folder:
		-admin-account-xml.xml
		-admin-account.json
		-license-xml.xml
		-license.json
		-rest-instance.json
		-rest-instance.xml
		-Install_Setup.pdf


===============================================================
SETTING UP YOUR COMPUTER

MARKLOGIC
The original MarkLogic setup instructions are included in the zip file, which you can also use for reference. Note that this provided process is specific for Windows and must be altered slightly for Mac OSX.

Download and Setup:
-Save the marklogic_config folder somewhere on your computer. Replace all instances of "/pathtofiles/" with your specific path
-Download MarkLogic 8: https://developer.marklogic.com/products
-Choose "Typical" Installation when prompted
-Click Next until the installation is complete

For Mac Users:
	-Start MarkLogic Server: System Preferences -> MarkLogic -> Start MarkLogic Server

For Windows Users:
	-Start MarkLogic Server: Start -> Control Panel -> Administrative Tools -> Services
	-Download curl:
		- Go to the following website url: http://www.confusedbycode.com/curl/#downloads
		- Click the "I am not a robot" button
		- Select the following links to download:
			- With Administrator Privileges (free) "curl-7.43.0-win64.msi"
			- Files Only (free) "curl-7.43.0-win64.zip"
			- Extract the folders from the zip file to the C drive
			(Your files should all be under the path C:\curl)

In Terminal/Command Prompt:
	-Use this command to configure the license: curl --anyauth --user user:password -X POST -d@"/pathtofiles/license.json" -i -H "Content-type:application/json" http://localhost:8001/admin/v1/init
		-You should receive an "HTTP Accepted" message
	-Use this command to setup the admin account: curl -X POST -d@"/pathtofiles/admin-account.json" -i -H "Content-type: application/json" http://localhost:8001/admin/v1/instance-admin
		-You should receive a restart message with a timestamp of the last server restart
	-Use this command to setup a MarkLogic REST API Instance: curl --anyauth --user admin:admin -X POST -d@"/pathtofiles/rest-instance.xml" -i -H "Content-type: application/xml" http://localhost:8002/v1/rest-apis
		-You should see an "HTTP Created" message (don't worry if you see an "HTTP Unauthorized" message first)

In your browser navigate to http://localhost:8001. When prompted for credentials, use:
	Username = admin
	Password = admin
And you should have successfully navigated to the administration interface for MarkLogic. 

Create Database Server:
-On the administration interface (http://localhost:8001), click on AppServers. 
-Click the second tab "Create HTTP"
-Name your server (ex: doc-rest)
-Enter "/" as your root (without the quotes)
-Specify your port (ex: 8016) **YOU WILL NEED THIS LATER FOR APACHE**
-Scroll down to authentication, choose "basic"
-Click ok

Test: Navigate to the port you listed (ex: http://localhost:8016) and check that there is a MarkLogic REST Server set up on this port. 

The documents database is currently empty. Once you start sending data to the server through the webapp, you can see what documents you have loaded in:
	-Navigate to the Query Console on http://localhost:8000
	-Choose Content Source: Documents("whateveryoursevernameis-modules: /"), and hit Explore. 


APACHE
Setting up Apache does not need to follow the exact instructions below. For example, you need to put all files into whatever directory path you specify in your Apache configuration file. You should however specify a port for Apache to run on (ex: 8018 instead of letting Apache listen to all 80* ports) to avoid overlapping servers with MarkLogic.

For Mac Users:
	There is a built in version of Apache that we will be using. 
	In Terminal:
		-Start Apache: sudo apachectl start
		-Stop Apache: sudo apachectl stop
		-Restart Apache: sudo apachectl restart
		-Check Apache Version: httpd -v
	Configuration File:
	Path: /private/etc/apache2/httpd.conf
	Edits:
		1. Line 52: Specify localhost port where Apache will run. For example, change from "Listen 80" to "Listen 8018"
			-Listen 80 means that Apache will run on any ports beginning with 80. This may interfere with the MarkLogic server if that port is also defined with 80. 
		-Add the bottom of the file add:
			2. ProxyPass /v1/documents http://localhost:8016/v1/documents
			3. ProxyPassReverse /v1/documents http://localhost:8016/v1/documents
			*This will depend on which port you have defined in your MarkLogic server, we used Port 8018*
	After you edit your config file, YOU MUST restart Apache in order for your changes to take effect. 

	Default directory to put files: /Library/WebServer/Documents
	We advise creating a folder (ex: AOA) within the default directory to keep all files for this specific project.
	URL: http://localhost:8018/AOA

For Windows Users:
**Note** - We did not figure out how to link the Windows Apache to the MarkLogic Server

- Before you download Apache, go to the following website url and download Microsoft Visual C++ 2015: https://www.microsoft.com/en-us/download/details.aspx?id=46881

	- Go to http://httpd.apache.org/
	- Click "From a Mirror" on the sidebar
	- Scroll down and click on the link that says "Files for Microsoft Windows"
	- Click on the "ApacheLounge" link
	- Choose the appropriate version (32-bit or 64-bit) for your machine and download the zip file
	- Extract the files anywhere on your machine
	- Once you have extracted the files, copy the "Apache24" folder into your C drive

	- Locate the configuration file via the following path: C:\Apache24\conf\http.conf
	- You must now make the following changes to the config file:

		- Ensure that all references to the server root are "C:\Apache24"

		There are several lines you should change for your production environment:
			- Line 46, listen to all requests on port 80:
			- Listen *:80
			- Line 116, enable mod-rewrite by removing the # (optional, but useful):
			- LoadModule rewrite_module modules/mod_rewrite.so
			- Line 172, specify the server domain name:
			- ServerName localhost:80
			- Line 224, allow .htaccess overrides:
			- AllowOverride All
		
		Add the following lines to the bottom of the file:
			- ProxyPass /v1/documents http://localhost:8015/v1/documents
			- ProxyPassReverse /v1/documents http://localhost:8015/v1/documents
			
		Preform the following commands in your Windows Command Prompt
			- Run the Command Prompt as an administrator (Right Click on Application and select "Run as administrator")
			- Navigate to C:\Apache24\bin
			- Type "httpd -t" and fix any errors in the httpd.conf file that the window presents
			- Type the command "httpd -k install" to install Apache
			- Once Apache is successfully installed, just type "httpd" to run it
			
		- Go to your browser and type "http://localhost" to make sure it works!

===============================================================
WORKING VERSION WEBAPP FUNCTIONALITY
All code is commented - see code for specific functions, formatting, tags, etc. 

URL: http://localhost:8018/AOA or whatever port/folder you used
Should direct you to "index.html", the home page. 

Latest Working functionality: 
index.html:
	-Simple home page with Start button that takes you to the Value Model (value.html)
	-Top high-level navigation that allows you to move on to the Value Model, but not the Cost or Display/Calculations tabs. 

value.html:
	-Top high-level navigation with "Active" tab and next steps disabled, fixed to top of page when scrolling. The Home page button brings you back to index.html
	-Sidebar navigation that shows "active" section, directs you to in-page sections, and changes dynamically with scrolling
	-Metric Definition Section:
		-Input Form for Metric Name, Objective, Goal, Assumptions, Considerations, and a Measures table  
		-Save Metric button will populate Metric name in sections below, add the metric to the Summary List, bring up a blank form for the next metric, and navigate to the top of the form. The current page can handle three metrics.
		-You can click on the metric in the summary list to bring up the form for that specific metric
		-After the third metric is saved, the data is sent to the MarkLogic server. A Window Alert will pop up to indicate the data was sent successfully. 
		-To check the data in MarkLogic, navigate to Query Console (http://localhost:8000), choose your server in the Content Source dropdown, and hit explore. You should see the file (name specified in code) and be able to click on it to see the three metric names you entered. 
		-Reset Metric will reset all metrics, clear the summary list, and hide any following sections
	-Metric Prioritization Section (hidden until three metrics are defined):
		-The Metric column will be populated after hitting Save Metric in the previous section
		-User should enter inputs in the Relative Weights column
		-Save Weights button should calculate the rank and normalized based on the entered relative weights. A pie chart visualization will appear.
		-Reset Weights will clear the table and hide following sections
	-Alternative Descriptions Section (hidden until weights are defined): 
		-Metric names will be populated after hitting Save Metric in the first section
		-User can input the alternative names and their measures for each metric
		-Reset Alternatives will clear the table
		-Save Alternatives saves values to be carried to the next page
	-Finish Value Model button will take you to the Cost Model and pass data appropriately (cost.html)

cost.html:
	-Top high-level navigation with "Active" tab and next steps disabled, fixed to top of page when scrolling. The Home page button brings you back to index.html
	-Cost Summary Section: 
		-User can input costs for each alternative
		-Reset Costs will clear the table
		-Save Costs does not do anything yet
	-Finish Cost Model button will take you to the Display/Calculations (display.html)

display.html
	-Top high-level navigation with "Active" tab and next steps disabled, fixed to top of page when scrolling. The Home page button brings you back to index.html
	-Sidebar navigation that shows "active" section, directs you to in-page sections, and changes dynamically with scrolling
	-Everything else on page is filler, no built in functionality yet

===============================================================
LIST OF FUTURE IMPROVEMENTS TO BE MADE
-Change Alternative Description table so each alternative has it's own form and is entered one by one and added to a summary list, similar to the current metric definition setup. 
-Show save alert when save buttons are clicked
-Send all data to MarkLogic, not just the Metric Definition
-Add graphics to cost page
-Finish functionality to display/calculations page


