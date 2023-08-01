# InceptionU Hackathon July 2023

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
