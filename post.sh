#!/bin/bash

name=$1
dir="src/posts/$name"
today=`date '+%Y-%m-%d'`
template="./template.mdx"

rm -r "$dir" 2> /dev/null
mkdir "$dir"
cat "$template" | sed -r "s/_date/$today/" >> "$dir"/index.mdx

echo "Created post $name"
