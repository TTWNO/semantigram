use std::{error::Error, io::BufReader, fs::File};
use serde::{Serialize, Deserialize};
use ::csv::Reader;
use askama::Template;

#[derive(Clone, Debug, Template)]
#[template(path = "partials/table.html")]
struct HtmlTableTemplate {
	records: Vec<Record>,
	caption: String,
}

#[derive(Clone, Debug, Template)]
#[template(path = "partials/svg.svg", escape = "none")]
pub struct SvgTemplate {
	pub x_axis_size: i32,
	pub y_axis_size: i32,
	pub x_width: i32,
	pub padding: i32,
	pub outline_color: String,
	pub fill_color: String,
	pub largest_value: i32,
	pub records: Vec<Record>,
}

mod filters {
    pub fn to_i32(idx: &usize) -> ::askama::Result<i32> {
			Ok(*idx as i32)
    }
}

// TODO: replace with generic "dataframe"-like structure.
// we only ever can store one label, with two data points:
// an x and y axis.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Record {
	pub year: i32,
	pub revenue: i32,
}

fn main() -> Result<(), Box<dyn Error>>{
	let file = File::open("../data.csv")?;
	let reader = BufReader::new(file);
	let mut rdr = Reader::from_reader(reader);
	let mut all_rows = Vec::new();
	for result in rdr.deserialize() {
		let record: Record = result?;
		all_rows.push(record);
	}
	
	let table = HtmlTableTemplate {
		records: all_rows,
		caption: "Revenue by Year".to_string(),
	};

	println!("{}", &table.render()?);
	Ok(())
}
