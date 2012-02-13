
SRC_DIR = src
BUILD_DIR = build
DIST_DIR = dist

DEVELOPMENT_FILE = xdate.dev.js
PRODUCTION_FILE = xdate.js

VERSION = `cat version.txt`
VERSION_SED = sed s/@VERSION/"${VERSION}"/
DATE = `git log -1 --pretty=format:%ad`
DATE_SED = sed s/@DATE/"${DATE}"/

xdate:
	@rm -f ${BUILD_DIR}/xdate*.js
	@cat ${SRC_DIR}/xdate.js \
		| ${VERSION_SED} \
		| ${DATE_SED} \
		> ${BUILD_DIR}/${DEVELOPMENT_FILE}
	@java -jar ${BUILD_DIR}/compiler.jar \
		--warning_level VERBOSE \
		--jscomp_off checkTypes \
		--externs ${BUILD_DIR}/externs.js \
		--js ${BUILD_DIR}/${DEVELOPMENT_FILE} \
		> ${BUILD_DIR}/${PRODUCTION_FILE}
	@mkdir -p ${DIST_DIR}
	@mv ${BUILD_DIR}/${PRODUCTION_FILE} ${BUILD_DIR}/${DEVELOPMENT_FILE} ${DIST_DIR}
	
clean:
	@rm -f ${BUILD_DIR}/xdate*.js
	@rm -f ${DIST_DIR}/xdate*.js