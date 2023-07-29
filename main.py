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
