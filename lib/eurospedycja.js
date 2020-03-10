#!/usr/bin/env bash
ID="8252-1408573"

echo "Paka nr: $ID"
curl -s http://app.eurospedycja.com/api/tracking/$ID?locale=pl | jq -r '(.response | sort_by(.event_time) | .[] | [.event_time, .event_place, .event_title]) | @tsv'
