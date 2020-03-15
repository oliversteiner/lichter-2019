#!/usr/bin/env bash
# Copy Dist to Prodution Server via SSH
#

# Import Config
# source deploy.config.sh
# - TARGET
# - SERVER
# - USER
source deploy.config.prod.sh


DIST_DIRECTORY='dist'
DIST_NAME='lichter'
CURRENTDATE=$(date +"%Y-%m-%d")
FILE_NAME=${DIST_NAME}'-'${CURRENTDATE}


# build Production Dist

# ng build --prod

# change to dist Directory
cd "${DIST_DIRECTORY}" ||  exit


# Zip files
echo ''
echo '------------------------'
echo 'Zip files...'
echo ''
# zip -r -X archive_name.zip folder_to_compress
zip -r -X "${FILE_NAME}" ${DIST_NAME}

# Copy to server via SSH
# https://linuxize.com/post/how-to-use-scp-command-to-securely-transfer-files/
echo ''
echo '------------------------'
echo 'copy dist to '${SERVER}'...'
echo ''

scp "${FILE_NAME}.zip" pi@iot-server.local:/var/www/
cd ..

# unzip on Remote Server
ssh -tt pi@iot-server.local << EOF
cd ${TARGET}
unzip -o "${FILE_NAME}.zip"
rm "${FILE_NAME}.zip"
sudo nginx -s reopen
exit
EOF

open "http://${SERVER}"

# app.js


# FILE=${ANALYTICS}'/app.js'
# if test -f "$FILE"; then
#    echo ''
#    echo "done."
# fi
# echo '------------------------'
# cd ${TARGET} || exit
# drush cr
# open ${URL}
# echo ''
