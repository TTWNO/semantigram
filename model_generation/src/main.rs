use std::{error::Error, io::BufReader, fs::File};
use serde::{Serialize, Deserialize};
use tera::{Tera, Context};

// TODO: replace with generic "dataframe"-like structure.
// we only ever can store one label, with two data points:
// an x and y axis.
#[derive(Clone, Debug, Serialize, Deserialize)]
struct Record {
	pub year: i32,
	pub revenue: i32,
}

fn main() -> Result<(), Box<dyn Error>>{
	let mut tera = Tera::new("templates/**/*").unwrap();
	let mut ctx = Context::new();

	let file = File::open("../data.csv")?;
	let mut reader = BufReader::new(file);
	let mut rdr = csv::Reader::from_reader(reader);
	let mut all_rows = Vec::new();
	for result in rdr.deserialize() {
		let record: Record = result?;
		all_rows.push(record);
	}
	println!("{:?}", all_rows);
	ctx.insert("caption", "Revenue by Year");
	ctx.insert("records", &all_rows);
	let rendered = tera.render("table.html", &ctx).unwrap();
	println!("{rendered}");
	Ok(())
}
