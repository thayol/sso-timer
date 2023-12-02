# Star Stable Timer

## Setup

1. Put your favicon to `src/favicon-32x32.png` and your page background to `src/background.jpg`
1. Perform the championship time update
1. Install PHP 8 or newer (only needed for the data processing step
1. Make sure to keep the asset/folder structure intact when hosting

## Updating Championship Times

[The official site](https://www.starstable.com/game/championships) has the times published as images, so it isn't really possible to fetch them without OCR, and even then the publised times are quite out of date usually...

Since most other sources are outdated too, you will have to hand-type your championship times. Save them into `data/championships.txt` in the following format:

```
The Something Championship

Monday: 00:10, 02:00, 03:30
Tuesday: 09:00, 10:00

Somewhere Else

Tuesday: 01:30, 01:50, 01:59
Wednesday: 02:00, 03:00, 04:00
```

Then execute:

```sh
cd data
php championships-to-json.php
```

Once the command completes, you have the latest schedule ready to use.
