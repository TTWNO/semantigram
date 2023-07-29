import csv
import json

CSV_FILE_NAME = "data.csv"

def common_format():
  data = []
  with open(CSV_FILE_NAME) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
      data.append(row)
  return data

def to_html(common_fmt):
  html = """
  <table>
    <caption>
      Revenue by year
    </caption>
    <thead>
      <tr>
        <th>Index</th>
        <th>Year</th>
        <th>Revenue</th>
      </tr>
    </thead>
    <tbody>"""
  for (index, row) in enumerate(common_fmt):
    html += """
    <tr id="table-{0}">
      <td class="highlightable">{0}</td>
      <td class="highlightable">{1}</td>
      <td class="highlightable">{2}</td>
    </tr>""".format(index+1, row["Year"], row["Revenue"])
  html += "</tbody>"
  html += "</table>"

  return html


def to_svg(common_fmt):
  x_axis_size = 1000
  y_axis_size = 1000
  x_width = 50
  padding = 25
  outline_color = "none"
  fill_color = "lightblue"
  largest_value = max(map(lambda i: int(i["Revenue"]), common_fmt))
  bars = []
  for (index,row) in enumerate(common_fmt):
    value = int(row["Revenue"])
    label_name = row["Year"]
    # add padding to beginning of rectangle
    x = (x_width + padding) * index
    # calculate height based on largest value
    proportion = value / largest_value
    height = proportion * y_axis_size
    y = (1000 - height) + padding
    y_text = y + padding
    # produce SVG
    bar = f"<rect id=\"bar-{index}\" x=\"{x}\" y=\"{y}\" width=\"{x_width}\" height=\"{height}\" fill=\"{fill_color}\"></rect>"
    bar_label = f"<text x=\"{x}\" y=\"{y_text}\">{value}</text>"
    bars.append(f"{bar}{bar_label}")
  return "<svg width=\"1000\" height=\"1000\"><rect id=\"background\" x=\"0\" y=\"0\" width=\"1000\" height=\"1000\" fill=\"white\"></rect>{0}</svg>".format("".join(bars))

common = common_format()
html = to_html(common)
svg = to_svg(common)

print("""
<!DOCTYPE html>
<html>
  <head>
    <script src="websocket-client.js"></script> 
    <link rel="stylesheet" href="main.css"/>
    <script defer src="interactive-highlight.js"></script>
  </head>
  <body>
    <button onclick="highlightItem(3, true)">Highlight stuff</button>
    {0}
    <hr/>
    {1}
  </body>
</html>
""".format(html, svg))
