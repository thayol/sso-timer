<?php

// much faster than file()
$lines = explode(
  "\n",
  str_replace(
    ["\r\n", "\r"],
    "\n",
    file_get_contents('championships.txt')
  )
); 

$location = "Unknown";
$championships_by_time = [];

// get the data into a per-event format
foreach ($lines as $line) {
  $line = trim($line);
  if (empty($line)) continue;

  if (str_contains($line, ":")) {
    $day_and_times = explode(": ", $line);
    $day = trim($day_and_times[0]);
    foreach (explode(",", trim($day_and_times[1])) as $time) {
      $championships_by_time[] = [$day, trim($time), $location];
    }
  }
  else {
    $location = str_replace(["The ", " Championship"], "", $line);
  }
}

// native JS expects dates in this format
$days = [
  'Monday'    => 1, 
  'Tuesday'   => 2,
  'Wednesday' => 3,
  'Thursday'  => 4,
  'Friday'    => 5,
  'Saturday'  => 6,
  'Sunday'    => 0,
];

$championships_by_days = [];

foreach ($championships_by_time as $championship) {
  [$day_raw, $time_raw, $location] = $championship;

  $day = $days[$day_raw];

  $time_components = explode(':', $time_raw);
  $time = 60*intval($time_components[0]) + intval($time_components[1]);

  if (!isset($championships_by_days[$day])) {
    $championships_by_days[$day] = [];
  }

  $championships_by_days[$day][$time] = $location;
}

// optional, but it's compile time so sorting doesn't really hurt performance
foreach ($championships_by_days as $key => $_value) { ksort($championships_by_days[$key]); }

$json = json_encode($championships_by_days, JSON_PRETTY_PRINT) . "\n";
file_put_contents("championships.json", $json);
