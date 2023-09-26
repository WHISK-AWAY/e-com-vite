#!/bin/bash

getopts b: flag;

echo "Setting group & permissions...";
sudo chgrp -R www-data /var/www/astoria/html 2>> build_err.log;
sudo chmod -R g+w /var/www/astoria/html  2>> build_err.log;
sudo chgrp -R www-data /srv/git/astoria  2>> build_err.log;
sudo chmod -R g+w /srv/git/astoria  2>> build_err.log;

# pull branch if given
if [ $flag = b ]
	then
		echo "Pulling branch...";
		branch_name=${OPTARG};
		git pull origin $branch_name 2>> build_git_err.log;
		echo $branch_name;
fi

echo "Running npm install...";
npm install  2>> build_err.log;

echo "Building...";
npm run build  2>> build_err.log;

echo "Restarting nginx...";
sudo nginx -s reload  2>> build_err.log;

echo "All done!"
