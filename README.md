# Semantigram

- Originally a one-day hackathon project.
- Since then it has grown to become something I've shwon off at [YYC DataCon](https://www.yycdata.ca/datacon)
- The concept is in two parts:
	1. Allow interoperable representations of data: visual _diagrams_, HTML, plain-text, tables, etc. Some of these formats ought to be accessible to the blind using _semantic_ HTML.
	2. Allow changes to the data: highlights, edits, add/removes to be interoperably applied, regardless of the representation. Changes should be announced to screen-reader users in accessible formats.
- It combines _semantics_ and _diagrams_.

## TODOs/Dones

* Create a common data format to convert to:
  * SVG: Yes
  * SVG (tactile diagram): Not yet
  * HTML: Not yet
  * `<table>`: Yes
* Limitations
  * Data needs to be within the same order of magnintute (i.e., no support for logarithmic y axis)
  * No colour-blind palette
  * Uses JS
  * Lots of fixed values that aren't constified
  * Font size is small
	* Uses manual float/integer conversions in Rust
		* This should be fixed by using a arbitrary precision library that has support with `askama`.

## Usage

To create the HTML file, and launch the websocket server, simply use the `Makefile` via the `make` command.
Then, open the HTML file in a local browser.
