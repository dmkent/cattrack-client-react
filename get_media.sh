#!/bin/bash

mkdir -p media/fonts media/css

for fname in css/bootstrap-theme.min.css css/bootstrap.min.css fonts/glyphicons-halflings-regular.woff2;
do
    curl "https://maxcdn.bootstrapcdn.com/bootstrap/latest/${fname}" -o media/${fname}
done
