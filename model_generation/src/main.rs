use ::csv::Reader;
use askama::Template;
use serde::{Deserialize, Serialize};
use std::{error::Error, fs::File, io::BufReader, collections::HashMap, collections::VecDeque, sync::Arc};

#[derive(Clone, Debug, Template)]
#[template(path = "partials/table.html")]
pub struct HtmlTableTemplate {
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

#[derive(Clone, Debug, Template)]
#[template(path = "partials/binary/binary.svg", escape = "none")]
pub struct BinarySvgTemplate {
  pub start_x: i32,
  pub start_y: i32,
  pub h_gap: i32,
  pub v_gap: i32,
  pub tree: BinaryTree,
}

#[derive(Clone, Debug, Template)]
#[template(path = "partials/binary/binary-table.html")]
pub struct HtmlBinaryTableTemplate {
    records: Vec<BinaryTreeRecord>,
    caption: String,
}

#[derive(Clone, Debug, Template)]
#[template(path = "partials/binary/binary_tree_html_nested_list.html")]
pub struct HtmlNestedBinaryTableTemplate {
  pub tree: String,
}

mod filters {
    pub fn default<T: std::fmt::Display>(ot: Option<T>, default: String) -> ::askama::Result<String> {
      Ok(match ot {
        Some(t) => format!("{t}"),
        None => default,
      })
    }
    pub fn to_i32<T>(idx: &T) -> ::askama::Result<i32>
    where
        i32: TryFrom<T>,
        <i32 as TryFrom<T>>::Error: std::fmt::Debug,
        T: Copy,
    {
        Ok(i32::try_from(*idx).unwrap())
    }
    pub fn to_f64(i: &i32) -> ::askama::Result<f64> {
        Ok(f64::try_from(*i).unwrap())
    }
    pub fn f_to_i32(i: &f64) -> ::askama::Result<i32> {
        Ok((*i).round() as i32)
    }
}

#[derive(Clone, Debug, Template)]
#[template(path = "alpha.html")]
pub struct AlphaTemplate {
    pub table: HtmlBinaryTableTemplate,
    pub svg: BinarySvgTemplate,
    pub html: HtmlNestedBinaryTableTemplate,
}

// TODO: replace with generic "dataframe"-like structure.
// we only ever can store one label, with two data points:
// an x and y axis.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Record {
    pub year: i32,
    pub revenue: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize, Copy, PartialEq)]
