#!/bin/bash
cd /home/kavia/workspace/code-generation/client-side-video-and-rhythm-band-editor-214544-214553/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

