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
      <tr>
    </thead>
    <tbody>"""
  for (index, row) in enumerate(common_fmt):
    html += """
    <tr>
      <td>{0}</td>
      <td>{1}</td>
      <td>{2}</td>
    </tr>""".format(index+1, row["Year"], row["Revenue"])
  html += "</tbody>"
  html += "</table>"

  return html


def to_svg(common_fmt):
  pass

common = common_format()
html = to_html(common)
svg = to_svg(common)

print("""
<!DOCTYPE html>
<html>
  <hbead></head>
  <body>
    {0}
    <hr/>
    {1}
  </body>
</html>
""".format(html, svg))