#[serde(rename_all="lowercase")]
pub enum Direction {
  Left,
  Right,
}
impl std::fmt::Display for Direction {
  fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
    match self {
      Self::Left => write!(f, "left"),
      Self::Right => write!(f, "right"),
    }
  }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct BinaryTreeRecord {
  pub id: i32,
  pub name: String,
  pub value: String,
  pub parent: Option<i32>,
  pub direction: Option<Direction>,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum Relationship {
  Parent,
  LeftChild,
  RightChild,
}
impl ToString for Relationship {
  fn to_string(&self) -> String {
    match self {
      Relationship::Parent => "Parent",
      Relationship::LeftChild => "Left child",
      Relationship::RightChild => "Right child",
    }.to_string()
  }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct BinaryTree(Vec<BinaryTreeRecord>);

impl BinaryTree {
  fn children(&self, node: &BinaryTreeRecord) -> Self {
    BinaryTree(self.0.clone().into_iter().filter(|n| n.parent == Some(node.id)).collect())
  }
  fn parent(&self, node: &BinaryTreeRecord) -> Option<BinaryTreeRecord> {
    self.0.clone().into_iter().find(|n| Some(n.id) == node.parent)
  }
  fn direction_to_i32(&self, node: &BinaryTreeRecord) -> i32 {
    let mut i32direction = 0;
    if node.direction == Some(Direction::Left) {
      i32direction = -1
    } else if node.direction == Some(Direction::Right) {
      i32direction = 1
    }
    i32direction
  }
  fn x_shifting(&self, node: &BinaryTreeRecord) -> f64 {
    let mut x_shift = 0.0;
    let mut try_parent = self.parent(node);
    while try_parent.is_some() {
      let parent_node = try_parent.unwrap();
      let depth = self.depth(&parent_node) as f64;
      if depth != 0.0 {
        if parent_node.direction == Some(Direction::Left) {
          x_shift -= 1.0 / depth;
        } else {
          x_shift += 1.0 / depth;
        }
      }

      try_parent = self.parent(&parent_node)
    }

    x_shift
  }
  fn depth(&self, node: &BinaryTreeRecord) -> i32 {
    let mut depth = 0;
    let mut try_parent = self.parent(node);
    while try_parent.is_some() {
      depth+=1;
      try_parent = self.parent(&try_parent.unwrap());
    }
    depth
  }
  fn find(&self, id: i32) -> Option<BinaryTreeRecord> {
    self.0
      .iter()
      .find(|btr| btr.id == id)
      .cloned()
  }
  fn has_ancestor(&self, node: &BinaryTreeRecord, ancestor: &BinaryTreeRecord) -> bool {
    let mut parent = node;
    while let Some(parent) = self.parent(parent) {
      if parent.id == ancestor.id {
        return true;
      }
    }
    false
  }
  fn subtree(&self, node: &BinaryTreeRecord) -> Self {
    BinaryTree(self.0.clone().into_iter()
      .filter(|r| self.has_ancestor(node, r))
      .collect())
  }
  fn connections(&self, node: &BinaryTreeRecord) -> Vec<(Relationship, i32)> {
    let mut conns = Vec::new();
    if let Some(parent) = self.parent(node) {
      conns.push((Relationship::Parent, parent.id));
    }
    self.children(node).0
      .iter()
      .map(|child| match child.direction {
        Some(Direction::Left) => (Relationship::LeftChild, child.id),
        Some(Direction::Right) => (Relationship::RightChild, child.id),
        None => panic!("A child has no direction; this should never happen, and it means there is bad data!"),
      })
      .for_each(|connection| conns.push(connection));
    conns
  }
  fn to_html_connections(&self, node: &BinaryTreeRecord) -> String {
    let parent = self.parent(node);
    let children = self.children(node);
    let mut html = String::new();
    html += "<details><summary>Connections</summary>";
    let conns = self.connections(node);
    if conns.len() > 0 {
      html += "<ul>";
      for con in conns {
        html += "<li>";
        let con_node = self.find(con.1).expect("Could not find node with a certain ID. You have bad data!");
        html += &format!("<label for=\"con-{}-with-{}\">", node.id, con_node.id);
        html += &con.0.to_string();
        html += "</label>";
        // to select a child connection, we must actually select the parent column on the child
        // but to select a parent connection, we simply use the parent column of the current node
        let row_id = match con.0 {
          Relationship::Parent => node.id,
          Relationship::LeftChild | Relationship::RightChild => con_node.id,
        };
        html += &format!("<input class=\"highlightable sr-only\" id=\"con-{}-with-{}\" type=\"checkbox\" data-row=\"{}\" data-col=\"{}\"/>", node.id, con_node.id, row_id, 3);
        html += "</li>";
      }
      html += "</ul>";
    } else {
      html += "There are no connections";
    }
    html += "</details>";
    html
  }
  fn to_html_single(&self, node: &BinaryTreeRecord) -> String {
    let mut html = String::new();
    html += "<li role=\"treeitem\" tabindex=\"-1\">";
    html += "<span>";
    html += &format!("<label for=\"node-{}\">", node.id);
    if let Some(dir) = node.direction {
      html += &format!("{} ({})", node.value, dir);
    } else {
      html += &format!("{}", node.value);
    }
    html += "</label>";
    html += &format!("<input class=\"highlightable sr-only\" type=\"checkbox\" id=\"node-{}\" data-row=\"{}\" data-col=\"{}\"/>", node.id, node.id, 2);
    html += &self.to_html_connections(node);
    let children = self.children(node);
    if children.0.len() > 0 {
      html += "<ul role=\"group\">";
      for child in children.0 {
        html += &self.to_html_single(&child);
      }
      html += "</ul>";
    }
    html += "</li>";
    html += "</span>";
    html
  }
}
impl IntoNestedList for BinaryTree {
  fn to_html(&self) -> String {
    let root = self.0.first().expect("Does not have a root node!");
    let mut html = String::new();
    html += "<ul role=\"tree\">";
    html += &self.to_html_single(root);
    html += "</ul>";
    html
  }
}

trait IntoNestedList {
  fn to_html(&self) -> String;
}

// fn table_data() -> Result<(), Box<dyn Error>>{
//     let file = File::open("../data.csv")?;
//     let reader = BufReader::new(file);
//     let mut rdr = Reader::from_reader(reader);
//     let mut all_rows = Vec::new();
//     for result in rdr.deserialize() {
//         let record: Record = result?;
//         all_rows.push(record);
//     }

//     let table = HtmlTableTemplate {
//         records: all_rows.clone(),
//         caption: "Revenue by Year".to_string(),
//     };
//     let largest_value = all_rows
//         .iter()
//         .max_by_key(|r| r.revenue)
//         .unwrap()
//         .revenue
//         .clone()
//         .into();
//     let svg = SvgTemplate {
//         records: all_rows,
//         x_axis_size: 1000.into(),
//         y_axis_size: 1000.into(),
//         x_width: 50.into(),
//         padding: 25.into(),
//         outline_color: "none".to_string(),
//         fill_color: "lightblue".to_string(),
//         largest_value,
//     };
//     let alpha = AlphaTemplate { svg, table };

//     println!("{}", &alpha.render()?);
//     Ok(())
// }

fn binary_tree_data() -> Result<(), Box<dyn Error>>{
    let file = File::open("../binary_data.csv")?;
    let reader = BufReader::new(file);
    let mut rdr = Reader::from_reader(reader);
    let mut all_rows = Vec::new();

    for result in rdr.deserialize() {
        let record: BinaryTreeRecord = result?;
        all_rows.push(record);
    }
    let btree = BinaryTree(all_rows.clone());

    // println!("{:?}", all_rows);
    // let tree_nodes: SinfulBinaryTreeNode = all_rows.into();
    // println!("{:?}", tree_nodes);
    let html = HtmlNestedBinaryTableTemplate {
        tree: btree.to_html(),
    };

    let table = HtmlBinaryTableTemplate {
        records: all_rows.clone(),
        caption: "Binary Tree Data".to_string(),
    };

    let svg = BinarySvgTemplate {
      tree: btree.clone(),
      start_x: 300,
      start_y: 20,
      h_gap: 80,
      v_gap: 60,
    };

    // let largest_value = all_rows
    //     .iter()
    //     .max_by_key(|r| r.revenue)
    //     .unwrap()
    //     .revenue
    //     .clone()
    //     .into();

    // let svg = SvgTemplate {
    //     records: all_rows,
    //     x_axis_size: 1000.into(),
    //     y_axis_size: 1000.into(),
    //     x_width: 50.into(),
    //     padding: 25.into(),
    //     outline_color: "none".to_string(),
    //     fill_color: "lightblue".to_string(),
    //     largest_value,
    // };

    let alpha = AlphaTemplate { table, svg, html };

    println!("{}", &alpha.render()?);

    Ok(())
}

fn main() -> Result<(), Box<dyn Error>> {
  Ok(binary_tree_data()?)
}


#[cfg(test)]
mod tests {
  use crate::BinaryTree;
  use crate::BinaryTreeRecord;
  use csv::Reader;
  use std::io::BufReader;
  use std::fs::File;

  #[test]
  fn test_depth_calc(){
    let file = File::open("../binary_data.csv").unwrap();
    let reader = BufReader::new(file);
    let mut rdr = Reader::from_reader(reader);
    let mut all_rows = Vec::new();

    for result in rdr.deserialize() {
        let record: BinaryTreeRecord = result.unwrap();
        all_rows.push(record);
    }
    let row_clone = all_rows.clone();
    let last = row_clone.last().unwrap();
    let tree = BinaryTree(all_rows);
    assert_eq!(tree.depth(last), 3);
  }

  #[test]
  fn test_x_shift(){
    let file = File::open("../binary_data.csv").unwrap();
    let reader = BufReader::new(file);
    let mut rdr = Reader::from_reader(reader);
    let mut all_rows = Vec::new();

    for result in rdr.deserialize() {
        let record: BinaryTreeRecord = result.unwrap();
        all_rows.push(record);
    }
    let row_clone = all_rows.clone();
    let last = row_clone.last().unwrap();
    let tree = BinaryTree(all_rows);
    assert_eq!(tree.x_shifting(last), 1.5);
  }

  #[test]
  fn test_direction_to_i32() {
    let file = File::open("../binary_data.csv").unwrap();
    let reader = BufReader::new(file);
    let mut rdr = Reader::from_reader(reader);
    let mut all_rows = Vec::new();

    for result in rdr.deserialize() {
        let record: BinaryTreeRecord = result.unwrap();
        all_rows.push(record);
    }
    let row_clone = all_rows.clone();
    let last = row_clone.last().unwrap();
    let tree = BinaryTree(all_rows);
    assert_eq!(tree.direction_to_i32(last), -1);
  }
}
