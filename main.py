import csv

CSV_FILE_NAME = "data.csv"

def common_format():
  data = []
  with open(CSV_FILE_NAME) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
      data.append(row)
  return data

def to_html(common_fmt):
  pass

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
    y_text = 1000 - padding
    # produce SVG
    bar = f"<rect x=\"{x}\" y=\"{y}\" width=\"{x_width}\" height=\"{height}\" fill=\"{fill_color}\"></rect>"
    bar_label = f"<text x=\"{x}\" y=\"{y_text}\">{value}</text>"
    bars.append(f"{bar}{bar_label}")
  return "<svg width=\"1000\" height=\"1000\"><rect id=\"background\" x=\"0\" y=\"0\" width=\"1000\" height=\"1000\" fill=\"white\"></rect>{0}</svg>".format("".join(bars))

common = common_format()
html = to_html(common)
svg = to_svg(common)

print("""
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    {0}
    <hr/>
    {1}
  </body>
</html>
""".format(html, svg))
