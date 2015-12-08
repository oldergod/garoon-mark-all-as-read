#!/bin/bash
set -e
BASEDIR=$(cd $(dirname $0)/..; pwd)
cd $BASEDIR

java -jar node_modules/google-closure-templates/javascript/SoyToJsSrcCompiler.jar \
  --shouldGenerateJsdoc \
  --shouldProvideRequireSoyNamespaces \
  --srcs app/template/maar.soy \
  --outputPathFormat app/javascript/maar.soy.js

java -jar node_modules/google-closure-compiler/compiler.jar \
  --closure_entry_point garoon.maar.contentScript.init \
  --only_closure_dependencies \
  --js_output_file app/javascript/cs.js \
  --compilation_level="ADVANCED_OPTIMIZATIONS" \
  --formatting="PRETTY_PRINT" \
  --warning_level="VERBOSE" \
  --externs="app/externs/url.js" \
  --jscomp_error="accessControls" \
  --jscomp_error="ambiguousFunctionDecl" \
  --jscomp_error="checkEventfulObjectDisposal" \
  --jscomp_error="checkRegExp" \
  --jscomp_error="checkTypes" \
  --jscomp_error="checkVars" \
  --jscomp_error="conformanceViolations" \
  --jscomp_error="const" \
  --jscomp_error="constantProperty" \
  --jscomp_error="deprecated" \
  --jscomp_error="duplicateMessage" \
  --jscomp_error="es3" \
  --jscomp_error="es5Strict" \
  --jscomp_error="externsValidation" \
  --jscomp_error="fileoverviewTags" \
  --jscomp_error="globalThis" \
  --jscomp_error="inferredConstCheck" \
  --jscomp_error="internetExplorerChecks" \
  --jscomp_error="invalidCasts" \
  --jscomp_error="misplacedTypeAnnotation" \
  --jscomp_error="missingGetCssName" \
  --jscomp_error="missingProperties" \
  --jscomp_error="missingProvide" \
  --jscomp_error="missingRequire" \
  --jscomp_error="missingReturn" \
  --jscomp_error="newCheckTypes" \
  --jscomp_error="nonStandardJsDocs" \
  --jscomp_error="suspiciousCode" \
  --jscomp_error="strictModuleDepCheck" \
  --jscomp_error="typeInvalidation" \
  --jscomp_error="undefinedNames" \
  --jscomp_error="undefinedVars" \
  --jscomp_error="unknownDefines" \
  --jscomp_error="uselessCode" \
  --jscomp_error="useOfGoogBase" \
  --jscomp_error="visibility" \
  app/javascript/** \
  node_modules/google-closure-library/closure/** \
  node_modules/google-closure-templates/javascript/*.js

