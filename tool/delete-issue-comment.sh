#!/usr/bin/env bash

while read item
do
    echo "\n${item}"
    # copy curl in network
    # replace commentId with ${item}
    say ha
done < list.txt
